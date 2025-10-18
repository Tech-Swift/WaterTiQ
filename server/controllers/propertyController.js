const { Property } = require('../models/Property');
const { User } = require('../models/User');

// CREATE PROPERTY
const createProperty = async (req, res) => {
  try {
    const { name, location, landlordId, units, status } = req.body;

    // Validation
    if (!name || !location || !landlordId) {
      return res.status(400).json({ message: 'Name, location, and landlordId are required' });
    }

    // Check landlord validity
    const landlord = await User.findById(landlordId);
    if (!landlord) return res.status(404).json({ message: 'Landlord not found' });
    if (landlord.role !== 'landlord' && landlord.role !== 'admin') {
      return res.status(403).json({ message: 'Only users with role landlord or admin can own property' });
    }

    const property = await Property.create({
      name,
      location,
      landlordId,
      units: units || [],
      status: status || 'active',
    });

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('landlordId', 'name email role')
      .populate('units');

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId', 'name email role')
      .populate('units');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const property = await Property.findByIdAndUpdate(id, updates, { new: true });

    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndDelete(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
