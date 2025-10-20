const express = require('express');
const router = express.Router();
const { generatePdfReport, generateExcelReport } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

// Authorized roles only
router.get('/pdf', protect, authorizeRoles('admin', 'landlord'), generatePdfReport);
router.get('/excel', protect, authorizeRoles('admin', 'landlord'), generateExcelReport);

module.exports = router;
