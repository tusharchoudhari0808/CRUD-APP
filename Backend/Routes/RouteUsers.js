const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers.js');
const userSchema = require('../middlewere/validation.js');



// Middleware for validating user input
const validateUser = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next(); // Continue to the main route handler
  };
};
router.get('/search', UserController.searchUsers);
router.post('/create', validateUser(userSchema), UserController.createUser);
router.get('/getAll', UserController.getAllUsers);
router.get('/get/:id', UserController.getUserById);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);

module.exports = router;
