const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
  },
  name: String,
  phone: String,
  department: String,
  appointments: [
  {
    date: Date,
    time: String,
    doctor: String,
    designation: String,
    result: String,
    tokenNumber: String,
    roomNumber: String,      
    visitCount: {             
      type: Number,
      default: 1
    },
    diagnosis: String,
    prescription: String,
    followUp: String,
    paymentStatus: {
      type: String,
      default: "Pending"
    },
    medicineDispensed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "Scheduled"
    }
  }
],
 diagnostics: [
    {
      testType: String,
      date: Date,
      status: {
        type: String,
        default: "Booked"
      }
    }
  ],
  admission: {
  isAdmitted: {
    type: Boolean,
    default: false
  },
  wardType: String,
  roomNumber: String,
  bedNumber: String,
  admissionReason: String,
  admissionDate: Date,
  expectedDischarge: Date,
  approvedByDoctor: {
    type: Boolean,
    default: false
  },
  currentStatus: {
    type: String,
    default: "Not Admitted"
  },
  procedureType: String,
  surgeonName: String,
  otDate: Date,
  procedureStatus: {
    type: String,
    default: "Not Scheduled"
},
cathLab: {
  diagnosis: String,
  confirmationDone: {
    type: Boolean,
    default: false
  },

  procedurePerformed: String, // Angiography / Angioplasty
  implantDetails: String,

  procedureCompleted: {
    type: Boolean,
    default: false
  },

  postProcedureLocation: String, // ICU / Ward / etc
  emergencyShift: {
    type: Boolean,
    default: false
  }
},
operationTheater: {
  surgeryType: String,
  surgeonName: String,
  otDate: Date,

  materialsUsed: String,
  surgeryNotes: String,

  surgeryStatus: {
    type: String,
    default: "Not Started"
  },

  postOpMonitoring: String,
  observations: String,

  finalWard: String
}
},
pharmacy: [
  {
    medicineName: String,
    quantity: Number,
    price: Number,
    total: Number,
    status: {
      type: String,
      default: "Pending"
    }
  }
]
});

module.exports = mongoose.model("Patient", patientSchema);