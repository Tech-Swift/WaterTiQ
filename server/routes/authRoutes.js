const express = require('express');
const router = express.Router();
const { signupUser, loginUser, getMe } = require('../controllers/authContoller');
const { protect } = require('../middlewares/authMiddleware');

//public routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

//Private
router.get('/me', protect, getMe);

module.exports = router;