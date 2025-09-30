import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import authorisePermission from "../middlewares/authRole"; // Middleware for DB-driven role/permission check
import { 
  userCreate, 
  getUserById, 
  updateUser, 
  deleteUser, 
  paginateUsers 
} from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validation/userSchema";

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get paginated list of users
 * @access  Private (requires 'view_users' permission)
 */
router.get("/", verifyToken, authorisePermission("view_users"), paginateUsers);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private (requires 'create_users' permission)
 */
router.post(
  "/", 
  verifyToken, 
  authorisePermission("create_users"), 
  validate(userSchema), 
  userCreate
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user details by ID
 * @access  Private (requires 'edit_users' permission)
 */
router.get("/:id", verifyToken, authorisePermission("edit_users"), getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user details by ID
 * @access  Private (requires 'update_users' permission)
 */
router.put(
  "/:id", 
  verifyToken, 
  authorisePermission("update_users"), 
  validate(userSchema), 
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Private (requires 'delete_users' permission)
 */
router.delete("/:id", verifyToken, authorisePermission("delete_users"), deleteUser);

export default router;
