const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Create/ Register a user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, propertyId, unitId, meterId } = req.body;

    //check for duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User Already exists' });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      propertyId,
      unitId,
      meterId
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await user.find()
    .populate('propertyId', 'name location')
    .populate('unitId', 'unitName')
    .populate('meterId', 'meterNumber');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message});
  }
};

//Get user by Id
const getUserById = async (req, res) =>{
  try {
    const user = await user.findById(req.params.id)
    .populate('propertyId', 'name location')
    .populate('unitId', 'unitName')
    .populate('meterId', 'meterNumber');

    if (!user) return res.status(404).json({ message: 'User not found'});

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ mesage: 'server Error', error: error.message })
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, role, propertyId, unitId, meterId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.role = role || user.role;
    user.propertyId = propertyId || user.propertyId;
    user.unitId = unitId || user.unitId;
    user.meterId = meterId || user.meterId;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
 };