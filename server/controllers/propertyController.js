const { Property } = require('../models/Property');
const { User } = require('../models/User');

// CREATE PROPERTY
const createProperty = async (req, res, next) => {
  try {
    const { name, address, landlordId, units, status } = req.body;

    // Validation
    if (!name || !address || !landlordId) {
      return res.status(400).json({ message: 'Name, address, and landlordId are required' });
    }

    // Check if landlord exists and has role 'landlord'
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(400).json({ message: 'Landlord not found' });
    }
    if (landlord.role !== 'landlord') {
      return res.status(400).json({ message: 'User must have role "landlord" to be linked as landlord' });
    }

    // Create the property
    const property = await Property.create({
      name,
      address,
      landlordId,
      units: units || [],
      status: status || 'active',
    });

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    next(error);
  }
};

// GET ALL PROPERTIES
const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().populate('landlordId').populate('units');
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// GET PROPERTY BY ID
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId')
      .populate('units');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
};
