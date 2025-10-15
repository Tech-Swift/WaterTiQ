const mongoose = require('mongoose');

const monthlyConsumptionSchema = new mongoose.Schema(
  {
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },
    month: {
      type: String, 
      required: true,
    },
    totalConsumption: {
      type: Number, 
      required: true,
      default: 0,
    },
    averageDailyUsage: {
      type: Number, 
      default: 0,
    },
    highestUsageDay: {
      date: Date, 
      consumption: Number, 
    },
    alert: {
      type: Boolean,
      default: false,
    },
    alertType: {
      type: String, 
    },
    alertMessage: {
      type: String, 
    },
  },
  { timestamps: true }
);

// Index for fast querying by unit and month
monthlyConsumptionSchema.index({ unitId: 1, month: 1 }, { unique: true });

// Pre-save hook to calculate averageDailyUsage if totalConsumption is provided
monthlyConsumptionSchema.pre('save', function (next) {
  if (this.totalConsumption && this.month) {
    const [year, month] = this.month.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    this.averageDailyUsage = parseFloat(
      (this.totalConsumption / daysInMonth).toFixed(2)
    );
  }
  next();
});

const MonthlyConsumption = mongoose.model('MonthlyConsumption', monthlyConsumptionSchema);

module.exports = { MonthlyConsumption }
