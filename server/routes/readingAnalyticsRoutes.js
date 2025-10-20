const express = require('express');
const router = express.Router();
const {
  getUnitConsumption,
  getPropertyConsumption,
  getTenantConsumption,
} = require('../controllers/readingAnalyticsController');

// UNIT-level
router.get('/units', getUnitConsumption);

// PROPERTY-level
router.get('/properties', getPropertyConsumption);

// TENANT-level
router.get('/tenants', getTenantConsumption);

module.exports = router;
