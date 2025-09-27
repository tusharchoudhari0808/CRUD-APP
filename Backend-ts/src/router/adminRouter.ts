import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import { AdminLogin } from "../validation/userSchema";
import { verifyToken } from "../middlewares/auth";
import { AuthRequest } from "../Types/types";
import Roles from "../utils/role.json";

const router = Router();

// Login route 
router.post("/login", validate(AdminLogin), loginAdmin);


// verify route
router.get("/verify", verifyToken, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const roleConfig = Roles.roles.find((r) => r.name === req.user?.role);

  res.json({
    success: true,
    admin: req.user,
    permissions: roleConfig?.permissions || [],
    message: `Welcome ${req.user.role}`,
  });
});


  

// Logout route (clears token cookie)
router.post("/logout", logoutAdmin);

export default router;
