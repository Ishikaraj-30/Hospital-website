import { useState } from "react";

function InstructorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [results, setResults] = useState({});

  const fetchPatient = async () => {
    const res = await fetch(`https://your-backend/api/patients/${patientId}`);
    const data = await res.json();
    setPatient(data);
  };

  const handleSubmit = async () => {
    const formatted = Object.keys(results).map((key) => ({
      testName: key,
      result: results[key]
    }));

    const res = await fetch(
      `https://your-backend/api/patients/${patientId}/instructor-update`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: formatted })
      }
    );

    const data = await res.json();
    alert(`Go to ${data.doctor} in ${data.room}`);
  };

  return (
    <div>
      <h2>Instructor Panel</h2>

      <input
        placeholder="Patient ID"
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>Fetch</button>

      {patient && patient.appointments.map((appt, i) => (
        <div key={i}>
          {appt.tests && appt.tests.map((t, index) => (
            <div key={index}>
              <p>{t.testName}</p>
              <input
                placeholder="Enter result"
                onChange={(e) =>
                  setResults({
                    ...results,
                    [t.testName]: e.target.value
                  })
                }
              />
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Results</button>
    </div>
  );
}

export default InstructorPanel;