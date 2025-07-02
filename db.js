const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectDB;
