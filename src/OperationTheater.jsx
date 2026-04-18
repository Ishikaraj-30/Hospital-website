import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OperationTheater() {
  const [patientId, setPatientId] = useState("");
  const [surgeryType, setSurgeryType] = useState("");
  const [surgeonName, setSurgeonName] = useState("");
  const [otDate, setOtDate] = useState("");
  const [materialsUsed, setMaterialsUsed] = useState("");
  const [surgeryNotes, setSurgeryNotes] = useState("");
  const [postOpMonitoring, setPostOpMonitoring] = useState("");
  const [observations, setObservations] = useState("");
  const [finalWard, setFinalWard] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
useEffect(() => {
  fetch("https://hospital-backend-kdn2.onrender.com/api/admin/check", {
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
      const res = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${patientId}/ot`,
        {
          method: "PUT",
           credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surgeryType,
            surgeonName,
            otDate,
            materialsUsed,
            surgeryNotes,
            postOpMonitoring,
            observations,
            finalWard
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Surgery updated successfully");

    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Operation Theater</h2>

      <div className="card">

        <input placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />

        <input placeholder="Surgery Type" value={surgeryType} onChange={e => setSurgeryType(e.target.value)} />

        <input placeholder="Surgeon Name" value={surgeonName} onChange={e => setSurgeonName(e.target.value)} />

        <input type="date" value={otDate} onChange={e => setOtDate(e.target.value)} />

        <input placeholder="Materials Used" value={materialsUsed} onChange={e => setMaterialsUsed(e.target.value)} />

        <input placeholder="Surgery Notes" value={surgeryNotes} onChange={e => setSurgeryNotes(e.target.value)} />

        <input placeholder="Post-Op Monitoring" value={postOpMonitoring} onChange={e => setPostOpMonitoring(e.target.value)} />

        <input placeholder="Observations" value={observations} onChange={e => setObservations(e.target.value)} />

        <select value={finalWard} onChange={e => setFinalWard(e.target.value)}>
          <option value="">Final Ward</option>
          <option>ICU</option>
          <option>General Ward</option>
          <option>Special Ward</option>
          <option>Pediatric Ward</option>
        </select>

        <button className="button-primary" onClick={handleSubmit}>
          Update Surgery
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default OperationTheater;