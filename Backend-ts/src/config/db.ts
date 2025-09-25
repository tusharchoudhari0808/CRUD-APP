import { Pool, types } from 'pg';

types.setTypeParser(1082, (val: string) => val);


const userDB = new Pool({
  user: process.env.USER_NAME,
  host: process.env.USER_HOST,
  database: process.env.USER_DATABASE, 
  password: process.env.USER_PASSWORD,
  port: Number(process.env.USER_PORT),
});

//connection..
userDB.connect()
.then(()=>{ console.log("DB is connect seccessfully "); })
.catch((err)=>{ console.log("DB is Faildes",err); });

export default userDB;