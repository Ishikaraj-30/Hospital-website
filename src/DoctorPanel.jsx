import { useState } from "react";

function DoctorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

  const [problem, setProblem] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUp, setFollowUp] = useState("");

  const [selectedTests, setSelectedTests] = useState([]);

  const testCostMap = {
    ECG: 300,
    ECHO: 800,
    TMT: 1200,
    Holter: 1500,
    Angiography: 5000,
    "Cardiac CT": 4000,
    "Cardiac MRI": 6000,
    "Blood Test": 200,
    "X-Ray": 1000,
  };

  const tests = Object.keys(testCostMap);

  const handleCheckbox = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(
        selectedTests.filter((t) => t !== test)
      );
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const totalCost = selectedTests.reduce(
    (sum, test) => sum + testCostMap[test],
    0
  );

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
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          diagnosis,
          prescription,
          followUp,
          testType: selectedTests,
        }),
      }
    );

    const data = await res.json();

if (res.ok) {

  alert("Go to Billing Section");

  window.open(
    `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/receipt`,
    "_blank"
  );

} else {
  alert(data.message);
}
};

  return (
    <div className="container">
      <h2>Doctor Panel</h2>

      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>
        Fetch Patient
      </button>

      {patient && (
        <div className="card">
          <h3>{patient.name}</h3>

          <p><b>Phone:</b> {patient.phone}</p>
          <p><b>Department:</b> {patient.department}</p>

          <textarea
            placeholder="Problem / Symptoms"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          <textarea
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <textarea
            placeholder="Prescription"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          />

          <input
            type="date"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
          />

          <h3>Select Tests</h3>

          {tests.map((test) => (
            <div key={test}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test)}
                  onChange={() => handleCheckbox(test)}
                />

                {test} — ₹{testCostMap[test]}
              </label>
            </div>
          ))}

          <h3>Total Billing: ₹{totalCost}</h3>

          <button
            onClick={handleSubmit}
            className="button-primary"
          >
            Send To Billing
          </button>
        </div>
      )}
    </div>
  );
}

export default DoctorPanel;