const express = require('express');
const router = express.Router();
const {
  autoGenerateReadings,
  manualReading,
  getAllReadings,
} = require('../controllers/readingController');

// Auto-generate all readings (sensor simulation)
router.post('/auto', autoGenerateReadings);

// Manual input (for testing)
router.post('/manual', manualReading);

// Get all readings
router.get('/', getAllReadings);

module.exports = router;
