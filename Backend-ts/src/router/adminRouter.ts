import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import { AdminLogin } from "../validation/userSchema";
import { verifyToken } from "../middlewares/auth";
import { AuthRequest } from "../Types/types";
import pool from "../config/db"; // PostgreSQL DB connection

const router = Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin and issue JWT (stored in HttpOnly cookie)
 * @access  Public
 */
router.post("/login", validate(AdminLogin), loginAdmin);

/**
 * @route   GET /api/admin/verify
 * @desc    Verify admin authentication & fetch role + permissions
 * @access  Private (requires JWT)
 */
router.get("/verify", verifyToken, async (req: AuthRequest, res) => {
  try {
    // Check if user exists in request (set by verifyToken middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Step 1: Fetch role name for the logged-in admin
    const roleResult = await pool.query(
      `SELECT role_name FROM roles WHERE role_id = $1`,
      [req.user.role_id]
    );
    const roleName = roleResult.rows[0]?.role_name;

    if (!roleName) {
      return res.status(403).json({ message: "Role not found" });
    }

    // Step 2: Fetch permissions assigned to this role
    const permResult = await pool.query(
      `SELECT permission_name FROM permissions WHERE role_id = $1`,
      [req.user.role_id]
    );
    const permissions = permResult.rows.map((row) => row.permission_name);

    // Step 3: Respond with admin details, role, and permissions
    res.json({
      success: true,
      admin: req.user,
      role: roleName,
      permissions,
      message: `Welcome ${roleName}`,
    });
  } catch (error) {
    console.error("Error in /verify route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   POST /api/admin/logout
 * @desc    Logout admin by clearing JWT cookie
 * @access  Private
 */
router.post("/logout", logoutAdmin);

export default router;
