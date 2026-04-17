require("dotenv").config();
const adminRoutes = require("./routes/adminRoutes");
const express = require("express");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
const bedRoutes = require("./routes/bedRoutes");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max requests
  message: "Too many requests, try again later"
});

app.use(limiter);

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/beds", bedRoutes);
app.use(helmet());
app.use(cookieParser());

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