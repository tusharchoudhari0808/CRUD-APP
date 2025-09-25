// routes/adminRoutes.ts
import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import { AdminLogin } from "../validation/userSchema";
import { verifyToken, AuthRequest } from "../middlewares/auth";

const router = Router();

// Login route (public)
router.post("/login", validate(AdminLogin), loginAdmin);

// Verify route (protected, checks cookie)
router.get("/verify", verifyToken, (req: AuthRequest, res) => {
  const admin = req.user; // decoded JWT payload from cookie
  res.json({ admin });
});

// Logout route (clears token cookie)
router.post("/logout", logoutAdmin);

export default router;
