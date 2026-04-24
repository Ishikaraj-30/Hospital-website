import { useState } from "react";

function DoctorDashboard() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

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
        body: JSON.stringify({ diagnosis, prescription })
      }
    );

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div className="container">
      <h2>Doctor Dashboard</h2>

      <input
        placeholder="Enter Patient ID"
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>Fetch Patient</button>

      {patient && (
        <div className="card">
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Department:</b> {patient.department}</p>

          <textarea
            placeholder="Diagnosis"
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <textarea
            placeholder="Prescription"
            onChange={(e) => setPrescription(e.target.value)}
          />

          <button onClick={handleSubmit}>
            Update Patient
          </button>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;