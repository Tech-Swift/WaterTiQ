const express = require('express');
const router = express.Router();
const {   createUser } = require('../controllers/userController');

//routes from controller
router.post('/', createUser);

module.exports = router;