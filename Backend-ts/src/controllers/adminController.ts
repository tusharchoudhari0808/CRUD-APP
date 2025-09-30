import { Request, Response } from "express";
import bcrypt from "bcryptjs";                 // For password hashing & comparison
import jwt from "jsonwebtoken";               // For generating JWT tokens
import conn from "../config/db";              // PostgreSQL connection pool
import { success, error } from "../utils/response"; // Custom response helpers
import { AdminLogin, jwtPayload } from "../Types/types"; // Type definitions
import { encryptToken } from "../utils/crypto";         // Custom token encryption

// Ensure JWT secret is defined
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const SECRET: string = process.env.JWT_SECRET;

/* ============================================================
   CREATE ADMIN FUNCTION
   - Hash password
   - Check if admin already exists
   - Insert into DB if not
============================================================ */
async function createAdmin(
  name: string,
  email: string,
  password: string,
  role_id: string
) {
  try {
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS); // Hash password

    // Check if admin with same email already exists
    const checkAdmin = await conn.query(
      "SELECT email FROM admin_user WHERE email = $1",
      [email]
    );
    if (checkAdmin.rows.length > 0) {
      console.log(" Admin already exists with this email.");
      return;
    }

    // Insert new admin
    const sql = `
      INSERT INTO admin_user (name, email, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING admin_id, name, email, role
    `;
    const result = await conn.query(sql, [name, email, hash, role_id]);

    console.log(" Admin created:", result.rows[0]);
  } catch (err) {
    console.error(" Error in createAdmin:", err);
    throw new Error("Failed to create admin");
  }
}

//  Automatically create an admin if ENV variables are provided
if (
  process.env.NAME &&
  process.env.EMAIL &&
  process.env.PASSWORD &&
  process.env.ROLE_ID
) {
  createAdmin(
    process.env.NAME,
    process.env.EMAIL,
    process.env.PASSWORD,
    process.env.ROLE_ID
  ).catch(console.error);
}

/* ============================================================
   LOGIN ADMIN ENDPOINT
   - Verify email & password
   - Generate JWT
   - Encrypt token & set in cookie
   - Return admin details (no token in body)
============================================================ */
export const loginAdmin = async (
  req: Request<{}, {}, AdminLogin>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    // 1. Check if admin exists
    const checkAdmin = await conn.query(
      "SELECT admin_id, name, email, password, role_id FROM admin_user WHERE email = $1",
      [email]
    );

    if (checkAdmin.rows.length === 0) {
      return error(res, "Invalid email or password", 401);
    }

    const admin: jwtPayload = checkAdmin.rows[0];
    console.log(" Found Admin:", admin);

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, "Invalid email or password", 401);
    }

    // 3. Create JWT payload
    const payload: jwtPayload = {
      adminId: admin.admin_id,
      email: admin.email,
      role_id: admin.role_id,
    };

    // 4. Sign JWT (expires in 1 hour)
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    // 5. Encrypt token before storing in cookie
    const encryptionToken = encryptToken(token);

    // 6. Send token as HTTP-only cookie
    res.cookie("token", encryptionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    // 7. Respond with admin details (no token in response body)
    return success(
      res,
      {
        admin: {
          admin_id: admin.admin_id,
          name: admin.name,
          email: admin.email,
        },
      },
      "Login successful",
      200
    );
  } catch (err) {
    console.error(" Error in loginAdmin:", err);
    return error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   LOGOUT ADMIN ENDPOINT
   - Clear token cookie
   - Return success response
============================================================ */
export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    // Clear JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return success(res, {}, "Logout successful", 200);
  } catch (err) {
    console.error(" Error in logoutAdmin:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
