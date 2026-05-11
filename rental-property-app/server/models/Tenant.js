const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Please add a property ID']
  },
  firstName: {
    type: String,
    required: [true, 'Please add first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name']
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  leaseStart: {
    type: Date,
    required: [true, 'Please add lease start date']
  },
  leaseEnd: {
    type: Date,
    required: [true, 'Please add lease end date']
  },
  monthlyRent: {
    type: Number,
    required: [true, 'Please add monthly rent amount']
  },
  securityDeposit: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'evicted'],
    default: 'active'
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

module.exports = mongoose.model('Tenant', tenantSchema);