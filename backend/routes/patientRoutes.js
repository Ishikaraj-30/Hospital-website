console.log("Patient Routes Loaded");
console.log("🔥 THIS IS THE RUNNING PATIENT ROUTES FILE");
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");;
const Bed = require("../models/Bed");
const verifyToken = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
// Generate Unique Patient ID
function generatePatientId() {
  return "JH" + Math.floor(1000 + Math.random() * 9000);
}

function generateToken(department) {
  const prefix = department.slice(0, 3).toUpperCase();
  return prefix + "-" + Math.floor(100 + Math.random() * 900);
}

// ✅ Add New Patient
router.post("/add", async (req, res) => {
    console.log("🔥 /add ROUTE HIT"); 
  try {
    const {
      name,
      phone,
      department,
      appointmentDate,
      doctor,
      time,
      joinWaiting
    } = req.body;
console.log("ADD ROUTE HIT");
    const REGULAR_LIMIT = 2;
    const WAITING_LIMIT = 5;

    const selectedDate = new Date(appointmentDate);

    const patients = await Patient.find({
      "appointments.doctor": doctor,
    });

    let regularCount = 0;
    let waitingCount = 0;

    patients.forEach((p) => {
      p.appointments.forEach((a) => {

        const aDate = new Date(a.date);

        const sameDate =
          aDate.toDateString() === selectedDate.toDateString();

        if (a.doctor === doctor && sameDate) {

          // Count regular for selected time
          if (
            a.status === "Scheduled" &&
            a.time === time
          ) {
            regularCount++;
          }

          // Count waiting
          if (a.status === "Waiting") {
            waitingCount++;
          }
        }
      });
    });

    // ===== WAITING BOOKING =====
    if (joinWaiting) {

      if (waitingCount >= WAITING_LIMIT) {
        return res.status(400).json({
          message: "Waiting list full"
        });
      }

      let patient = await Patient.findOne({ phone });

      if (!patient) {
        patient = new Patient({
          patientId: generatePatientId(),
          name,
          phone,
          department,
          appointments: [],
        });
      }
      
      patient.appointments.push({
        date: appointmentDate,
        time: "17:00",
        doctor,
        tokenNumber: generateToken(department),
        status: "Waiting",
        result: "Not Updated Yet"
      });

      await patient.save();

      const latestAppointment =
  patient.appointments[patient.appointments.length - 1];

      return res.json({
        patientId: patient.patientId,
         tokenNumber: latestAppointment.tokenNumber,
        status: "Waiting"
      });
    }

    // ===== REGULAR BOOKING =====
    if (regularCount >= REGULAR_LIMIT) {
      return res.status(400).json({
        message: "Regular slot full",
        askWaiting: true
      });
    }

    let patient = await Patient.findOne({ phone });

    if (!patient) {
      patient = new Patient({
        patientId: generatePatientId(),
        name,
        phone,
        department,
        appointments: [],
      });
    }
    const doctorRoomMap = {
  "Dr. Rajesh Sharma": "Room 101",
  "Dr. Meera Nair": "Room 102",
  "Dr. Amit Verma": "Room 103"
};   
const cleanDoctor = doctor.replace(".", "").trim();

  patient.appointments.push({
  date: req.body.date || new Date(),
  time: req.body.time || "Not Assigned",
  doctor: req.body.doctor || "Not Assigned",
  roomNumber: doctorRoomMap[cleanDoctor] || "Room 100",   // keep simple for now
  visitCount: 1,
  tokenNumber: generateToken(req.body.department || "General"),
  status: "Scheduled",
  result: "Not Updated Yet"
});

    await patient.save();

    const latestAppointment =
  patient.appointments[patient.appointments.length - 1];

    return res.json({
      patientId: patient.patientId,
      tokenNumber: latestAppointment.tokenNumber,
      doctor: latestAppointment.doctor,
  roomNumber: latestAppointment.roomNumber,
      status: "Scheduled"
    });

  } catch (error) {
console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/doctors/download", async (req, res) => {
  try {
    const PDFDocument = require("pdfkit");
    const path = require("path");
    const fs = require("fs");

    const doctors = require("../data/doctors");

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Hospital_Doctors_Directory.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    /* ================= HEADER ================= */

    const logoPath = path.join(__dirname, "../assets/logo.png");

    // Logo
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 60 });
    }

    // Hospital Name (Clean Multi-line)
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#0A2E5C")
      .text("Sri Jayadeva Institute", 130, 45)
      .text("of Cardiovascular Sciences and Research", 130, 65);

    // Subtitle
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("black")
      .text("Official Doctors Directory", 130, 90);

    // Divider
    doc.moveTo(50, 120).lineTo(550, 120).stroke();

    doc.moveDown(3);

    /* ================= TABLE HEADER ================= */

    const tableTop = doc.y;

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Name", 50, tableTop)
      .text("Department", 170, tableTop)
      .text("Specialization", 280, tableTop)
      .text("Designation", 390, tableTop)
      .text("Experience", 480, tableTop);

    doc.moveDown();

    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();

    /* ================= DOCTORS LIST ================= */

    doc.font("Helvetica").fontSize(10);

    doctors.forEach((doctor) => {
      const y = doc.y + 10;

      doc
        .text(doctor.name, 50, y)
        .text(doctor.department || "-", 170, y)
        .text(doctor.specialization || "-", 280, y)
        .text(doctor.designation || "-", 390, y)
        .text(doctor.experience || "-", 480, y);

      doc.moveDown(1.5);

      // Page break
      if (doc.y > 750) {
        doc.addPage();
      }
    });

    /* ================= FOOTER ================= */

    doc
      .fontSize(8)
      .fillColor("gray")
      .text(
        "This report is generated by Sri Jayadeva Institute ERP System.",
        40,
        800,
        { align: "center" }
      );

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});


