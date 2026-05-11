const MaintenanceRequest = require('../models/MaintenanceRequest');
const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const asyncHandler = require('express-async-handler');

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Public
const getMaintenanceRequests = asyncHandler(async (req, res) => {
  const maintenanceRequests = await MaintenanceRequest.find()
    .populate('propertyId')
    .populate('tenantId');
  res.status(200).json(maintenanceRequests);
});

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Public
const getMaintenanceRequest = asyncHandler(async (req, res) => {
  const maintenanceRequest = await MaintenanceRequest.findById(req.params.id)
    .populate('propertyId')
    .populate('tenantId');
  
  if (!maintenanceRequest) {
    res.status(404);
    throw new Error('Maintenance request not found');
  }
  
  res.status(200).json(maintenanceRequest);
});

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Public
const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const { propertyId, tenantId, title, description, status, priority } = req.body;
  
  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(400);
    throw new Error('Property not found');
  }
  
  // Check if tenant exists (if provided)
  if (tenantId) {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      res.status(400);
      throw new Error('Tenant not found');
    }
  }
  
  if (!title || !description) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  
  const maintenanceRequest = await MaintenanceRequest.create({
    propertyId,
    tenantId: tenantId || null,
    title,
    description,
    status: status || 'open',
    priority: priority || 'medium'
  });
  
  res.status(201).json(maintenanceRequest);
});

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Public
const updateMaintenanceRequest = asyncHandler(async (req, res) => {
  const maintenanceRequest = await MaintenanceRequest.findById(req.params.id);
  
  if (!maintenanceRequest) {
    res.status(404);
    throw new Error('Maintenance request not found');
  }
  
  const updatedMaintenanceRequest = await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(updatedMaintenanceRequest);
});

// @desc    Delete maintenance request
// @route   DELETE /api/maintenance/:id
// @access  Public
const deleteMaintenanceRequest = asyncHandler(async (req, res) => {
  const maintenanceRequest = await MaintenanceRequest.findById(req.params.id);
  
  if (!maintenanceRequest) {
    res.status(404);
    throw new Error('Maintenance request not found');
  }
  
  await maintenanceRequest.deleteOne();
  
  res.status(200).json({ message: 'Maintenance request removed' });
});

module.exports = {
  getMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest
};