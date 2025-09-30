import { Response, NextFunction } from "express";
import { AuthRequest } from "../Types/types";
import pool from "../config/db";

// Define the shape of a permission row returned from the database
interface PermissionRow {
  permission_name: string;
}

/**
 * Middleware factory: authorisePermission
 * ---------------------------------------
 * Returns an Express middleware function that checks if the authenticated user
 * has the required permission to access a route.
 *
 * @param permission - The required permission name (string).
 * @returns Express middleware function.
 */
function authorisePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Step 1: Get the user's role_id from the request object (set earlier in verifyToken).
      const userRoleId = req.user?.role_id;

      if (!userRoleId) {
        // If no role_id is found, deny access.
        return res.status(401).json({ message: "Unauthorized: No role found" });
      }

      // Step 2: Query the permissions table to fetch all permissions for the user's role.
      const result = await pool.query<PermissionRow>(
        `SELECT permission_name FROM permissions WHERE role_id = $1`,
        [userRoleId]
      );

      // Step 3: Extract permission names into a simple array.
      const permissions = result.rows.map((row) => row.permission_name);

      // Step 4: Normalize (trim + lowercase) both database and input permission for comparison.
      if (
        !permissions
          .map((p) => p.trim().toLowerCase())
          .includes(permission.trim().toLowerCase())
      ) {
        // If the required permission is not found, deny access.
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      // Step 5: If the permission exists, continue to the next middleware/route handler.
      next();
    } catch (error) {
      // Catch any unexpected database or server errors.
      console.error("Error in authorisePermission:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default authorisePermission;
