const mongoose = require('mongoose');
const Unit = require('./Unit');

const meterSchema = new mongoose.Schema(
  {
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit', // links the meter to a specific unit
      required: true,
    },

    meterSerial: {
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

//Middleware: After saving a meter, add its _id to the parent Unit
meterSchema.post('save', async function (doc, next) {
  try {
    await Unit.findByIdAndUpdate(doc.unitId, {
      $addToSet: { meterId: doc._id },
    });
    next();
  } catch (err) {
    next(err);
  }
});

const Meter = mongoose.model('Meter', meterSchema);

module.exports = { Meter }
