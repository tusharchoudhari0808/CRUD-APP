import express, { Application } from "express";
import cors from 'cors'
import router from './router/userRouter'
import adminRouter from './router/adminRouter'


const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users',router);
app.use('/api/admin',adminRouter)



app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
