const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  state: {
    type: String,
    required: [true, 'Please add a state']
  },
  zip: {
    type: String,
    required: [true, 'Please add a zip code']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  squareFeet: {
    type: Number,
    required: [true, 'Please add square footage']
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Please add purchase price']
  },
  currentValue: {
    type: Number
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema);