const mongoose = require('mongoose');
require('dotenv').config();
const watchReadings = require('../sockets/watchReadings');

const connectDB = async (io) => {
  try {
    // Connect to MongoDB (no need for deprecated options)
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connected');

    // Start change stream watcher (real-time updates)
    if (io) {
      console.log('👀 Watching Reading collection for changes...');
      watchReadings(io, mongoose);
    } else {
      console.warn('⚠️ io not provided, skipping watcher setup');
    }

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
