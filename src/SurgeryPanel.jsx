import { useState } from "react";

function SurgeryPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [visitNotes, setVisitNotes] = useState({});

  const surgeonName = localStorage.getItem("doctorName");

  const fetchPatient = async () => {
    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
      );
      const data = await res.json();

      console.log("Fetched patient:", data);

      if (res.ok) setPatient(data);
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error fetching patient");
    }
  };

  const handleSubmit = async (visitIndex) => {
    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/surgery-update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitIndex,
            notes: visitNotes[visitIndex],
            status: "Completed",
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Surgery completed. Send patient back to ${data.doctor}`);
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

      {patient &&
        patient.appointments.map((appt, i) => (
          <div
            key={i}
            style={{
              border: "1px solid gray",
              marginTop: 10,
              padding: "15px",
            }}
          >
            <h3>Visit {i + 1}</h3>

            {/* Show surgery info */}
            {appt.surgeryType ? (
              <div>
                <p>
                  <b>{appt.surgeryType}</b> → {appt.surgeonName} ({appt.otRoom})
                </p>

                {/* 🔥 ALWAYS SHOW TEXTAREA */}
                <textarea
                  style={{
                    width: "100%",
                    height: "80px",
                    marginTop: "10px",
                  }}
                  placeholder="Enter surgery result / notes"
                  value={visitNotes[i] || ""}
                  onChange={(e) =>
                    setVisitNotes({
                      ...visitNotes,
                      [i]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => handleSubmit(i)}
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
        ))}
    </div>
  );
}

export default SurgeryPanel;