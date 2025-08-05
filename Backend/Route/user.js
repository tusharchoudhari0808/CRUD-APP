const express = require('express');
const router = express.Router();
const pool = require('../DB/db.js');



// CREATE user
router.post('/', async (req, res) => {
  const { First_Name, Last_Name, DOB, Mobile_Number, Address } = req.body;
  const result = await pool.query(
    `INSERT INTO users (First_Name, Last_Name, DOB, Mobile_Number, Address)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [First_Name, Last_Name, DOB, Mobile_Number, Address]
  );
  res.json(result.rows[0]);
});

//get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY user_id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { First_Name, Last_Name, DOB, Mobile_Number, Address } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET First_Name = $1, Last_Name = $2, DOB = $3, Mobile_Number = $4, Address = $5
       WHERE user_id = $6 RETURNING *`,
      [First_Name, Last_Name, DOB, Mobile_Number, Address, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// DELETE user

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;