const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

router.get("/:id/download", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ERP_Report_${patient.patientId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    const now = new Date();
    const reportId =
      "RPT-" + Math.floor(100000 + Math.random() * 900000);
    const invoiceId =
      "INV-" + Math.floor(100000 + Math.random() * 900000);

    const consultationFee = 500;
    const gst = 0.18;

    const completed = patient.appointments.filter(
      (a) => a.status === "Completed"
    );

    const upcoming = patient.appointments.filter(
      (a) =>
        new Date(a.date) >= now && a.status !== "Cancelled"
    );

    const cancelled = patient.appointments.filter(
      (a) => a.status === "Cancelled"
    );

let totalConsultation = 0;
let totalTestCost = 0;
let totalSurgeryCost = 0;
let totalPharmacyCost = 0;

// Consultation
totalConsultation = completed.length * consultationFee;

// Tests + Surgery
(patient.appointments || []).forEach((appt) => {
  if (appt.tests) {
    (appt.tests || []).forEach((t) => {
      totalTestCost += testCostMap[t.testName] || 0;
    });
  }

  if (appt.surgeryType) {
    totalSurgeryCost += surgeryCostMap[appt.surgeryType] || 0;
  }
});

// Pharmacy
if (patient.pharmacy) {
  (patient.pharmacy || []).forEach((p) => {
    totalPharmacyCost += p.total || 0;
  });
}

    /* ================= WATERMARK ================= */

    doc
      .fontSize(60)
      .fillColor("gray")
      .opacity(0.1)
      .text("SRI JAYADEVA INSTITUTE", 100, 300, {
        angle: 45,
      });
    doc.opacity(1);

    /* ================= HEADER ================= */

    const logoPath = path.join(__dirname, "../assets/logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 60 });
    }

  // LOGO
if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 40, 30, { width: 60 });
}

// TITLE (PROPER SPACING)
doc
  .font("Helvetica-Bold")
  .fontSize(16)
  .fillColor("#0A2E5C")
  .text("Sri Jayadeva Institute", 120, 35)
  .text("of Cardiovascular Sciences and Research", 120, 55);

// CONTACT INFO (MOVE DOWN)
doc
  .font("Helvetica")
  .fontSize(10)
  .fillColor("black")
  .text("123 Health Avenue, Bangalore, India", 120, 80)
  .text("Email: care@jayadeva.com | Phone: +91-9876543210", 120, 95);

// LINE
doc.moveTo(40, 115).lineTo(555, 115).stroke();

