const DB = require('../DB/db.js');

// Create User
exports.createUser = async (req, res) => {
  const { First_Name, Last_Name, DOB, Mobile_Number, Address } = req.body;

  try {
    await DB.query(
      `INSERT INTO users (First_Name, Last_Name, DOB, Mobile_Number, Address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [First_Name, Last_Name, DOB, Mobile_Number, Address]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await DB.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await DB.query('SELECT * FROM users ORDER BY user_id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user
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
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await DB.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
