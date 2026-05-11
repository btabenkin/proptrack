# Rental Property Tracking App

A MERN stack application for managing rental properties, tenants, payments, expenses, and maintenance requests.

## Features

- Property management
- Tenant tracking
- Rent payment recording
- Expense tracking
- Maintenance request system
- Financial reporting

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Start the development server: `npm run dev`

## Available Scripts

- `npm start`: Start the server
- `npm run server`: Start server with nodemon
- `npm run client`: Start React client
- `npm run dev`: Start both server and client
- `npm run build`: Build React client for production

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

## Project Structure

```
rental-property-app/
├── client/                  # React frontend
├── server/                  # Express backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT
- **Database**: MongoDB Atlas
- **Deployment**: AWS (EC2, S3, CloudFront)

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get single property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Tenants
- `GET /api/tenants` - Get all tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/:id` - Get single tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Rent Payments
- `GET /api/rent-payments` - Get all payments
- `POST /api/rent-payments` - Record payment
- `GET /api/rent-payments/:id` - Get single payment
- `PUT /api/rent-payments/:id` - Update payment
- `DELETE /api/rent-payments/:id` - Delete payment

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Maintenance
- `GET /api/maintenance` - Get all requests
- `POST /api/maintenance` - Create request
- `GET /api/maintenance/:id` - Get single request
- `PUT /api/maintenance/:id` - Update request
- `DELETE /api/maintenance/:id` - Delete request

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

## License

This project is licensed under the MIT License.