doc.moveDown(3);

    doc.moveTo(40, 90).lineTo(555, 90).stroke();

    doc.moveDown(3);

    /* ================= REPORT META ================= */

    doc.font("Helvetica-Bold").fontSize(12);
    doc.text(`Report ID: ${reportId}`);
    doc.text(`Invoice ID: ${invoiceId}`);
    doc.text(`Generated On: ${now.toLocaleString()}`);
    doc.moveDown(1);

    /* ================= PATIENT BOX ================= */

    doc
      .rect(40, doc.y, 515, 80)
      .stroke("#0A2E5C");

    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").text("Patient Information");
    doc.font("Helvetica").fontSize(11);
    doc.text(`Patient ID: ${patient.patientId}`);
    doc.text(`Name: ${patient.name}`);
    doc.text(`Phone: ${patient.phone}`);
    doc.text(`Department: ${patient.department}`);
    doc.moveDown(2);

    /* ================= TABLE FUNCTION ================= */

    function drawTable(title, data, color) {
      doc.font("Helvetica-Bold").fontSize(13).text(title);
      doc.moveDown(0.5);

      if (data.length === 0) {
        doc.font("Helvetica").text("No records available.");
        doc.moveDown(1);
        return;
      }

      data.forEach((appt) => {
        doc
          .rect(40, doc.y, 515, 50)
          .stroke();

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("black")
          .text(
            `Date: ${new Date(appt.date).toDateString()} | Doctor: ${appt.doctor} | Department: ${patient.department}`,
            50,
            doc.y + 5
          );

        doc
          .fillColor(color)
          .text(`Status: ${appt.status}`, 50);

        if (appt.result) {
          doc.fillColor("black").text(`Result: ${appt.result}`);
        }

        doc.moveDown(2);
      });
    }

    /* ================= COMPLETED ================= */

    drawTable("Completed Appointments", completed, "green");

    /* ================= UPCOMING ================= */

    drawTable("Upcoming Appointments", upcoming, "#0A2E5C");

    /* ================= CANCELLED ================= */

    drawTable("Cancelled Appointments", cancelled, "red");
// ================= VISIT-WISE SUMMARY =================

doc.addPage();
doc.fontSize(16).text("Patient Visit Summary", { underline: true });

// ✅ CALCULATE PHARMACY ONCE
if (patient.pharmacy) {
  patient.pharmacy.forEach((p) => {
    totalPharmacyCost += p.total || 0;
  });
}

(patient.appointments || [])
  .filter(
    (appt) =>
      appt.diagnosis ||
      (appt.tests && appt.tests.length > 0) ||
      appt.surgeryType
  )
  .forEach((appt, index) => {

  doc.moveDown();
  doc.fontSize(14).text(`Visit ${index + 1}`, { underline: true });

  // Diagnosis
  if (appt.diagnosis) {
    doc.text(`Diagnosis: ${appt.diagnosis}`);
  }

  // Prescription
  if (appt.prescription) {
    doc.text(`Prescription: ${appt.prescription}`);
  }

  // Consultation
  totalConsultation += consultationFee;

  // TESTS
  if (appt.tests && appt.tests.length > 0) {
    doc.text("Tests:");
    appt.tests.forEach((t) => {
      const cost = testCostMap[t.testName] || 0;
      totalTestCost += cost;

      doc.text(
        `- ${t.testName} | ${t.instructor} | ${t.room} | ₹${cost}`
      );
    });
  }

  // SURGERY
  if (appt.surgeryType) {
    const cost = surgeryCostMap[appt.surgeryType] || 0;
    totalSurgeryCost += cost;

    doc.text("Surgery:");
    doc.text(
      `${appt.surgeryType} | ${appt.surgeonName} | ${appt.otRoom} | ₹${cost}`
    );
  }
  // PHARMACY (linked to visit)
if (patient.pharmacy && patient.pharmacy.length > 0) {
  doc.text("Medicines:");

  patient.pharmacy.forEach((p) => {

    doc.text(
      `- ${p.medicineName} | Qty: ${p.quantity} | ₹${p.total}`
    );
  });
}

});

  // ================= FINAL BILL =================

doc.addPage();
doc.fontSize(18).text("Final Bill Summary", { align: "center" });

const subtotal =
  totalConsultation +
  totalTestCost +
  totalSurgeryCost +
  totalPharmacyCost;

const gstAmount = subtotal * 0.18;
const total = subtotal + gstAmount;

