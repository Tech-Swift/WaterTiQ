const express = require('express');
const router = express.Router();
const { createProperty, getAllProperties, getPropertyById } = require('../controllers/propertyController');

// Routes
router.post('/', createProperty);      // Create a property
router.get('/', getAllProperties);     // Get all properties
router.get('/:id', getPropertyById);   // Get a single property by ID

module.exports = router;
