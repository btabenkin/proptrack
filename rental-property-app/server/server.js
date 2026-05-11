const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config({ path: require('path').join(__dirname, '../.env') });

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route files
const properties = require('./routes/properties');
const tenants = require('./routes/tenants');
const rentPayments = require('./routes/rentPayments');
const expenses = require('./routes/expenses');
const maintenanceRequests = require('./routes/maintenanceRequests');
const rentEstimate = require('./routes/rentEstimate');

// Mount routers
app.use('/api/properties', properties);
app.use('/api/properties/:id/rent-estimate', rentEstimate);
app.use('/api/tenants', tenants);
app.use('/api/rent-payments', rentPayments);
app.use('/api/expenses', expenses);
app.use('/api/maintenance', maintenanceRequests);

// Basic route
app.get('/', (req, res) => {
  res.send('Rental Property API is running');
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;