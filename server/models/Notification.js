const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['bill', 'payment', 'system', 'alert', 'reminder', 'adjustment'],
      default: 'system',
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    channels: {
      type: [String],
      enum: ['web', 'email', 'sms', 'push'],
      default: ['web'],
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

//Static helper to mark notifications as read
notificationSchema.statics.markAsRead = async function (userId, notificationId) {
  return this.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

//middleware: could integrate real-time push here
notificationSchema.post('save', async function (doc, next) {
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Notification }
