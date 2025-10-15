const mongoose = require('mongoose');
const Property = require('./Property'); 

const unitSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true, 
    },

    unitNumber: {
      type: String,
      required: true,
      trim: true, 
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

//Middleware: after saving a unit, automatically push its _id to the property
unitSchema.post('save', async function(doc, next) {
  try {
    await Property.findByIdAndUpdate(doc.propertyId, {
      $addToSet: { units: doc._id }, // prevents duplicates
    });
    next();
  } catch (err) {
    next(err);
  }
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = { Unit }
