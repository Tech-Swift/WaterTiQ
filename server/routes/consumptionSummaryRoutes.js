const express = require('express');
const router = express.Router();
const { generateMonthlySummaries, getSummaries } = require('../controllers/consumptionSummaryController');
const { authorizeRoles } = require('../middlewares/authorizeRoles');
const { protect } = require('../middlewares/authMiddleware');
// Only admins and landlords can trigger monthly summaries
router.post('/generate', protect, authorizeRoles('admin', 'landlord'), generateMonthlySummaries);

// Everyone can view summaries (but we can restrict later)
router.get('/', protect, getSummaries);

module.exports = router;
