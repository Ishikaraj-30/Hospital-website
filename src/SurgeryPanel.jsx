import { useState } from "react";

function SurgeryPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
const [visitNotes, setVisitNotes] = useState({});

  const surgeonName = localStorage.getItem("doctorName");

  const fetchPatient = async () => {
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
    );
    const data = await res.json();
    if (res.ok) setPatient(data);
    else alert(data.message);
  };

  const handleSubmit = async (visitIndex) => {
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/surgery-update`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitIndex,
          notes: visitNotes[visitIndex],
          status: "Completed"
        })
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert(`Send patient back to ${data.doctor}`);
    } else {
      alert(data.message);
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
          <div key={i} style={{ border: "1px solid gray", marginTop: 10 }}>
            <h3>Visit {i + 1}</h3>

            {appt.surgeryType && (
              <div>
                <p>
                  <b>{appt.surgeryType}</b> → {appt.surgeonName} ({appt.otRoom})
                </p>

                {appt.surgeonName === surgeonName && (
                  <>
                  <textarea
      style={{ width: "100%", height: "80px", marginTop: "10px" }}             
  placeholder="Enter surgery result / notes"
  value={visitNotes[i] || ""}
  onChange={(e) =>
    setVisitNotes({
      ...visitNotes,
      [i]: e.target.value,
    })
  }
/>

                    <button onClick={() => handleSubmit(i)}>
                      Complete Surgery
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default SurgeryPanel;