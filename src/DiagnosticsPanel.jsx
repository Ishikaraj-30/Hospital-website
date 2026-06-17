import { useState } from "react";

function DiagnosticsPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

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

  const latest = patient?.appointments
    ?.slice()
    .reverse()
    .find(
      (a) =>
        a.status === "Sent to Diagnostics"
    );

  return (
    <div className="container">
      <h2>Diagnostics Panel</h2>

      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) =>
          setPatientId(e.target.value)
        }
      />

      <button onClick={fetchPatient}>
        Fetch Patient
      </button>

      {patient && latest && (
        <div className="card">
          <h3>{patient.name}</h3>

          <p>
            <b>Department:</b>{" "}
            {patient.department}
          </p>

          <h4>Tests To Perform</h4>

          {latest.tests.map((t, i) => (
            <div key={i}>
              <p>
                <b>{t.testName}</b>
              </p>

              <p>
                Technician: {t.instructor}
              </p>

              <p>Room: {t.room}</p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiagnosticsPanel;