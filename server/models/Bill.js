const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },

    readingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reading',
      required: true,
    },

    billingPeriodStart: {
      type: Date,
      required: true,
    },

    billingPeriodEnd: {
      type: Date,
      required: true,
    },

    previousReading: {
      type: Number,
      required: true,
    },

    currentReading: {
      type: Number,
      required: true,
    },

    consumption: {
      type: Number,
      required: true,
      default: 0,
    },

    ratePerUnit: {
      type: Number,
      required: true,
      default: 1, // default price per m³
    },

    amountDue: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ['unpaid', 'paid', 'pending'],
      default: 'unpaid',
    },

    issuedDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
);

//Middleware: auto-calculate consumption and amountDue before saving
billSchema.pre('save', async function (next) {
  try {
    this.consumption = this.currentReading - this.previousReading;
    this.amountDue = this.consumption * this.ratePerUnit;
    next();
  } catch (err) {
    next(err);
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = { Bill }
