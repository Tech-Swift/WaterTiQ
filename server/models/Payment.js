const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: true,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card', 'bank', 'cash'],
      required: true,
    },

    transactionCode: {
      type: String,
      required: true,
      trim: true, // e.g., M-Pesa code or card reference
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ['successful', 'failed', 'pending'],
      default: 'pending',
    },

    receiptUrl: {
      type: String,
    },

    gatewayResponse: {
      type: Object, // store API callback info (optional)
    },
  },
  { timestamps: true }
);

//Middleware: optional update bill status after successful payment
paymentSchema.post('save', async function (doc, next) {
  try {
    if (doc.status === 'successful') {
      const Bill = mongoose.model('Bill');
      await Bill.findByIdAndUpdate(doc.billId, { status: 'paid' });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = { Payment }
