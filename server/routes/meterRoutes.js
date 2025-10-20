const express = require('express');
const router = express.Router();
const {
  createMeter,
  getAllMeters,
  getMeterById,
  updateMeter,
  deleteMeter,
} = require('../controllers/meterController');

// Routes
router.post('/', createMeter);
router.get('/', getAllMeters);
router.get('/:id', getMeterById);
router.put('/:id', updateMeter);
router.delete('/:id', deleteMeter);

module.exports = router;
