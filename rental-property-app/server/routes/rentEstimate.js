const express = require('express');
const router = express.Router({ mergeParams: true });
const { getRentEstimate } = require('../controllers/rentEstimate');

router.get('/', getRentEstimate);

module.exports = router;
