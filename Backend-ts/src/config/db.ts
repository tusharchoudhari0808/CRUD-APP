import { Pool, types } from 'pg';

//  Override default PostgreSQL parser for DATE type (OID = 1082)
// By default, pg converts DATE into JS Date objects, which may cause timezone shifts.
// Here we parse it as a plain string instead to avoid unwanted conversions.
types.setTypeParser(1082, (val: string) => val);

//  Create a new PostgreSQL connection pool using environment variables
const userDB = new Pool({
  user: process.env.USER_NAME,       // PostgreSQL username
  host: process.env.USER_HOST,       // Database host (e.g., localhost or server IP)
  database: process.env.USER_DATABASE, // Name of the database
  password: process.env.USER_PASSWORD, // Database user password
  port: Number(process.env.USER_PORT), // Port number (default for PostgreSQL: 5432)
});

//  Test connection immediately after creating the pool
userDB.connect()
  .then(() => { 
    console.log(" DB is connected successfully"); 
  })
  .catch((err) => { 
    console.error(" DB connection failed", err); 
  });

//  Export the pool instance so it can be used in other files
export default userDB;
