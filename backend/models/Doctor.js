const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  department: String,

  roomNumber: {
    type: String,
    default: "Not Assigned"
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);