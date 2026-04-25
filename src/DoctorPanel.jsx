import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DoctorPanel() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);

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
  }, [navigate]);

  // ================= FETCH PATIENT =================
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

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    console.log("Sending:", {
      testType,
      surgery,
      diagnosis,
      prescription,
      followUp
    });

    setResult(null);

    const res = await fetch(
      `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/doctor-update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
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

          {/* ================= TESTS ================= */}
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
                    const checked = e.target.checked;

                    setTestType((prev) => {
                      if (checked) {
                        return [...prev, test];
                      } else {
                        return prev.filter((t) => t !== test);
                      }
                    });
                  }}
                />
                {test}
              </label>
            ))}
          </div>

          {/* ================= SURGERY ================= */}
          <select
            value={surgery}
            onChange={(e) => setSurgery(e.target.value)}
          >
            <option value="">Procedure Required?</option>
            <option value="No">No</option>
            <option value="Angioplasty">Angioplasty</option>
            <option value="CABG">CABG</option>
            <option value="Valve Surgery">Valve Surgery</option>
          </select>

          {/* ================= TEXT INPUTS ================= */}
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

          <button type="button" onClick={handleSubmit}>
            Submit Consultation
          </button>

          {/* ================= RESULT ================= */}
          {result !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>Next Step</h3>

              {/* DOWNLOAD */}
              <a
                href={`https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/download`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  style={{
                    marginBottom: "15px",
                    backgroundColor: "green",
                    color: "white"
                  }}
                >
                  Download Full Report
                </button>
              </a>

              {/* TESTS */}
              {Array.isArray(result.tests) && result.tests.length > 0 && (
                <div>
                  {result.tests.map((t, index) => (
                    <p key={index}>
                      <b>{t.testName}</b> → {t.instructor} ({t.room})
                    </p>
                  ))}
                </div>
              )}

              {/* SURGERY */}
              {result.surgery && (
                <p>
                  <b>{result.surgery}</b> with {result.surgeon} ({result.otRoom})
                </p>
              )}

              {/* FOLLOW UP */}
              {(!result.tests || result.tests.length === 0) &&
                !result.surgery &&
                result.followUp && (
                  <p>
                    <b>Next Appointment:</b> {result.followUp}
                  </p>
                )}

              {/* NOTHING */}
              {(!result.tests || result.tests.length === 0) &&
                !result.surgery &&
                !result.followUp && (
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