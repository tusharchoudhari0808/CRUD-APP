const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers.js");
const userSchema = require("../middilwere/validation.js");

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

// RESTful routes
router.get("/All", UserController.getAllUsers);          // GET /users
router.get("/:id", UserController.getUserById);       // GET /users/:id
router.post("/create", validate(userSchema), UserController.createUser); // POST /users
router.put("/update/:id", validate(userSchema), UserController.updateUser); // PUT /users/:id
router.delete("/delete/:id", UserController.deleteUser);     // DELETE /users/:id

// Pagination endpoint 
router.get("/page/list", UserController.paginateUsers);

module.exports = router;
