const { Pool, types } = require('pg');
require('dotenv').config();

// Prevent PG from converting DATE to JS Date object
types.setTypeParser(1082, (val) => val);

// Create connection pool
const userDB = new Pool({
  user: process.env.user_Name,
  host: process.env.user_Host,
  database: process.env.user_Database,
  password: process.env.user_Password,
  port: Number(process.env.user_Port),
});

// Test DB connection
userDB.connect()
  .then(() => {
    console.log(" Database connected successfully");
  })
  .catch((err) => {
    console.error(" Database connection failed:", err.message);
  });

module.exports = userDB;
