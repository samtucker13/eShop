// Author: Sam Tucker
// Purpose: Nodejs server for the website

const express = require('express');
const path = require('path');
const connectDB = require('./backend/db'); // MongoDB connection script

// Importing the routes
const itemRoutes = require('./backend/routes/itemRoutes');
const accountRoutes = require('./backend/routes/accountRoutes');
const cartRoutes = require('./backend/routes/cartRoutes');

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public_html')));

// API routes
app.use('/api/items', itemRoutes); // Item routes
app.use('/api/accounts', accountRoutes); // Account routes
app.use('/api/carts', cartRoutes); // Cart routes

// Define the server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
