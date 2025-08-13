const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers.js');

router.post('/create', UserController.createUser);
router.get('/getAll', UserController.getAllUsers);
router.get('/get/:id', UserController.getUserById);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);

module.exports = router;
