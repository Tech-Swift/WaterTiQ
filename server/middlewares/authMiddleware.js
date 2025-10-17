const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Auth error:', error);
            res.status(401).json({ message: 'Not Authorized, invalid token' });
        }
    }
    
    if(!token) {
        res.status(401).json({ message: 'Not authorized, input token' });
    }
};

module.exports = { protect };