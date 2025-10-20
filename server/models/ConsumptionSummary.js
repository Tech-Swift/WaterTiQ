const mongoose = require('mongoose');

const consumptionSummarySchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true, // e.g. '2025-10'
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalConsumption: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0, // later we’ll link to billing
    },
    source: {
      type: String,
      enum: ['auto', 'manual'],
      default: 'auto',
    },
  },
  { timestamps: true }
);

const ConsumptionSummary = mongoose.model('ConsumptionSummary', consumptionSummarySchema);

module.exports = { ConsumptionSummary };
