const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  wardType: String,
  roomNumber: String,
  bedNumber: String,
  isOccupied: {
    type: Boolean,
    default: false
  },
  patientId: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Bed", bedSchema);