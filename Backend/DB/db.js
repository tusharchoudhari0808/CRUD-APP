const {Pool} = require('pg');

const userDB = new  Pool({
 user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'Tushar@08',
  port: 5432, 
});

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