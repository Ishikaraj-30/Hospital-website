import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

  const [visitCount, setVisitCount] = useState("");
  const [testType, setTestType] = useState("");
  const [surgery, setSurgery] = useState("");
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
          followUp,
          testType,
          surgery
        })
      }
    );

    const data = await res.json();
    alert(data.message);
    // ✅ TEST FLOW
  if (data.test) {
    alert(`Go to ${data.instructor} in ${data.testRoom}`);
  }

  // ✅ SURGERY FLOW
  if (data.surgery) {
    alert(`Surgery with ${data.surgeon} in ${data.otRoom}`);
  }

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
         <select value={visitCount} onChange={(e) => setVisitCount(e.target.value)}>
  <option value="">Select Visit</option>
  <option value="1">First Visit</option>
  <option value="2">Second Visit</option>
  <option value="3">Follow-up</option>
</select>

    <select value={testType} onChange={(e) => setTestType(e.target.value)}>
  <option value="">Select Cardiac Test</option>
  <option value="ECG">ECG</option>
  <option value="ECHO">Echocardiography</option>
  <option value="TMT">TMT</option>
  <option value="Holter">Holter Monitoring</option>
  <option value="Angiography">Angiography</option>
  <option value="Cardiac CT">Cardiac CT</option>
  <option value="Cardiac MRI">Cardiac MRI</option>
  <option value="Blood Test">Cardiac Blood Test</option>
</select>
     

     <select value={surgery} onChange={(e) => setSurgery(e.target.value)}>
  <option value="">Procedure Required?</option>
  <option value="No">No</option>
  <option value="Angioplasty">Angioplasty</option>
  <option value="CABG">Bypass Surgery (CABG)</option>
  <option value="Valve Surgery">Valve Replacement</option>
</select>

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