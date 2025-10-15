const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema(
  {
    meterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Meter', 
        required: true 
    },
    unitId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Unit', 
        required: true 
    },
    propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property', 
        required: true 
    },
    readingValue: { 
        type: Number, 
        required: true 
    },
    consumption: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    readingDate: { 
        type: Date, 
        default: Date.now 
    },
    readingType: { 
        type: String, 
        enum: ['monthly', 'adjustment', 'correction'], 
        default: 'monthly' 
    },
    recordedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    source: { 
        type: String, 
        enum: ['sensor', 'manual'], 
        default: 'sensor' },
  },
  { timestamps: true }
);

// Auto-calculate consumption before saving
readingSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    if (this.readingType === 'monthly' || this.readingType === 'adjustment') {
      const lastReading = await mongoose.model('Reading')
        .findOne({ meterId: this.meterId, readingType: 'monthly' })
        .sort({ readingDate: -1 });

      this.consumption = lastReading ? this.readingValue - lastReading.readingValue : this.readingValue;
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Reading = mongoose.model('Reading', readingSchema);

module.exports ={ Reading }
