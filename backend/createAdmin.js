const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://127.0.0.1:27017/jaydevHospital");

async function createAdmin() {
  await Admin.deleteMany({ username: "admin" }); // 🔥 remove old admin

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new Admin({
    username: "admin",
    password: hashedPassword,
    role: "admin" // 🔥 IMPORTANT
  });

  await admin.save();
  console.log("Admin created with username: admin and password: admin123");
  process.exit();
}

createAdmin();