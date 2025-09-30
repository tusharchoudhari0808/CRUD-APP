import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/userRouter";
import adminRouter from "./router/adminRouter";

const app: Application = express();
const port = process.env.PORT ; // default port if not set

/* ============================================================
   CORS Middleware
   - Allows frontend to make requests with cookies
   - `credentials: true` is required for HttpOnly cookies
============================================================ */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // allow cookies to be sent
  })
);

/* ============================================================
   Built-in Middlewares
   - cookieParser: Parse cookies from request headers
   - express.json: Parse incoming JSON payloads
   - express.urlencoded: Parse URL-encoded payloads
============================================================ */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================================================
   Routes
   - Mount routers for users and admin
============================================================ */
app.use("/api/users", router);       // User CRUD & pagination routes
app.use("/api/admin", adminRouter);  // Admin login, logout, verify

/* ============================================================
   Start Server
============================================================ */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
