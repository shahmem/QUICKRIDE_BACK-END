const mongoose = require('mongoose');

const BookformSchema = new mongoose.Schema({
  pickup: String,
  dropoff: String,
  date: Date,
  time: String,
  fare: String,
  distance: String,
  name: String,
  email: String,
  datetime:Date,
  ready: {
    type: String,
    enum: ['notready', 'ready','isready'],
    default: 'notready',
  },
  payment: {
    type: String,
    enum: ['notpaid', 'paid'],
    default: 'notpaid',
  },
  status: {
    type: String,
    enum: ['pending', 'approved','cancelled','completed'],
    default: 'pending',
  },
  rcpt: String,
});

module.exports = mongoose.model('Bookform', BookformSchema);
