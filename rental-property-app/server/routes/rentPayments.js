const express = require('express');
const router = express.Router();
const { getRentPayments, getRentPayment, createRentPayment, updateRentPayment, deleteRentPayment } = require('../controllers/rentPayments');

// Rent payment routes
router.route('/').get(getRentPayments).post(createRentPayment);
router.route('/:id').get(getRentPayment).put(updateRentPayment).delete(deleteRentPayment);

module.exports = router;