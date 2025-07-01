const mongoose = require("mongoose");

const RiderProfileSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  address: String,
  state: String,
  district: String,
  zipcode: String,
  regNum: String,
  brand: String,
  model: String,
  year: String,
  rcImg: String,
  insurance: String,
});

module.exports = mongoose.model("RiderProfile", RiderProfileSchema);
