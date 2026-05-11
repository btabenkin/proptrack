const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');

const getRentEstimate = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (!process.env.RENTCAST_API_KEY || process.env.RENTCAST_API_KEY === 'your_rentcast_api_key_here') {
    res.status(503);
    throw new Error('Rentcast API key not configured. Add RENTCAST_API_KEY to your .env file.');
  }

  const address = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;

  const { data } = await axios.get('https://api.rentcast.io/v1/avm/rent/long-term', {
    headers: { 'X-Api-Key': process.env.RENTCAST_API_KEY },
    params: {
      address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFootage: property.squareFeet,
    },
  });

  res.status(200).json({
    address,
    rent: data.rent,
    rentRangeLow: data.rentRangeLow,
    rentRangeHigh: data.rentRangeHigh,
    comparables: (data.listings || []).slice(0, 5).map(l => ({
      address: l.formattedAddress,
      rent: l.price,
      bedrooms: l.bedrooms,
      bathrooms: l.bathrooms,
      squareFootage: l.squareFootage,
      distance: l.distance,
      daysOld: l.daysOld,
    })),
  });
});

module.exports = { getRentEstimate };
