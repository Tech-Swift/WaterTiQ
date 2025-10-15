const express = require('express');
const router = express.Router();
const {   createUser, getAllUsers, getUserById } = require('../controllers/userController');

//routes from controller
router.post('/signup', createUser);
router.get('/login', getAllUsers);
router.get('/profile', getUserById);

module.exports = router;