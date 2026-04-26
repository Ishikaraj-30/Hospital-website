const express = require("express");
const router = express.Router();
const Surgeon = require("../models/Surgeon");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const existing = await Surgeon.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Surgeon already exists" });
    }

    const surgeon = new Surgeon({ name, email, password, department });
    await surgeon.save();

    res.json({ message: "Surgeon registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const surgeon = await Surgeon.findOne({ email });

    if (!surgeon || surgeon.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ surgeon });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;