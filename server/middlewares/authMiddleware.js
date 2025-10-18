const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("🪪 Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 Decoded payload:", decoded);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not Authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not Authorized, no token' });
  }
};

module.exports = { protect };
