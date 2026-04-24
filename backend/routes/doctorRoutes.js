const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, department, roomNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const doctor = new Doctor({
    name,
    email,
    password: hashedPassword,
    department,
    roomNumber
  });

  await doctor.save();

  res.json({ message: "Doctor registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });

  if (!doctor) {
    return res.status(400).json({ message: "Doctor not found" });
  }

  const isMatch = await bcrypt.compare(password, doctor.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json({
    message: "Login successful",
    doctorId: doctor._id,
    name: doctor.name,
    roomNumber: doctor.roomNumber
  });
});

module.exports = router;