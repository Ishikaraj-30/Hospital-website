import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

function DoctorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

  const [visitCount, setVisitCount] = useState("");
  const [testType, setTestType] = useState([]);
  const [surgery, setSurgery] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [result, setResult] = useState(null);

  const navigate = useNavigate();
useEffect(() => {
  if (!localStorage.getItem("doctorId")) {
    navigate("/doctor-login");
  }
}, []);

  

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
     setResult(null); 
    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/doctor-update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          visitCount,
          diagnosis,
          prescription,
          followUp,
          testType,
          surgery
        })
      }
    );

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="container">
      <h2>Doctor Panel</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchPatient}>Fetch Patient</button>

      {/* 📋 Patient Details */}
      {patient && (
        <div className="card">
          <h3>Patient Details</h3>

          <p><b>Name:</b> {patient.name}</p>
          <p><b>Department:</b> {patient.department}</p>

          <hr />

          {/* 🧠 Doctor Input */}
         <select value={visitCount} onChange={(e) => setVisitCount(e.target.value)}>
  <option value="">Select Visit</option>
  <option value="1">First Visit</option>
  <option value="2">Second Visit</option>
  <option value="3">Follow-up</option>
</select>

 <div>
  <h4>Select Cardiac Tests</h4>

  {[
    "ECG",
    "ECHO",
    "TMT",
    "Holter",
    "Angiography",
    "Cardiac CT",
    "Cardiac MRI",
    "Blood Test"
  ].map((test) => (
    <label key={test} style={{ display: "block" }}>
      <input
        type="checkbox"
        value={test}
        onChange={(e) => {
          if (e.target.checked) {
            setTestType([...testType, test]);
          } else {
            setTestType(testType.filter((t) => t !== test));
          }
        }}
      />
      {test}
    </label>
  ))}
</div>
     

     <select value={surgery} onChange={(e) => setSurgery(e.target.value)}>
  <option value="">Procedure Required?</option>
  <option value="No">No</option>
  <option value="Angioplasty">Angioplasty</option>
  <option value="CABG">Bypass Surgery (CABG)</option>
  <option value="Valve Surgery">Valve Replacement</option>
</select>

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
            placeholder="Follow-up Date"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
          />

          <button onClick={handleSubmit}>
            Submit Consultation
          </button>
         {result && (
  <div style={{ marginTop: "20px" }}>
    <h3>Next Step</h3>

    {/* ✅ TESTS */}
    {Array.isArray(result.tests) && result.tests.length > 0 && (
      <div>
        {result.tests.map((t, index) => (
          <p key={index}>
            <b>{t.testName}</b> → {t.instructor} ({t.room})
          </p>
        ))}
      </div>
    )}

    {/* ✅ SURGERY */}
    {result.surgery && (
      <p>
        <b>{result.surgery}</b> with {result.surgeon} ({result.otRoom})
      </p>
    )}

    {/* ✅ FOLLOW-UP ONLY */}
    {(!result.tests || result.tests.length === 0) && !result.surgery && result.followUp && (
      <p>
        <b>Next Appointment:</b> {result.followUp}
      </p>
    )}

    {/* ✅ CASE 4 */}
    {(!result.tests || result.tests.length === 0) && !result.surgery && !result.followUp && (
      <p>
        <b>No further procedure required.</b>
      </p>
    )}
  </div>
)}
        </div>
      )}
    </div>
  );
}

export default DoctorPanel;