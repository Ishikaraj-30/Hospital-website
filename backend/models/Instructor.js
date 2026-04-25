const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  department: String
});

module.exports = mongoose.model("Instructor", instructorSchema);