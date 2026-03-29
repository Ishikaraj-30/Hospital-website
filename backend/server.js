const adminRoutes = require("./routes/adminRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/jaydevHospital")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is Running");
});
app.get("/test", (req, res) => {
  res.send("Test route works");
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});