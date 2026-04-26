import { useState } from "react";

function InstructorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [results, setResults] = useState({});

  // ✅ Get logged-in instructor
  const instructorName = localStorage.getItem("instructorName");

  // 🔍 Fetch patient
  const fetchPatient = async () => {
    try {
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
      );

      const data = await res.json();

      if (res.ok) {
        setPatient(data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching patient");
    }
  };

  // 📤 Submit results
  const handleSubmit = async () => {
    try {
      const formatted = Object.keys(results).map((key) => {
        const [visitIndex, testName] = key.split("-");

        return {
          visitIndex: Number(visitIndex),
          testName,
          result: results[key]
        };
      });

      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/instructor-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            results: formatted,
            instructor: instructorName // ✅ IMPORTANT
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(`Go to ${data.doctor} in ${data.room}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting results");
    }
  };

  return (
    <div className="container">
      {/* ✅ Welcome */}
      <h2>Welcome {instructorName || "Instructor"}</h2>

      {/* 🔍 Patient Search */}
      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>Fetch Patient</button>

      {/* 📋 VISIT-WISE DISPLAY */}
      {patient &&
        patient.appointments.map((appt, i) => (
          <div
            key={i}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginTop: "15px"
            }}
          >
            <h3>Visit {i + 1}</h3>

            {/* ❌ No tests */}
            {(!appt.tests || appt.tests.length === 0) && (
              <p>No tests assigned</p>
            )}

            {/* ✅ Show tests */}
            {appt.tests &&
              appt.tests.map((t, index) => (
                <div key={index}>
                  <p>
                    <b>{t.testName}</b> → {t.instructor} ({t.room})
                    {t.instructor === instructorName && (
                      <span style={{ color: "green" }}> (Your Test)</span>
                    )}
                  </p>

                  <input
                    placeholder="Enter result"
                    onChange={(e) =>
                      setResults((prev) => ({
                        ...prev,
                        [`${i}-${t.testName}`]: e.target.value
                      }))
                    }
                  />
                </div>
              ))}
          </div>
        ))}

      {/* 📤 Submit */}
      {patient && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            background: "green",
            color: "white",
            padding: "10px"
          }}
        >
          Submit Results
        </button>
      )}
    </div>
  );
}

export default InstructorPanel;