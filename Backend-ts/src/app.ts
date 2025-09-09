import express, { Application } from "express";

import cors from 'cors'

import router from './router/userRouter'

const app: Application = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users',router);



app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
