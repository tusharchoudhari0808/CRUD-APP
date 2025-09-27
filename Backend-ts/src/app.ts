import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/userRouter";
import adminRouter from "./router/adminRouter";

const app: Application = express();
const port = process.env.PORT;

//  Allow frontend to send cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", router);
app.use("/api/admin", adminRouter);


app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
