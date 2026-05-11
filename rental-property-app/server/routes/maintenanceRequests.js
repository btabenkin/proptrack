const express = require('express');
const router = express.Router();
const { getMaintenanceRequests, getMaintenanceRequest, createMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } = require('../controllers/maintenanceRequests');

// Maintenance request routes
router.route('/').get(getMaintenanceRequests).post(createMaintenanceRequest);
router.route('/:id').get(getMaintenanceRequest).put(updateMaintenanceRequest).delete(deleteMaintenanceRequest);

module.exports = router;