const { User } = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phoneNumber, address, propertyId, meterNumber, billingCycle } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      address,
      propertyId,
      meterNumber,
      billingCycle,
    });

    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ message: 'User created successfully', user: userData });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'server error', error: error.message })
    next(error);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get a user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
};
