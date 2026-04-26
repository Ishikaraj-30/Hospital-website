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
    const formData = new FormData();

    const formatted = [];

    Object.keys(results).forEach((key) => {
      const [visitIndex, testName] = key.split("-");
      const data = results[key];

      formatted.push({
        visitIndex: Number(visitIndex),
        testName,
        result: data.text
      });

      if (data.file) {
       formData.append("files", data.file, `${testName}.pdf`);
      }
    });

    formData.append("results", JSON.stringify(formatted));
    formData.append("instructor", instructorName);

    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/instructor-update`,
      {
        method: "PUT",
        body: formData
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
     {/* ✅ Show tests */}
{appt.tests &&
  appt.tests.map((t, index) => {
    const key = `${i}-${t.testName}`;

    return (
      <div key={index} style={{ marginBottom: "15px" }}>
        <p>
          <b>{t.testName}</b> → {t.instructor} ({t.room})
          {t.instructor === instructorName && (
            <span style={{ color: "green" }}> (Your Test)</span>
          )}
        </p>

        {/* 🔹 RESULT + FILE GROUP */}
        <div style={{ display: "flex", gap: "10px" }}>
          
          {/* TEXT RESULT */}
          <input
            placeholder="Enter result"
            onChange={(e) =>
              setResults((prev) => ({
                ...prev,
                [key]: {
                  ...(prev[key] || {}),   // ✅ FIX
                  text: e.target.value
                }
              }))
            }
          />

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setResults((prev) => ({
                ...prev,
                [key]: {
                  ...(prev[key] || {}),   // ✅ FIX
                  file: e.target.files[0]
                }
              }))
            }
          />

        </div>
      </div>
    );
  })}
  </div>))}

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