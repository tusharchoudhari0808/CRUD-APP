import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();



const userDB = new Pool({
  user: process.env.user_Name,
  host: process.env.user_Host,
  database: process.env.user_Detabase, 
  password: process.env.user_Password,
  port: Number(process.env.user_Port),
});


userDB.connect().then(()=>{
    console.log("DB is connect seccessfully ");
}).catch((err)=>{
    console.log("DB is Faildes",err);
});

export default userDB;