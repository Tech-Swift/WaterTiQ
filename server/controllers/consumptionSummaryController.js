const { Reading } = require('../models/Reading');
const { ConsumptionSummary } = require('../models/ConsumptionSummary');
const mongoose = require('mongoose');

// Utility: format "YYYY-MM"
const getPeriod = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Generate monthly summaries from readings
 */
const generateMonthlySummaries = async (req, res) => {
  try {
    const period = getPeriod(); // current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Aggregate total consumption per unit
    const results = await Reading.aggregate([
      { $match: { readingDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: '$unitId',
          totalConsumption: { $sum: '$consumption' },
          propertyId: { $first: '$propertyId' },
          tenantId: { $first: '$unitId' }, // tenant linked later if needed
        },
      },
    ]);

    const summaries = results.map((r) => ({
      period,
      unitId: r._id,
      propertyId: r.propertyId,
      totalConsumption: r.totalConsumption,
      source: 'auto',
    }));

    // Remove old summaries for this month before saving new ones
    await ConsumptionSummary.deleteMany({ period });

    // Save all summaries
    await ConsumptionSummary.insertMany(summaries);

    res.status(201).json({
      message: `✅ Monthly summaries generated successfully for ${period}`,
      count: summaries.length,
      data: summaries,
    });
  } catch (error) {
    console.error('Error generating monthly summaries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get summaries by property or tenant
 */
const getSummaries = async (req, res) => {
  try {
    const { period, propertyId, tenantId } = req.query;
    const filter = {};

    if (period) filter.period = period;
    if (propertyId) filter.propertyId = new mongoose.Types.ObjectId(propertyId);
    if (tenantId) filter.tenantId = new mongoose.Types.ObjectId(tenantId);

    const summaries = await ConsumptionSummary.find(filter)
      .populate('propertyId', 'name location')
      .populate('unitId', 'unitNumber')
      .populate('tenantId', 'name email');

    res.status(200).json({ count: summaries.length, summaries });
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateMonthlySummaries,
  getSummaries,
};
