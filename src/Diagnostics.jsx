import { useState } from "react";

function Diagnostics() {
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [testType, setTestType] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleBook = async () => {
  if (!testType || !date) {
    setMessage("Please fill required fields");
    return;
  }

  try {
    if (patientId) {
      const response = await fetch(
        `http://localhost:5000/api/patients/${patientId}/diagnostics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            testType,
            date
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error");
        return;
      }

      setMessage(
        `Diagnostic test booked successfully for ${patientId}`
      );

    } else {
      const response = await fetch(
  "http://localhost:5000/api/patients/diagnostics/walkin",
  {
    method: "POST",
     credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      phone,
      testType,
      date
    })
  }
);

const data = await response.json();

if (!response.ok) {
  setMessage(data.message || "Error");
  return;
}

setMessage(
  `Walk-in diagnostic booked successfully. Patient ID: ${data.patientId}`
);
    }

  } catch (error) {
    setMessage("Server error");
  }
};

  return (
    <div className="container">
      <h2>Diagnostic Department</h2>

      <div className="card">
        <input
          placeholder="Patient ID (optional)"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <p style={{ textAlign: "center" }}>OR</p>

        <input
          placeholder="Walk-in Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
        >
          <option value="">Select Test</option>
          <option>ECG</option>
          <option>Blood Test</option>
          <option>X-Ray</option>
          <option>TMT</option>
          <option>ECHO</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          className="button-primary"
          onClick={handleBook}
        >
          Book Test
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: "#0077B6" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Diagnostics;