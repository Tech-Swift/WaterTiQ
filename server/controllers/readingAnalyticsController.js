const { Reading } = require('../models/Reading');
const { Property } = require('../models/Property');
const { Unit } = require('../models/Unit');
const { User } = require('../models/User');
const mongoose = require('mongoose');

/**
 * Utility — calculate start date from period type
 */
const getStartDate = (period) => {
  const now = new Date();
  if (period === 'weekly') {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return start;
  } else if (period === 'monthly') {
    const start = new Date(now);
    start.setMonth(now.getMonth() - 1);
    return start;
  }
  throw new Error('Invalid period type');
};

/**
 * ✅ 1. UNIT USAGE — total consumption per unit (weekly/monthly)
 */
const getUnitConsumption = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const startDate = getStartDate(period);

    const data = await Reading.aggregate([
      { $match: { readingDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$unitId',
          totalConsumption: { $sum: '$consumption' },
          readings: { $push: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'units',
          localField: '_id',
          foreignField: '_id',
          as: 'unitInfo',
        },
      },
      { $unwind: '$unitInfo' },
      {
        $project: {
          _id: 0,
          unitId: '$unitInfo._id',
          unitNumber: '$unitInfo.unitNumber',
          totalConsumption: 1,
          readings: 1,
        },
      },
    ]);

    res.status(200).json({
      message: `✅ ${period} unit consumption summary`,
      data,
    });
  } catch (error) {
    console.error('Error fetching unit analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * ✅ 2. PROPERTY USAGE — total per property
 */
const getPropertyConsumption = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const startDate = getStartDate(period);

    const data = await Reading.aggregate([
      { $match: { readingDate: { $gte: startDate } } },
      {
        $group: {
          _id: '$propertyId',
          totalConsumption: { $sum: '$consumption' },
        },
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'propertyInfo',
        },
      },
      { $unwind: '$propertyInfo' },
      {
        $project: {
          _id: 0,
          propertyId: '$propertyInfo._id',
          propertyName: '$propertyInfo.name',
          location: '$propertyInfo.location',
          totalConsumption: 1,
        },
      },
    ]);

    res.status(200).json({
      message: `✅ ${period} property consumption summary`,
      data,
    });
  } catch (error) {
    console.error('Error fetching property analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * ✅ 3. TENANT USAGE — total by tenant (linked through unit)
 */
const getTenantConsumption = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const startDate = getStartDate(period);

    const data = await Reading.aggregate([
      { $match: { readingDate: { $gte: startDate } } },
      {
        $lookup: {
          from: 'units',
          localField: 'unitId',
          foreignField: '_id',
          as: 'unitInfo',
        },
      },
      { $unwind: '$unitInfo' },
      {
        $group: {
          _id: '$unitInfo.tenantId',
          totalConsumption: { $sum: '$consumption' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'tenantInfo',
        },
      },
      { $unwind: { path: '$tenantInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          tenantId: '$_id',
          name: '$tenantInfo.name',
          email: '$tenantInfo.email',
          totalConsumption: 1,
        },
      },
    ]);

    res.status(200).json({
      message: `✅ ${period} tenant consumption summary`,
      data,
    });
  } catch (error) {
    console.error('Error fetching tenant analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUnitConsumption,
  getPropertyConsumption,
  getTenantConsumption,
};
