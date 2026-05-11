const mongoose = require('mongoose');

const rentPaymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Please add a tenant ID']
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Please add a property ID']
  },
  amount: {
    type: Number,
    required: [true, 'Please add payment amount']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Please add payment date']
  },
  period: {
    type: String,
    required: [true, 'Please add payment period']
  },
  status: {
    type: String,
    enum: ['paid', 'late', 'partial'],
    default: 'paid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'bank transfer', 'credit card', 'other'],
    default: 'bank transfer'
  },
  notes: {
    type: String
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

module.exports = mongoose.model('RentPayment', rentPaymentSchema);