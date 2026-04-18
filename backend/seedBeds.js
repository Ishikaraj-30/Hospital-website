require("dotenv").config();
const mongoose = require("mongoose");
const Bed = require("./models/Bed");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const beds = [
  {
    wardType: "ICU",
    roomNumber: "101",
    bedNumber: "B1",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "ICU",
    roomNumber: "101",
    bedNumber: "B2",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "ICU",
    roomNumber: "102",
    bedNumber: "B1",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "General Ward",
    roomNumber: "201",
    bedNumber: "B1",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "General Ward",
    roomNumber: "201",
    bedNumber: "B2",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "General Ward",
    roomNumber: "202",
    bedNumber: "B1",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "Special Ward",
    roomNumber: "301",
    bedNumber: "B1",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "Special Ward",
    roomNumber: "301",
    bedNumber: "B2",
    isOccupied: false,
    patientId: null
  },
  {
    wardType: "Pediatric Ward",
    roomNumber: "401",
    bedNumber: "B1",
    isOccupied: false,
    patientId: null
  }
];

async function seedBeds() {
  try {
    await Bed.deleteMany();
    await Bed.insertMany(beds);

    console.log("Beds seeded successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedBeds();