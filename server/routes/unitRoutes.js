const express = require('express');
const router = express.Router();
const {
    createUnit,
    getAllUnits,
    getUnitById,
    updateUnit,
    deleteUnit
} = require('../controllers/unitContoller');

const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

// ------------------ ROUTES ------------------

// CREATE UNIT (Only landlord or admin)
router.post('/', protect, authorizeRoles('admin', 'landlord'), createUnit);

// GET ALL UNITS (admin or landlord)
router.get('/', protect, authorizeRoles('admin', 'landlord'), getAllUnits);

// GET SINGLE UNIT (any authenticated user — admin, landlord, tenant)
router.get('/:id', protect, getUnitById);

// UPDATE UNIT (only landlord or admin)
router.put('/:id', protect, authorizeRoles('admin', 'landlord'), updateUnit);

// DELETE UNIT (only landlord or admin)
router.delete('/:id', protect, authorizeRoles('admin', 'landlord'), deleteUnit);

module.exports = router;
