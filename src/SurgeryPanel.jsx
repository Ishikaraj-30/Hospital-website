import { useState } from "react";

function SurgeryPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

  // ✅ FIX: single notes state (not object)
  const [notes, setNotes] = useState("");

  const surgeonName = localStorage.getItem("doctorName");
const latestAppointment =
  patient?.appointments?.length
    ? patient.appointments[patient.appointments.length - 1]
    : null;

  const fetchPatient = async () => {
    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
      );
      const data = await res.json();

      if (res.ok) setPatient(data);
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error fetching patient");
    }
  };

  // ✅ FIX: no visitIndex needed anymore
  const handleSubmit = async () => {
    if (!notes) {
      alert("Please enter surgery result");
      return;
    }

    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/surgery-update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ notes })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Surgery completed. Sent back to ${data.doctor}`);
        setNotes(""); // clear after submit
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while saving");
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

      {patient && latestAppointment && (
  <div
    style={{
      border: "1px solid gray",
      marginTop: 10,
      padding: "15px",
    }}
  >
    <h3>Latest Visit</h3>

    {latestAppointment.surgeryType ? (
      <div>
        <p>
          <b>{latestAppointment.surgeryType}</b> →{" "}
          {latestAppointment.surgeonName} ({latestAppointment.otRoom})
        </p>

        <textarea
          style={{
            width: "100%",
            height: "80px",
            marginTop: "10px",
          }}
          placeholder="Enter surgery result / notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
          }}
        >
          Complete Surgery
        </button>
      </div>
    ) : (
      <p>No surgery assigned</p>
    )}
  </div>
)}
    </div>
  );
}

export default SurgeryPanel;