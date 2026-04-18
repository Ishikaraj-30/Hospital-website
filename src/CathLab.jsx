import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CathLab() {
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [procedurePerformed, setProcedurePerformed] = useState("");
  const [implantDetails, setImplantDetails] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [emergencyShift, setEmergencyShift] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 🔐 Admin protection
 useEffect(() => {
  fetch("http://localhost:5000/api/admin/check", {
    credentials: "include"
  })
    .then((res) => {
      if (!res.ok) {
        navigate("/login");
      }
    })
    .catch(() => navigate("/login"));
}, [navigate]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${patientId}/cathlab`,
        {
          method: "PUT",
           credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            diagnosis,
            confirmationDone: true,
            procedurePerformed,
            implantDetails,
            postProcedureLocation: postLocation,
            emergencyShift
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error updating cath lab");
        return;
      }

      setMessage("Cath Lab details updated successfully");

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Cath Lab Management</h2>

      <div className="card">

        <input
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <input
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />

        <select
          value={procedurePerformed}
          onChange={(e) => setProcedurePerformed(e.target.value)}
        >
          <option value="">Procedure Performed</option>
          <option>Angiography</option>
          <option>Angioplasty</option>
        </select>

        <input
          placeholder="Implant Details"
          value={implantDetails}
          onChange={(e) => setImplantDetails(e.target.value)}
        />

        <select
          value={postLocation}
          onChange={(e) => setPostLocation(e.target.value)}
        >
          <option value="">Post Procedure Location</option>
          <option>ICU</option>
          <option>General Ward</option>
          <option>Special Ward</option>
          <option>Pediatric Ward</option>
        </select>

        <label style={{ display: "block", marginTop: "10px" }}>
          Emergency Shift
          <input
            type="checkbox"
            checked={emergencyShift}
            onChange={(e) => setEmergencyShift(e.target.checked)}
            style={{ marginLeft: "10px" }}
          />
        </label>

        <button
          className="button-primary"
          onClick={handleSubmit}
          style={{ marginTop: "15px" }}
        >
          Update Cath Lab
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

export default CathLab;