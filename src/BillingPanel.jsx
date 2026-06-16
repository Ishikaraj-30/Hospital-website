import { useState } from "react";

function BillingPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

  const testCostMap = {
    ECG: 300,
    ECHO: 800,
    TMT: 1200,
    Holter: 1500,
    Angiography: 5000,
    "Cardiac CT": 4000,
    "Cardiac MRI": 6000,
    "Blood Test": 200,
    "X-Ray": 1000
  };

  const fetchPatient = async () => {
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}`
    );

    const data = await res.json();

    if (res.ok)
      setPatient(data);
  };

  const completeBilling = async () => {
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/billing-complete`,
      {
        method: "PUT"
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Sent to Diagnostics");
    } else {
      alert(data.message);
    }
  };

 const latest = patient?.appointments
  ?.slice()
  .reverse()
  .find(
    (a) => a.tests && a.tests.length > 0
  );
  
  const total =
    latest?.tests?.reduce(
      (sum, t) =>
        sum +
        (testCostMap[t.testName] || 0),
      0
    ) || 0;

  return (
    <div className="container">
      <h2>Billing Panel</h2>

      <input
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) =>
          setPatientId(e.target.value)
        }
      />

      <button onClick={fetchPatient}>
        Fetch
      </button>

      {latest && (
        <div className="card">
          <h3>{patient.name}</h3>

          {latest.tests.map((t, i) => (
            <p key={i}>
              {t.testName} —
              ₹{testCostMap[t.testName]}
            </p>
          ))}

          <h3>Total: ₹{total}</h3>

          <a
            href={`https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/receipt`}
            target="_blank"
            rel="noreferrer"
          >
            <button>
              Download Bill PDF
            </button>
          </a>

          <button
            onClick={completeBilling}
          >
            Payment Completed
          </button>
        </div>
      )}
    </div>
  );
}

export default BillingPanel;