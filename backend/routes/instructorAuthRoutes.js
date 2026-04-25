const express = require("express");
const router = express.Router();
const Instructor = require("../models/Instructor");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, department } = req.body;

  const existing = await Instructor.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Instructor already exists" });
  }

  const instructor = new Instructor({ name, email, password, department });
  await instructor.save();

  res.json({ message: "Instructor registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const instructor = await Instructor.findOne({ email });

  if (!instructor || instructor.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ instructor });
});

module.exports = router;