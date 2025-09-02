const DB = require('../config/db.js');
const response = require('../utils/response.js');

//  Create User
exports.createUser = async (req, res) => {
  const { First_Name, Last_Name, DOB, Mobile_Number, Address } = req.body;

  try {
    const checkMobile = await DB.query(
      "SELECT * FROM users WHERE Mobile_Number = $1",
      [Mobile_Number]
    );

    if (checkMobile.rows.length > 0) {
      return response.error(res, "Mobile number already exists", 400);
    }

    const result = await DB.query(
      `INSERT INTO users (First_Name, Last_Name, DOB, Mobile_Number, Address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [First_Name, Last_Name, DOB, Mobile_Number, Address]
    );

    return response.success(res, result.rows[0], "User created successfully", 201);

  } catch (error) {
    console.error("Error creating user:", error);
    return response.error(res, "Failed to create user");
  }
};

//  Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await DB.query("SELECT * FROM users ORDER BY user_id ASC");
    return response.success(res, result.rows, "Users fetched successfully");
  } catch (error) {
    console.error("Error fetching users:", error);
    return response.error(res, "Failed to fetch users");
  }
};

//  Get User by ID with edite
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await DB.query("SELECT * FROM users WHERE user_id = $1", [id]);

    if (result.rows.length === 0) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, result.rows[0], "User fetched successfully");

  } catch (error) {
    console.error("Error fetching user:", error);
    return response.error(res, "Failed to fetch user");
  }
};

//  Update User

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { First_Name, Last_Name, DOB, Mobile_Number, Address } = req.body;

  try {
    const result = await DB.query(
      `UPDATE users 
       SET First_Name = $1, Last_Name = $2, DOB = $3, Mobile_Number = $4, Address = $5
       WHERE user_id = $6 RETURNING *`,
      [First_Name, Last_Name, DOB, Mobile_Number, Address, id]
    );

    if (result.rows.length === 0) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, result.rows[0], "User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return response.error(res, "Failed to update user");
  }
};


//  Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await DB.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return response.error(res, "User not found", 404);
    }

    return response.success(res, result.rows[0], "User deleted successfully");

  } catch (error) {
    console.error("Error deleting user:", error);
    return response.error(res, "Failed to delete user");
  }
};

//  Paginate + Search + Sort Users
exports.paginateUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { first_name, sortKey, order } = req.query;

  const validSort = ['first_name', 'dob', 'user_id'];
  const sortColumn = validSort.includes(sortKey) ? sortKey : 'user_id';
  const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    const result = await DB.query(
      `
      SELECT * FROM users
      WHERE ($1::text IS NULL OR first_name ILIKE $1)
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $2 OFFSET $3
      `,
      [first_name ? `%${first_name}%` : null, limit, skip]
    );

    const countRes = await DB.query(
      `SELECT COUNT(*) FROM users WHERE ($1::text IS NULL OR first_name ILIKE $1)`,
      [first_name ? `%${first_name}%` : null]
    );

    const total = parseInt(countRes.rows[0].count);

    return response.success(res, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    }, "Users fetched successfully");

  } catch (error) {
    console.error("Error fetching paginated users:", error);
    return response.error(res, "Failed to fetch users");
  }
};
