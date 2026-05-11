const express = require('express');
const router = express.Router();
const { getProperties, getProperty, createProperty, updateProperty, deleteProperty } = require('../controllers/properties');

// Property routes
router.route('/').get(getProperties).post(createProperty);
router.route('/:id').get(getProperty).put(updateProperty).delete(deleteProperty);

module.exports = router;