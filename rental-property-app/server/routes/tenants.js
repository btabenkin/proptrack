const express = require('express');
const router = express.Router();
const { getTenants, getTenant, createTenant, updateTenant, deleteTenant } = require('../controllers/tenants');

// Tenant routes
router.route('/').get(getTenants).post(createTenant);
router.route('/:id').get(getTenant).put(updateTenant).delete(deleteTenant);

module.exports = router;