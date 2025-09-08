import { Request, Response } from "express";
import userDB from "../config/db";
import { success, error } from "../utils/response";

// Create New User
export const userCreate = async (req: Request, res: Response): Promise<void> => {
  const { first_name, last_name, dob, mobile_number, address } = req.body;

  try {
    const result = await userDB.query(
      `INSERT INTO users (first_name, last_name, dob, mobile_number, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, dob, mobile_number, address]
    );

    success(res, result.rows[0], "User created successfully", 201);
  } catch (err) {
    console.error("Error creating user:", err);
    error(res, "Failed to create user", 500, err instanceof Error ? err.message : err);
  }
};

// Get all Users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await userDB.query(
      `SELECT user_id, first_name, last_name, dob, mobile_number, address 
       FROM users 
       ORDER BY user_id ASC`
    );

    success(res, result.rows, "Users fetched successfully", 200);
  } catch (err) {
    console.error("Error fetching users:", err);
    error(res, "Failed to fetch users", 500, err instanceof Error ? err.message : err);
  }
};

// Get User by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await userDB.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      error(res, "User not found", 404);
      return;
    }

    success(res, result.rows[0], "User fetched successfully", 200);
  } catch (err) {
    console.error("Error fetching user:", err);
    error(res, "Failed to fetch user", 500, err instanceof Error ? err.message : err);
  }
};

// Update User
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { first_name, last_name, dob, mobile_number, address } = req.body;

  try {
    const result = await userDB.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, dob = $3, mobile_number = $4, address = $5
       WHERE user_id = $6 RETURNING *`,
      [first_name, last_name, dob, mobile_number, address, id]
    );

    if (result.rows.length === 0) {
      error(res, "User not found", 404);
      return;
    }

    success(res, result.rows[0], "User updated successfully", 200);
  } catch (err) {
    console.error("Error updating user:", err);
    error(res, "Failed to update user", 500, err instanceof Error ? err.message : err);
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await userDB.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      error(res, "User not found", 404);
      return;
    }

    success(res, result.rows[0], "User deleted successfully", 200);
  } catch (err) {
    console.error("Error deleting user:", err);
    error(res, "Failed to delete user", 500, err instanceof Error ? err.message : err);
  }
};

// Pagination + Search + Sort
export const paginateUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const first_name = (req.query.first_name as string) || null;
  const sortKey = (req.query.sortKey as string) || "user_id";
  const order = (req.query.order as string) || "ASC";

  const validSort = ["first_name", "dob", "user_id"];
  const sortColumn = validSort.includes(sortKey) ? sortKey : "user_id";
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  try {
    const result = await userDB.query(
      `
      SELECT * FROM users
      WHERE ($1::text IS NULL OR first_name ILIKE $1)
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $2 OFFSET $3
      `,
      [first_name ? `%${first_name}%` : null, limit, skip]
    );

    const countRes = await userDB.query(
      `SELECT COUNT(*) FROM users WHERE ($1::text IS NULL OR first_name ILIKE $1)`,
      [first_name ? `%${first_name}%` : null]
    );

    const total = parseInt(countRes.rows[0].count, 10);

    success(
      res,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: result.rows,
      },
      "Users fetched successfully",
      200
    );
  } catch (err) {
    console.error("Error fetching paginated users:", err);
    error(res, "Failed to fetch users", 500, err instanceof Error ? err.message : err);
  }
};