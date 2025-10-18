const { Unit } = require('../models/Unit');
const { Property } = require('../models/Property');
const { User } = require('../models/User');

// ------------------- CREATE UNIT -------------------
const createUnit = async (req, res) => {
  try {
    const { unitNumber, propertyId, tenantId, meterId, status } = req.body;

    console.log('📥 Incoming request body:', req.body);

    // Check required fields
    if (!unitNumber || !propertyId) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'unitNumber and propertyId are required' });
    }

    // Confirm property exists
    const property = await Property.findById(propertyId);
    console.log('🏠 Found property:', property);

    if (!property) {
      console.log('❌ Property not found for ID:', propertyId);
      return res.status(404).json({ message: 'Property not found' });
    }

    // Optional: validate tenant
    if (tenantId) {
      const tenant = await User.findById(tenantId);
      console.log('👤 Tenant found:', tenant);
      if (!tenant || tenant.role !== 'tenant') {
        console.log('❌ Invalid tenant role');
        return res.status(400).json({ message: 'Invalid tenant or role not tenant' });
      }
    }

    // Create new unit
    const newUnit = await Unit.create({
      unitNumber: unitNumber, // using `name` field in schema, mapping from `unitNumber`
      propertyId,
      tenantId: tenantId || null,
      meterId: meterId || null,
      status: status || 'vacant',
    });

    console.log('✅ New unit created:', newUnit);

    // Add this unit to property’s unit list
    property.units.push(newUnit._id);
    console.log('📦 Property units before save:', property.units);

    await property.save();

    console.log('💾 Property after saving:', property);

    res.status(201).json({
      message: 'Unit created successfully and linked to property',
      unit: newUnit,
    });
  } catch (error) {
    console.error('🔥 Error creating unit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- GET ALL UNITS -------------------
const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find()
      .populate('propertyId', 'unitNumber location')
      .populate('tenantId', 'unitNumber email')
      .populate('meterId');

    res.status(200).json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- GET UNIT BY ID -------------------
const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('propertyId')
      .populate('tenantId')
      .populate('meterId');

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.status(200).json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- UPDATE UNIT -------------------
const updateUnit = async (req, res) => {
  try {
    const { tenantId, status } = req.body;

    // Optional: validate tenant if being assigned
    if (tenantId) {
      const tenant = await User.findById(tenantId);
      if (!tenant || tenant.role !== 'tenant') {
        return res.status(400).json({ message: 'Invalid tenant or role not tenant' });
      }
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.status(200).json({ message: 'Unit updated successfully', updatedUnit });
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- DELETE UNIT -------------------
const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    // Remove the unit
    await Unit.findByIdAndDelete(unit._id);

    // Also remove the unit reference from the property
    await Property.findByIdAndUpdate(unit.propertyId, {
      $pull: { units: unit._id },
    });

    res.status(200).json({ message: 'Unit deleted and removed from property' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
