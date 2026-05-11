const RentPayment = require('../models/RentPayment');
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');

// @desc    Get all rent payments
// @route   GET /api/rent-payments
// @access  Public
const getRentPayments = asyncHandler(async (req, res) => {
  const rentPayments = await RentPayment.find()
    .populate('tenantId')
    .populate('propertyId');
  res.status(200).json(rentPayments);
});

// @desc    Get single rent payment
// @route   GET /api/rent-payments/:id
// @access  Public
const getRentPayment = asyncHandler(async (req, res) => {
  const rentPayment = await RentPayment.findById(req.params.id)
    .populate('tenantId')
    .populate('propertyId');
  
  if (!rentPayment) {
    res.status(404);
    throw new Error('Rent payment not found');
  }
  
  res.status(200).json(rentPayment);
});

// @desc    Create rent payment
// @route   POST /api/rent-payments
// @access  Public
const createRentPayment = asyncHandler(async (req, res) => {
  const { tenantId, propertyId, amount, paymentDate, period, status, paymentMethod, notes } = req.body;
  
  // Check if tenant and property exist
  const tenant = await Tenant.findById(tenantId);
  const property = await Property.findById(propertyId);
  
  if (!tenant || !property) {
    res.status(400);
    throw new Error('Tenant or property not found');
  }
  
  if (!amount || !paymentDate || !period) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  
  const rentPayment = await RentPayment.create({
    tenantId,
    propertyId,
    amount,
    paymentDate,
    period,
    status: status || 'paid',
    paymentMethod: paymentMethod || 'bank transfer',
    notes: notes || ''
  });
  
  res.status(201).json(rentPayment);
});

// @desc    Update rent payment
// @route   PUT /api/rent-payments/:id
// @access  Public
const updateRentPayment = asyncHandler(async (req, res) => {
  const rentPayment = await RentPayment.findById(req.params.id);
  
  if (!rentPayment) {
    res.status(404);
    throw new Error('Rent payment not found');
  }
  
  const updatedRentPayment = await RentPayment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(updatedRentPayment);
});

// @desc    Delete rent payment
// @route   DELETE /api/rent-payments/:id
// @access  Public
const deleteRentPayment = asyncHandler(async (req, res) => {
  const rentPayment = await RentPayment.findById(req.params.id);
  
  if (!rentPayment) {
    res.status(404);
    throw new Error('Rent payment not found');
  }
  
  await rentPayment.deleteOne();
  
  res.status(200).json({ message: 'Rent payment removed' });
});

module.exports = {
  getRentPayments,
  getRentPayment,
  createRentPayment,
  updateRentPayment,
  deleteRentPayment
};