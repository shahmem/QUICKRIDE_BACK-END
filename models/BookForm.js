const mongoose = require('mongoose');

const BookformSchema = new mongoose.Schema({
  pickup: String,
  dropoff: String,
  date: String,
  time: String,
  fare: String,
  distance: String,
  name: String,
  email: String,
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Bookform', BookformSchema);
