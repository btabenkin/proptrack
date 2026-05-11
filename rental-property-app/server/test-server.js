const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let properties = [
  {
    id: '1',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    purchasePrice: 250000,
    status: 'available'
  }
];

// Basic route
app.get('/', (req, res) => {
  res.send('Rental Property API is running');
});

// Get all properties
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

// Get single property
app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === req.params.id);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ message: 'Property not found' });
  }
});

// Create property
app.post('/api/properties', (req, res) => {
  const newProperty = {
    id: (properties.length + 1).toString(),
    ...req.body
  };
  properties.push(newProperty);
  res.status(201).json(newProperty);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API endpoints:');
  console.log(`- GET /api/properties`);
  console.log(`- GET /api/properties/:id`);
  console.log(`- POST /api/properties`);
});