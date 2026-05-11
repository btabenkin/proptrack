const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Public
const getTenants = asyncHandler(async (req, res) => {
  const tenants = await Tenant.find().populate('propertyId');
  res.status(200).json(tenants);
});

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Public
const getTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id).populate('propertyId');
  
  if (!tenant) {
    res.status(404);
    throw new Error('Tenant not found');
  }
  
  res.status(200).json(tenant);
});

// @desc    Create tenant
// @route   POST /api/tenants
// @access  Public
const createTenant = asyncHandler(async (req, res) => {
  const { propertyId, firstName, lastName, email, phone, leaseStart, leaseEnd, monthlyRent } = req.body;
  
  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(400);
    throw new Error('Property not found');
  }
  
  if (!firstName || !lastName || !email || !phone || !leaseStart || !leaseEnd || !monthlyRent) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  
  const tenant = await Tenant.create({
    propertyId,
    firstName,
    lastName,
    email,
    phone,
    leaseStart,
    leaseEnd,
    monthlyRent
  });
  
  res.status(201).json(tenant);
});

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Public
const updateTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  
  if (!tenant) {
    res.status(404);
    throw new Error('Tenant not found');
  }
  
  const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(updatedTenant);
});

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Public
const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  
  if (!tenant) {
    res.status(404);
    throw new Error('Tenant not found');
  }
  
  await tenant.deleteOne();
  
  res.status(200).json({ message: 'Tenant removed' });
});

module.exports = {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant
};