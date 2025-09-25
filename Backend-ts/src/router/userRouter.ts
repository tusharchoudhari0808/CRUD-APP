import { Router } from "express";
import {
  userCreate,
  getUserById,
  updateUser,
  deleteUser,
  paginateUsers,
} from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validation/userSchema";
import { verifyToken } from "../middlewares/auth";

const router = Router();

// Protected Routes (all)
router.get("/", verifyToken, paginateUsers);  
router.post("/", verifyToken, validate(userSchema), userCreate);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, validate(userSchema), updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
