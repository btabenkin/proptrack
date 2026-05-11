const Expense = require('../models/Expense');
const Property = require('../models/Property');
const asyncHandler = require('express-async-handler');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().populate('propertyId');
  res.status(200).json(expenses);
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id).populate('propertyId');
  
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  
  res.status(200).json(expense);
});

// @desc    Create expense
// @route   POST /api/expenses
// @access  Public
const createExpense = asyncHandler(async (req, res) => {
  const { propertyId, category, amount, date, description, vendor, receipt } = req.body;
  
  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(400);
    throw new Error('Property not found');
  }
  
  if (!category || !amount || !date || !description) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  
  const expense = await Expense.create({
    propertyId,
    category,
    amount,
    date,
    description,
    vendor: vendor || '',
    receipt: receipt || ''
  });
  
  res.status(201).json(expense);
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  
  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json(updatedExpense);
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  
  await expense.deleteOne();
  
  res.status(200).json({ message: 'Expense removed' });
});

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense
};