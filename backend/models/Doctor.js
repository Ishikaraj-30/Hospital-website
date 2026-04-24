const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  department: String,
  roomNumber: String
});

module.exports = mongoose.model("Doctor", doctorSchema);