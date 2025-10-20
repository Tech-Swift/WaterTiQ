const { Meter } = require('../models/Meter');
const { Unit } = require('../models/Unit');
const { Property } = require('../models/Property');

// ✅ Create a new meter and link to a unit
const createMeter = async (req, res) => {
  try {
    let { meterNumber, unitId, propertyId, installDate, status } = req.body;

    // Validate required fields
    if (!meterNumber || !unitId) {
      return res.status(400).json({ message: 'meterNumber and unitId are required' });
    }

    // Find unit
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    // If no propertyId is passed, try to fetch it from the unit itself
    if (!propertyId && unit.propertyId) {
      propertyId = unit.propertyId;
    }

    // Double-check that property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found (please link the unit to a property first)' });
    }

    // Ensure unit doesn’t already have a meter
    if (unit.meterId) {
      return res.status(400).json({ message: 'This unit already has a meter linked' });
    }

    // ✅ Create meter with verified propertyId
    const newMeter = await Meter.create({
      meterNumber,
      unitId,
      propertyId,
      installDate: installDate || Date.now(),
      status: status || 'active',
    });

    // Link meter to unit
    unit.meterId = newMeter._id;
    await unit.save();

    res.status(201).json({
      message: '✅ Meter created and linked successfully',
      meter: newMeter,
    });
  } catch (error) {
    console.error('Error creating meter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get all meters
const getAllMeters = async (req, res) => {
  try {
    const meters = await Meter.find()
      .populate('unitId', 'unitNumber status')
      .populate('propertyId', 'name location');

    res.status(200).json(meters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get a single meter by ID
const getMeterById = async (req, res) => {
  try {
    const meter = await Meter.findById(req.params.id)
      .populate('unitId', 'unitNumber status')
      .populate('propertyId', 'name location');

    if (!meter) return res.status(404).json({ message: 'Meter not found' });

    res.status(200).json(meter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update meter details (e.g., status, lastReading)
const updateMeter = async (req, res) => {
  try {
    const updates = req.body;
    const meter = await Meter.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!meter) return res.status(404).json({ message: 'Meter not found' });

    res.status(200).json({ message: 'Meter updated successfully', meter });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Delete a meter (optional cleanup)
const deleteMeter = async (req, res) => {
  try {
    const meter = await Meter.findById(req.params.id);
    if (!meter) return res.status(404).json({ message: 'Meter not found' });

    // Unlink meter from unit before deleting
    await Unit.findByIdAndUpdate(meter.unitId, { $unset: { meterId: '' } });

    await meter.deleteOne();
    res.status(200).json({ message: 'Meter deleted and unlinked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createMeter,
  getAllMeters,
  getMeterById,
  updateMeter,
  deleteMeter,
};
