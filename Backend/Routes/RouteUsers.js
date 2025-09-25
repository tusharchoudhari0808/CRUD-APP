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
router.get("/", UserController.paginateUsers);              
router.get("/:id", UserController.getUserById);
router.post("/", validate(userSchema), UserController.createUser);
router.put("/:id", validate(userSchema), UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
