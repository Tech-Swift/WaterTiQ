const express = require('express');
const router = express.Router();

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

const { protect } = require('../middlewares/authMiddleware');
//authorizeRoles
const { authorizeRoles } = require('../middlewares/authorizeRoles');


// 🏠 PUBLIC ROUTES
router.get('/', getAllProperties); 
router.get('/:id', getPropertyById); 

// PROTECTED ROUTES (for landlords/admins)
router.post('/', protect, authorizeRoles, createProperty);
router.put('/:id', protect, authorizeRoles, updateProperty);
router.delete('/:id', protect, authorizeRoles, deleteProperty);

module.exports = router;

