import { useState } from "react";

function SurgeryPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState("");

  const fetchPatient = async () => {
    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
      );
      const data = await res.json();

      if (res.ok) setPatient(data);
      else alert(data.message);
    } catch {
      alert("Error fetching patient");
    }
  };

  // ✅ FIND ACTIVE SURGERY IN FRONTEND ALSO
  const activeSurgery = patient?.appointments
    ?.slice()
    .reverse()
    .find(
      (a) =>
        a.surgeryType &&
        a.status !== "Surgery Completed"
    );

  const handleSubmit = async () => {
    if (!notes) {
      alert("Enter surgery result");
      return;
    }

    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/surgery-update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }) // ✅ CORRECT
        }
      );

      const data = await res.json();

      if (res.ok) {
         alert(`✅Surgery completed. Sent back to ${data.doctor || "Doctor"}`);
        setNotes("");
        fetchPatient(); // refresh
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Surgery Panel</h2>

      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>Fetch</button>

      {patient && (
        <div style={{ marginTop: "20px" }}>
          <h3>{patient.name}</h3>

          {activeSurgery ? (
            <div style={{ border: "1px solid gray", padding: "15px" }}>
              <p>
                <b>{activeSurgery.surgeryType}</b> →{" "}
                {activeSurgery.surgeonName} ({activeSurgery.otRoom})
              </p>

              <textarea
                placeholder="Enter surgery result"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: "100%", height: "80px" }}
              />

              <button onClick={handleSubmit}>
                Complete Surgery
              </button>
            </div>
          ) : (
            <p style={{ color: "red" }}>
              No active surgery assigned
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SurgeryPanel;