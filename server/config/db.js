const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);    // Exit process with failure
    }
}

module.exports = connectDB;
// This module exports a function to connect to a MongoDB database using Mongoose.