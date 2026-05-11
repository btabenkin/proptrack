const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find();
  res.status(200).json(properties);
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  res.status(200).json(property);
});

// @desc    Create property
// @route   POST /api/properties
// @access  Public
const createProperty = asyncHandler(async (req, res) => {
  const { address, city, state, zip, bedrooms, bathrooms, squareFeet, purchasePrice } = req.body;
  
  if (!address || !city || !state || !zip || !bedrooms || !bathrooms || !squareFeet || !purchasePrice) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  
  const property = await Property.create({
    address,
    city,
    state,
    zip,
    bedrooms,
    bathrooms,
    squareFeet,
    purchasePrice
  });
  
  res.status(201).json(property);
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Public
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(updatedProperty);
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Public
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  
  await property.deleteOne();
  
  res.status(200).json({ message: 'Property removed' });
});

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
};