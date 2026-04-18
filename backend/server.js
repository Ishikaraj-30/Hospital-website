require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// 🔐 Security packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const app = express();


// ================= 🔐 SECURITY MIDDLEWARE =================

// 🛡️ Secure HTTP headers
app.use(helmet());

// 🚫 Rate limiting (100 requests per 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});
app.use(limiter);
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj) return;

    for (let key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.params);

  next();
});
// 🚫 Prevent HTTP param pollution
app.use(hpp());


// ================= ⚙️ NORMAL MIDDLEWARE =================

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

console.log("MONGO_URI:", process.env.MONGO_URI);
// ================= 📦 ROUTES =================

const adminRoutes = require("./routes/adminRoutes");
const patientRoutes = require("./routes/patientRoutes");
const bedRoutes = require("./routes/bedRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/beds", bedRoutes);


// ================= 🗄️ DATABASE =================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ================= ❌ GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong"
  });
});


// ================= 🚀 SERVER =================

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);