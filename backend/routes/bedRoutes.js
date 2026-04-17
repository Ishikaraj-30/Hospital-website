const express = require("express");
const router = express.Router();
const Bed = require("../models/Bed");

// Get all beds
router.get("/", async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available beds by ward
router.get("/available/:wardType", async (req, res) => {
  try {
    const beds = await Bed.find({
      wardType: req.params.wardType,
      isOccupied: false
    });

    res.json(beds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;