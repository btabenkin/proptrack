const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: 'rental-property-app/.env' });

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);