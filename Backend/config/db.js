const { Pool, types } = require("pg"); 
require('dotenv').config();


types.setTypeParser(1082, (val) => val);

 // Connect to PostgreSQL database
const userDB = new  Pool({
 user: process.env.user_Name,
  host: process.env.DB_HOST,
  database: process.env.database_Name,
  password: process.env.password_Name,
  port: Number(process.env.port_Name)
});

//ceate users table 
userDB.query(`
  CREATE TABLE IF NOT EXISTS users (
  USER_ID SERIAL PRIMARY KEY,
  FIrst_Name VARCHAR(50) NOT NULL,
  Last_Name VARCHAR(50) NOT NULL,
  DOB DATE NOT NULL,
  Mobile_Number VARCHAR(10) NOT NULL,
  Address VARCHAR(255) NOT NULL
  )`, (err) =>{
    if(err){
      console.error('Error creating table', err);
    }
    else{
      console.log('Table created successfully');
    }
  });




module.exports = userDB