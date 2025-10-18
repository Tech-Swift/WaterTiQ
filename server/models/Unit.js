const mongoose = require('mongoose');
const Property = require('./Property'); 

const unitSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: true,
      trim: true, 
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true, 
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    meterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meter',
    },

    status: {
      type: String,
      enum: ['occupied', 'vacant'],
      default: 'vacant',
    },
  },
  { timestamps: true } 
);

const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Unit }