doc.moveDown();
doc.text(`Consultation: ₹${totalConsultation}`);
doc.text(`Tests: ₹${totalTestCost}`);
doc.text(`Surgery: ₹${totalSurgeryCost}`);
doc.text(`Pharmacy: ₹${totalPharmacyCost}`);

doc.moveDown();
doc.text(`Subtotal: ₹${subtotal}`);
doc.text(`GST (18%): ₹${gstAmount}`);
doc.text(`Total Amount: ₹${total}`);
    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
     console.error(error);
res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.get("/:id/receipt", async (req, res) => {
  try {
    const PDFDocument = require("pdfkit");
    const patient = await Patient.findOne({
      patientId: req.params.id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt_${patient.patientId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    const completed = patient.appointments.filter(
      (a) => a.status === "Completed"
    );

   const consultationFee = 500;
const gstRate = 0.18;

let totalConsultation = consultationFee;
let totalTestCost = 0;
let totalSurgeryCost = 0;
let totalPharmacyCost = 0;

// ✅ TRACK UNIQUE VISITS
const visited = new Set();

(patient.appointments || [])
  .filter(
    (appt) =>
      appt.diagnosis ||
      (appt.tests && appt.tests.length > 0) ||
      (appt.surgeryType && appt.surgeryType !== "No")
  )
  .forEach((appt) => {

    // 🚫 SKIP DUPLICATE VISITS
    if (visited.has(appt.visitCount)) return;
    visited.add(appt.visitCount);

    // ✅ TEST COST
    if (appt.tests && appt.tests.length > 0) {
      appt.tests.forEach((t) => {
        totalTestCost += testCostMap[t.testName] || 0;
      });
    }

    // ✅ SURGERY COST
    if (appt.surgeryType && appt.surgeryType !== "No") {
      totalSurgeryCost += surgeryCostMap[appt.surgeryType] || 0;
    }
  });

// ✅ PHARMACY
if (patient.pharmacy) {
  patient.pharmacy.forEach((p) => {
    totalPharmacyCost += p.total || 0;
  });
}

const subtotal =
  totalConsultation +
  totalTestCost +
  totalSurgeryCost +
  totalPharmacyCost;

const gstAmount = subtotal * gstRate;
const totalAmount = subtotal + gstAmount;

    doc
  .fontSize(18)
  .text("Sri Jayadeva Institute", { align: "center" })
  .fontSize(12)
  .text("of Cardiovascular Sciences and Research", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Official Payment Receipt", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Patient ID: ${patient.patientId}`);
    doc.text(`Name: ${patient.name}`);
    doc.text(`Phone: ${patient.phone}`);
    doc.moveDown();

    doc.text(`Completed Appointments: ${completed.length}`);
    doc.text(`Consultation Fee (per visit): ₹${consultationFee}`);
    doc.text(`Subtotal: ₹${subtotal}`);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
    doc.text(`Total Paid: ₹${total.toFixed(2)}`);

    doc.moveDown(3);
    doc.text("Authorized Signature");
    doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();

    doc.end();

  } catch (error) {
   console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Get Patient By ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Searching for:", req.params.id);

    const patient = await Patient.findOne({
      patientId: req.params.id.trim()
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient Not Found" });
    }

    res.set("Cache-Control", "no-store");
    res.json(patient);

  } catch (error) {
    console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
  console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
// Update Appointment Result
router.put("/:id/appointment/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
     const {
  status,
  date,
  result,
  diagnosis,
  prescription,
  followUp,
  paymentStatus,
  medicineDispensed
} = req.body;

    const patient = await Patient.findOne({ patientId: id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointmentIndex = parseInt(index);

    if (!patient.appointments[appointmentIndex]) {
      return res.status(404).json({ message: "Appointment not found" });
    }

     const appointment = patient.appointments[appointmentIndex];

    // ===== UPDATE FIELDS =====
    if (status !== undefined) {
      appointment.status = status;
    }

    if (date !== undefined) {
      appointment.date = new Date(date);
    }

    if (result !== undefined) {
      appointment.result = result;
    }

    if (diagnosis !== undefined) {
  appointment.diagnosis = diagnosis;
}

if (prescription !== undefined) {
  appointment.prescription = prescription;
}

if (followUp !== undefined) {
  appointment.followUp = followUp;
}

if (paymentStatus !== undefined) {
  appointment.paymentStatus = paymentStatus;
}

if (medicineDispensed !== undefined) {
  appointment.medicineDispensed = medicineDispensed;
}

    // ===== AUTO PROMOTE WAITING LIST =====
    if (status === "Cancelled") {

      const cancelledDate = appointment.date;
      const cancelledDoctor = appointment.doctor;

      const waitingPatients = await Patient.find({
        "appointments.date": cancelledDate,
        "appointments.doctor": cancelledDoctor,
        "appointments.status": "Waiting"
      });

      if (waitingPatients.length > 0) {

        const promotePatient = waitingPatients[0];

        const waitingAppointment = promotePatient.appointments.find(
          (a) =>
            a.status === "Waiting" &&
            a.doctor === cancelledDoctor &&
            new Date(a.date).toDateString() ===
              new Date(cancelledDate).toDateString()
        );

        if (waitingAppointment) {
          waitingAppointment.status = "Scheduled";
          await promotePatient.save();
        }
      }
    }

    await patient.save();

    res.json(patient);

  } catch (error) {
    console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({
      patientId: req.params.id
    });

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });

  } catch (error) {
    console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/slots", async (req, res) => {
  try {
    const { doctor, date } = req.query;

    const REGULAR_LIMIT = 2;
    const WAITING_LIMIT = 1;

    const selectedDate = new Date(date);

    const patients = await Patient.find({
      "appointments.doctor": doctor,
    });

    const timeSlots = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","12:00","12:30",
      "02:00","02:30","03:00","03:30",
      "04:00","04:30","05:00"
    ];

    const slotData = {};

    timeSlots.forEach((slot) => {
      let regular = 0;
      let waiting = 0;

      patients.forEach((p) => {
        p.appointments.forEach((a) => {
          if (
            a.doctor === doctor &&
            a.time === slot &&
            new Date(a.date).toDateString() ===
              selectedDate.toDateString()
          ) {
            if (a.status === "Scheduled") regular++;
            if (a.status === "Waiting") waiting++;
          }
        });
      });

      slotData[slot] = {
        regularLeft: REGULAR_LIMIT - regular,
        waitingLeft: WAITING_LIMIT - waiting,
      };
    });

    res.json(slotData);

  } catch (error) {
  console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:id/diagnostics", verifyToken, authorize(["doctor", "admin"]), async (req, res) => {
  try {
    const { testType, date } = req.body;

    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    patient.diagnostics.push({
      testType,
      date,
      status: "Booked"
    });

    await patient.save();

    res.json(patient);

  } catch (error) {
  console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/diagnostics/walkin", async (req, res) => {
  try {
    const { name, phone, testType, date } = req.body;

    if (!name || !phone || !testType || !date) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    let patient = await Patient.findOne({ phone });

    function generatePatientId() {
      return "JH" + Math.floor(1000 + Math.random() * 9000);
    }

    if (!patient) {
      patient = new Patient({
        patientId: generatePatientId(),
        name,
        phone,
        department: "Diagnostics",
        appointments: [],
        diagnostics: []
      });
    }

    patient.diagnostics.push({
      testType,
      date,
      status: "Booked"
    });

    await patient.save();

    res.json({
      message: "Walk-in diagnostic booked",
      patientId: patient.patientId
    });

  } catch (error) {
    console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
const Joi = require("joi");

const admitSchema = Joi.object({
  wardType: Joi.string().required(),
  roomNumber: Joi.string().required(),
  bedNumber: Joi.string().required(),
  admissionReason: Joi.string().required(),
  admissionDate: Joi.date().required(),
  expectedDischarge: Joi.date().required()
});

router.post("/:id/admit", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
     const { error } = admitSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
    const {
      wardType,
      roomNumber,
      bedNumber,
      admissionReason,
      admissionDate,
      expectedDischarge
    } = req.body;

    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    if (patient.admission?.isAdmitted) {
      return res.status(400).json({
        message: "Patient already admitted"
      });
    }
     const selectedBed = await Bed.findOne({
  wardType,
  roomNumber,
  bedNumber,
  isOccupied: false
});

if (!selectedBed) {
  return res.status(400).json({
    message: "Selected bed is already occupied or invalid"
  });
}
    patient.admission = {
      isAdmitted: true,
      wardType,
      roomNumber,
      bedNumber,
      admissionReason,
      admissionDate,
      expectedDischarge,
      approvedByDoctor: true,
      currentStatus: "Admitted"
    };
    
    await patient.save();

    selectedBed.isOccupied = true;
selectedBed.patientId = patient.patientId;

await selectedBed.save();
 
    res.json({
      message: "Patient admitted successfully",
      patient
    });

  } catch (error) {
   console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id/discharge", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }
    const bed = await Bed.findOne({
      patientId: patient.patientId
    });

    if (bed) {
      bed.isOccupied = false;
      bed.patientId = null;
      await bed.save();
    }

    patient.admission = {
      isAdmitted: false,
      currentStatus: "Discharged"
    };

    await patient.save();

    res.json({
      message: "Patient discharged successfully",
      patient
    });

  } catch (error) {
  console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
router.put("/:id/procedure", verifyToken, authorize(["doctor"]), async (req, res) => {
  try {
    const { procedureType, surgeonName, otDate } = req.body;

    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    if (!patient.admission?.isAdmitted) {
      return res.status(400).json({
        message: "Patient is not admitted"
      });
    }

    patient.admission.procedureType = procedureType;
    patient.admission.surgeonName = surgeonName;
    patient.admission.otDate = otDate;
    patient.admission.procedureStatus = "Scheduled";

    await patient.save();

    res.json({
      message: "Procedure scheduled successfully",
      patient
    });

  } catch (error) {
  console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
const cathSchema = Joi.object({
  diagnosis: Joi.string().required(),
  confirmationDone: Joi.boolean().optional(), 
  procedurePerformed: Joi.string().required(),
  implantDetails: Joi.string().required(),
  postProcedureLocation: Joi.string().required(),
  emergencyShift: Joi.boolean().required()
});
router.put("/:id/cathlab", verifyToken, authorize(["doctor","admin"]), async (req, res) => {
  try {
    const { error } = cathSchema.validate(req.body);

if (error) {
  return res.status(400).json({
    message: error.details[0].message
  });
}
    const {
      diagnosis,
      confirmationDone,
      procedurePerformed,
      implantDetails,
      postProcedureLocation,
      emergencyShift
    } = req.body;

    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.admission?.isAdmitted) {
      return res.status(400).json({
        message: "Patient not admitted"
      });
    }

    patient.admission.cathLab = {
      diagnosis,
      confirmationDone,
      procedurePerformed,
      implantDetails,
      procedureCompleted: true,
      postProcedureLocation,
      emergencyShift
    };

    await patient.save();

    res.json({
      message: "Cath Lab process updated",
      patient
    });

  } catch (error) {
    console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
const otSchema = Joi.object({
  surgeryType: Joi.string().required(),
  surgeonName: Joi.string().required(),
  otDate: Joi.date().required(),
  materialsUsed: Joi.string().required(),
  surgeryNotes: Joi.string().required(),
  postOpMonitoring: Joi.string().required(),
  observations: Joi.string().required(),
  finalWard: Joi.string().required()
});
router.put("/:id/ot", verifyToken, authorize(["doctor","admin"]), async (req, res) => {
  try {
    const { error } = otSchema.validate(req.body);

if (error) {
  return res.status(400).json({
    message: error.details[0].message
  });
}
    const {
      surgeryType,
      surgeonName,
      otDate,
      materialsUsed,
      surgeryNotes,
      postOpMonitoring,
      observations,
      finalWard
    } = req.body;

    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.admission?.isAdmitted) {
      return res.status(400).json({
        message: "Patient not admitted"
      });
    }

    patient.admission.operationTheater = {
      surgeryType,
      surgeonName,
      otDate,
      materialsUsed,
      surgeryNotes,
      surgeryStatus: "Completed",
      postOpMonitoring,
      observations,
      finalWard
    };

    await patient.save();

    res.json({
      message: "Operation Theater updated",
      patient
    });

  } catch (error) {
   console.error(error);
res.status(500).json({ message: "Internal server error" });
  }
});
const pharmacySchema = Joi.object({
  medicineName: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  price: Joi.number().positive().required()
});
router.post("/:id/pharmacy", verifyToken, authorize(["pharmacist","admin"]), async (req, res) => {
  try {
    const { error } = pharmacySchema.validate(req.body);

if (error) {
  return res.status(400).json({
    message: error.details[0].message
  });
}
    const { medicineName, quantity, price } = req.body;

    const patient = await Patient.findOne({
      patientId: req.params.id
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const total = quantity * price;

    patient.pharmacy.push({
      medicineName,
      quantity,
      price,
      total,
      status: "Dispensed"
    });

    await patient.save();

    res.json({
      message: "Medicine dispensed",
      patient
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  router.get("/:id/appointment-info", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const latest = patient.appointments[patient.appointments.length - 1];

    res.json({
      patientId: patient.patientId,
      doctor: latest.doctor,
      roomNumber: latest.roomNumber || "Room Not Assigned",
      time: latest.time,
      date: latest.date
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔍 GET PATIENT BY ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
const testMap = {
  "ECG": { instructor: "ECG Tech Ravi", room: "ECG Room" },
  "ECHO": { instructor: "Echo Specialist Priya", room: "Echo Lab" },
  "TMT": { instructor: "Stress Lab Arjun", room: "TMT Room" },
  "Holter": { instructor: "Monitoring Unit", room: "Holter Room" },
  "Angiography": { instructor: "Cath Lab Team", room: "Cath Lab" },
  "Cardiac CT": { instructor: "CT Specialist", room: "CT Room" },
  "Cardiac MRI": { instructor: "MRI Specialist", room: "MRI Room" },
  "Blood Test": { instructor: "Lab Technician", room: "Lab Room" }
};

const testCostMap = {
  "ECG": 300,
  "ECHO": 800,
  "TMT": 1200,
  "Holter": 1500,
  "Angiography": 5000,
  "Cardiac CT": 4000,
  "Cardiac MRI": 6000,
  "Blood Test": 200
};

const surgeryCostMap = {
  "Angioplasty": 150000,
  "CABG": 250000,
  "Valve Surgery": 300000
};
const surgeryMap = {
  "Angioplasty": { doctor: "Dr Meera Nair", room: "Cath Lab OT" },
  "CABG": { doctor: "Dr Rajesh Sharma", room: "Main OT-1" },
  "Valve Surgery": { doctor: "Dr Amit Verma", room: "Main OT-2" }
};
// 🩺 DOCTOR UPDATE
router.put("/:id/doctor-update", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const patient = await Patient.findOne({ patientId: req.params.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

   const latest = patient.appointments.find(
  (appt) => appt.status === "Scheduled"
);

if (!latest) {
  return res.status(400).json({
    message: "No active appointment found"
  });
}

    // ================= BASIC DETAILS =================
    latest.visitCount = (latest.visitCount || 0) + 1;
    latest.diagnosis = req.body.diagnosis || "";
    latest.prescription = req.body.prescription || "";
    latest.followUp = req.body.followUp || "";

    // ================= TESTS =================
    let testTypes = [];

    if (Array.isArray(req.body.testType)) {
      testTypes = req.body.testType;
    } else if (typeof req.body.testType === "string") {
      testTypes = [req.body.testType];
    }

    latest.tests = [];

    testTypes.forEach((test) => {
      const t = testMap[test];
      if (t) {
        latest.tests.push({
          testName: test,
          instructor: t.instructor,
          room: t.room
        });
      }
    });

    // ================= SURGERY =================
    if (req.body.surgery && req.body.surgery !== "No") {
      const s = surgeryMap[req.body.surgery];
      if (s) {
        latest.surgeryType = req.body.surgery;
        latest.surgeonName = s.doctor;
        latest.otRoom = s.room;
      }
    } else {
      latest.surgeryType = null;
      latest.surgeonName = null;
      latest.otRoom = null;
    }

    // ================= FINALIZE =================
    latest.status = "Completed";
     await patient.save();
      patient.appointments.push({
  date: new Date(),
  status: "Scheduled",
  visitCount: (latest.visitCount || 1) + 1
});
    await patient.save();

    res.json({
      message: "Updated successfully",
      tests: latest.tests,
      surgery: latest.surgeryType,
      surgeon: latest.surgeonName,
      otRoom: latest.otRoom,
      followUp: latest.followUp
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;