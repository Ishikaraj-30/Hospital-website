console.log("Patient Routes Loaded");
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const verifyToken = require("../middleware/authMiddleware");

// Generate Unique Patient ID
function generatePatientId() {
  return "JH" + Math.floor(1000 + Math.random() * 9000);
}

// ✅ Add New Patient
router.post("/add", async (req, res) => {
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
        status: "Waiting",
        result: "Not Updated Yet"
      });

      await patient.save();

      return res.json({
        patientId: patient.patientId,
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

    patient.appointments.push({
      date: appointmentDate,
      time,
      doctor,
      status: "Scheduled",
      result: "Not Updated Yet"
    });

    await patient.save();

    return res.json({
      patientId: patient.patientId,
      status: "Scheduled"
    });

  } catch (error) {
    console.error("ADD ROUTE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});



router.get("/doctors/download", async (req, res) => {
  try {
  
    const PDFDocument = require("pdfkit");
    const path = require("path");
    const fs = require("fs");

    const doctors = require("../data/doctors"); 
    // ⚠️ If this path doesn't work, tell me your doctors file location

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Hospital_Doctors_Directory.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    /* ================= HEADER ================= */

    const logoPath = path.join(__dirname, "../assets/logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 60 });
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#0A2E5C")
      .text("Jaydev Hospital", 120, 40);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("black")
      .text("Official Doctors Directory", 120, 65);

    doc.moveTo(40, 95).lineTo(555, 95).stroke();

    doc.moveDown(3);

    /* ================= TABLE HEADER ================= */

    const tableTop = doc.y;

    doc
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

      if (doc.y > 750) {
        doc.addPage();
      }
    });

    /* ================= FOOTER ================= */

    doc
      .fontSize(8)
      .fillColor("gray")
      .text(
        "This document is generated by Jaydev Hospital ERP System.",
        40,
        800,
        { align: "center" }
      );

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
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

    const subtotal = completed.length * consultationFee;
    const gstAmount = subtotal * gst;
    const totalAmount = subtotal + gstAmount;

    /* ================= WATERMARK ================= */

    doc
      .fontSize(60)
      .fillColor("gray")
      .opacity(0.1)
      .text("JAYDEV HOSPITAL", 100, 300, {
        angle: 45,
      });
    doc.opacity(1);

    /* ================= HEADER ================= */

    const logoPath = path.join(__dirname, "../assets/logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 60 });
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#0A2E5C")
      .text("Jaydev Hospital", 120, 35);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("black")
      .text("123 Health Avenue, Bangalore, India", 120, 60)
      .text("Email: care@jaydevhospital.com | Phone: +91-9876543210");

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


    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
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
    const subtotal = completed.length * consultationFee;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    doc.fontSize(22).text("Jaydev Hospital", { align: "center" });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update Appointment Result
router.put("/:id/appointment/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
    const { status, date, result } = req.body;

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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;