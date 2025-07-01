const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/quickride"; // Change "quickride" to your database name

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
