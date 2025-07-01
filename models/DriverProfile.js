const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  license: String,
  dateIssued: String,
  dateexpire: String,
  regNum: String,
  brand: String,
  model: String,
  year: String,
  photo: String, 
  licenseImg: String,
  rcImg: String,       
  insurance: String
});

module.exports = mongoose.model('Profile', profileSchema);
