const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, roomNumber } = req.body;

    // check if already exists
    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const doctor = new Doctor({
      name,
      email,
      password,
      department,
      roomNumber
    });

    await doctor.save();

    res.json({ message: "Doctor registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor || doctor.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ doctor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;