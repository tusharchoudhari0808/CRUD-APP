import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import conn from "../config/db";
import { success, error } from "../utils/response";
import { AdminLogin, jwtPayload } from "../Types/types";
import { encryptToken } from "../utils/crypto";
//  JWT secret is defined
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const SECRET: string = process.env.JWT_SECRET;

// Create Admin

async function createAdmin(name: string, email: string, password: string) {
  try {
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // // check if admin already exists
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
      INSERT INTO admin_user (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING admin_id, name, email
    `;
    const result = await conn.query(sql, [name, email, hash]);

    console.log(" Admin created:", result.rows[0]);
  } catch (err) {
    console.error("Error in createAdmin:", err);
    throw new Error("Failed to create admin");
  }
}

if (process.env.NAME && process.env.EMAIL && process.env.PASSWORD) {
  createAdmin(process.env.NAME, process.env.EMAIL, process.env.PASSWORD).catch(
    console.error
  );
}

// Admin Login

export const loginAdmin = async (
  req: Request<{}, {}, AdminLogin>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const checkAdmin = await conn.query(
      "SELECT admin_id, name, email, password FROM admin_user WHERE email = $1",
      [email]
    );

    if (checkAdmin.rows.length === 0) {
      return error(res, "Invalid email or password", 401);
    }

    const admin = checkAdmin.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, "Invalid email or password", 401);
    }

    // JWT payload
    const payload: jwtPayload = {
      adminId: admin.admin_id,
      email: admin.email,
    };

    // Sign JWT
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
    

    const encryptionToken = encryptToken(token);

    // Set cookie (httpOnly prevents JS access)
    res.cookie("token", encryptionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in prod
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    //  Do NOT send token in body
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
    console.error("Error in loginAdmin:", err);
    return error(res, "Internal Server Error", 500);
  }
};


///logout endpoint 

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return success(res, {}, "Logout successful", 200);
  } catch (err) {
    console.error("Error in logoutAdmin:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};