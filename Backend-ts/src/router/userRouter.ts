import { Router } from "express";
import {
//  getUsers,
  userCreate,
  getUserById,
  updateUser,
  deleteUser,
  paginateUsers,
} from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validation/userSchema";

const router = Router();

// GET all users
//router.get("/", getUsers);

// Create user (with Joi validation)
router.post("/", validate(userSchema), userCreate);

// Get user by ID
router.get("/:id", getUserById);

// Update user (with Joi validation)
router.put("/:id", validate(userSchema), updateUser);

// Delete user by ID
router.delete("/:id", deleteUser);

// Pagination, search, sort
router.get("/", paginateUsers);

export default router;
