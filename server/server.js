const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory Management API Running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));












// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors'); // Import CORS for handling cross-origin requests
// const dotenv = require('dotenv');

// dotenv.config(); // Load environment variables from .env file
// const app = express();
// connectDB(); // Connect to the database

// app.use(express.json()); // Middleware to parse JSON bodies
// app.use(cors()); // Enable CORS for all routes)

// app.get('/', (req, res) => res.send("API is Running"));

// app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes for user login and registration
// app.use('/api/products', require('./routes/productRoutes')); // Product management routes
// app.use('/api/transactions', require('./routes/transactionRoutes')); // Transaction management routes
// app.use('/api/reports', require('./routes/reportRoutes')); // Report generation routes
// app.use("/api/users", require("./routes/userRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
