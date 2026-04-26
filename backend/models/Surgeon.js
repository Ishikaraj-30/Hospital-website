const mongoose = require("mongoose");

const surgeonSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  department: String
});

module.exports = mongoose.model("Surgeon", surgeonSchema);