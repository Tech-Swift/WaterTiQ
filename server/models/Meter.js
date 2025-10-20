const mongoose = require('mongoose');
const Unit = require('./Unit');

const meterSchema = new mongoose.Schema(
  {
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit', // links the meter to a specific unit
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Property',
      required: true
    },
    meterNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
    },

    type: {
      type: String,
      enum: ['smart', 'manual'],
      default: 'smart',
    },

    lastReading: {
      type: Number,
      default: 0,
    },

    installDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ['active', 'maintenance', 'faulty'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Meter = mongoose.model('Meter', meterSchema);

module.exports = { Meter }
