const { Reading } = require('../models/Reading');
const { Meter } = require('../models/Meter');
// const { Unit } = require('../models/Unit');
// const { Property } = require('../models/Property');

// Simulated automatic reading generator
const autoGenerateReadings = async (req, res) => {
  try {
    const meters = await Meter.find().populate('unitId propertyId');

    if (meters.length === 0)
      return res.status(404).json({ message: 'No meters found to read' });

    const readings = [];

    for (const meter of meters) {
      // Get last reading for this meter
      const lastReading = await Reading.findOne({ meterId: meter._id })
        .sort({ createdAt: -1 });

      // Simulate a new sensor reading (random increment)
      const newReadingValue = lastReading
        ? lastReading.readingValue + Math.floor(Math.random() * 5 + 1) // +1 to +5 units
        : Math.floor(Math.random() * 10 + 10); // first-time reading (10–20)

      const consumption = lastReading
        ? newReadingValue - lastReading.readingValue
        : 0;

      const newReading = await Reading.create({
        meterId: meter._id,
        unitId: meter.unitId,
        propertyId: meter.propertyId,
        readingValue: newReadingValue,
        consumption,
        source: 'sensor',
      });

      readings.push(newReading);
    }

    res.status(201).json({
      message: `✅ ${readings.length} automatic readings logged successfully`,
      readings,
    });
  } catch (error) {
    console.error('Error generating readings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Manual reading (for testing)
const manualReading = async (req, res) => {
  try {
    const { meterId, readingValue, recordedBy } = req.body;

    const meter = await Meter.findById(meterId).populate('unitId propertyId');
    if (!meter) return res.status(404).json({ message: 'Meter not found' });

    const lastReading = await Reading.findOne({ meterId }).sort({ createdAt: -1 });

    const consumption = lastReading
      ? readingValue - lastReading.readingValue
      : 0;

    const reading = await Reading.create({
      meterId,
      unitId: meter.unitId,
      propertyId: meter.propertyId,
      readingValue,
      consumption,
      recordedBy,
      source: 'manual',
      readingType: 'adjustment',
    });

    res.status(201).json({ message: 'Manual reading recorded', reading });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Get all readings
const getAllReadings = async (req, res) => {
  try {
    const readings = await Reading.find()
      .populate('meterId', 'meterNumber')
      .populate('unitId', 'unitNumber')
      .populate('propertyId', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  autoGenerateReadings,
  manualReading,
  getAllReadings,
};
