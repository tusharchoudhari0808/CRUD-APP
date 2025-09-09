import { Pool } from "pg";
import * as dotenv from "dotenv";


dotenv.config();



const userDB = new Pool({
  user: process.env.USER_NAME,
  host: process.env.USER_HOST,
  database: process.env.USER_DATABASE, 
  password: process.env.USER_PASSWORD,
  port: Number(process.env.USER_PORT),
});


userDB.connect()
.then(()=>{ console.log("DB is connect seccessfully "); })
.catch((err)=>{ console.log("DB is Faildes",err); });

export default userDB;