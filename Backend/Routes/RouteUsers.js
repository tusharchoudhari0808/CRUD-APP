const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers.js');
require('dotenv').config();

router.post('/create', UserController.createUser);
router.get('/getAll', UserController.getAllUsers);
router.get('/get/:id', UserController.getUserById);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);

module.exports = router;
