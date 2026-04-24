import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

  const [visitCount, setVisitCount] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUp, setFollowUp] = useState("");

  const navigate = useNavigate();

  // 🔐 check login
  if (!localStorage.getItem("doctorId")) {
    navigate("/doctor-login");
  }

  const fetchPatient = async () => {
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
    );

    const data = await res.json();

    if (res.ok) {
      setPatient(data);
    } else {
      alert(data.message);
    }
  };

  const handleSubmit = async () => {
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/doctor-update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          visitCount,
          diagnosis,
          prescription,
          followUp
        })
      }
    );

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container">
      <h2>Doctor Panel</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>Fetch Patient</button>

      {/* 📋 Patient Details */}
      {patient && (
        <div className="card">
          <h3>Patient Details</h3>

          <p><b>Name:</b> {patient.name}</p>
          <p><b>Department:</b> {patient.department}</p>

          <hr />

          {/* 🧠 Doctor Input */}
          <input
            placeholder="Visit Count"
            value={visitCount}
            onChange={(e) => setVisitCount(e.target.value)}
          />

          <textarea
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <textarea
            placeholder="Prescription"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          />

          <input
            placeholder="Follow-up Date"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
          />

          <button onClick={handleSubmit}>
            Submit Consultation
          </button>
        </div>
      )}
    </div>
  );
}

export default DoctorPanel;