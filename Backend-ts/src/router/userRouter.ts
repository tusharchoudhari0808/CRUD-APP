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

// Public Route
router.get("/", paginateUsers);  // anyone can view users (list, pagination, search, sort)

// Protected Routes
router.post("/", verifyToken, validate(userSchema), userCreate);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, validate(userSchema), updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;





















































// import { Router } from "express";
// import {
//   userCreate,
//   getUserById,
//   updateUser,
//   deleteUser,
//   paginateUsers,
// } from "../controllers/userController";
// import { validate } from "../middlewares/validate";
// import { userSchema } from "../validation/userSchema";
// import { verifyToken } from "../middlewares/auth"; 

// const router = Router();

// // CRUD Routes

// // Create user (protected + validated)
// router.post("/", verifyToken, validate(userSchema), userCreate);

// // Pagination, search, sort (protected)
// router.get("/", verifyToken, paginateUsers);

// // Get user by ID (protected)
// router.get("/:id", verifyToken, getUserById);

// // Update user by ID (protected + validated)
// router.put("/:id", verifyToken, validate(userSchema), updateUser);

// // Delete user by ID (protected)
// router.delete("/:id", verifyToken, deleteUser);

// export default router;
