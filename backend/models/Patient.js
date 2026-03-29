const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
  },
  name: String,
  phone: String,
  department: String,
  appointments: [
  {
    date: Date,
    time: String,
    doctor: String,
    designation: String,
    result: String,
    status: {
      type: String,
      default: "Scheduled"
    }
  }
]
});

module.exports = mongoose.model("Patient", patientSchema);