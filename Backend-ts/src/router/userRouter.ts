// routes/userRoutes.ts
import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import authorisePermission from "../middlewares/authRole";
import { userCreate, getUserById, updateUser, deleteUser, paginateUsers } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validation/userSchema";

const router = Router();

// Any role with get_users permission
router.get("/", verifyToken, authorisePermission("get_users"), paginateUsers);

// Only roles with create_users permission 
router.post("/", verifyToken, authorisePermission("create_users"), validate(userSchema), userCreate);

// Admin and  superAdmin get_users
router.get("/:id", verifyToken, authorisePermission("get_users"), getUserById);

// Admin and  superAdmin  update_users
router.put("/:id", verifyToken, authorisePermission("update_users"), validate(userSchema), updateUser);

// Only superAdmin delete_users
router.delete("/:id", verifyToken, authorisePermission("delete_users"), deleteUser);

export default router;


















// import { Router } from "express";
// import { verifyToken } from "../middlewares/auth";
// import authoriseRole from "../middlewares/authRole";
// import { userCreate, getUserById, updateUser, deleteUser, paginateUsers } from "../controllers/userController";
// import { validate } from "../middlewares/validate";
// import { userSchema } from "../validation/userSchema";

// const router = Router();

// router.get("/", verifyToken, authoriseRole("User", "Admin", "superAdmin"), paginateUsers);
// //  Any logged-in User, Admin, or superAdmin can see paginated users

// router.post("/", verifyToken, authoriseRole("superAdmin"), validate(userSchema), userCreate);
// //  Only superAdmin can create users

// router.get("/:id", verifyToken, authoriseRole("Admin", "superAdmin"), getUserById);
// //  Admin + superAdmin can fetch specific user

// router.put("/:id", verifyToken, authoriseRole("Admin", "superAdmin"), validate(userSchema), updateUser);
// //  Admin + superAdmin can update users

// router.delete("/:id", verifyToken, authoriseRole("superAdmin"), deleteUser);
// //  Only superAdmin can delete users

// export default router;
