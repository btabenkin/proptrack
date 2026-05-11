const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Please add a property ID']
  },
  category: {
    type: String,
    enum: ['maintenance', 'taxes', 'insurance', 'utilities', 'other'],
    required: [true, 'Please add expense category']
  },
  amount: {
    type: Number,
    required: [true, 'Please add expense amount']
  },
  date: {
    type: Date,
    required: [true, 'Please add expense date']
  },
  description: {
    type: String,
    required: [true, 'Please add expense description']
  },
  vendor: {
    type: String
  },
  receipt: {
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

module.exports = mongoose.model('Expense', expenseSchema);