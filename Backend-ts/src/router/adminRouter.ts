import { Router } from "express";
import { loginAdmin } from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import {AdminLogin} from "../validation/userSchema";


const router = Router();

//router.post("/signup", validate(adminSchema),  signUpAdmin);
router.post("/login", validate(AdminLogin),loginAdmin);

export default router;