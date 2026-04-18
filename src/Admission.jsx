import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admission() {
  const [patientId, setPatientId] = useState("");
  const [wardType, setWardType] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [admissionReason, setAdmissionReason] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [expectedDischarge, setExpectedDischarge] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [availableBeds, setAvailableBeds] = useState([]);
  const [procedureType, setProcedureType] = useState("");
  const [surgeonName, setSurgeonName] = useState("");
  const [otDate, setOtDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [procedurePerformed, setProcedurePerformed] = useState("");
  const [implantDetails, setImplantDetails] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [emergencyShift, setEmergencyShift] = useState(false);

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

useEffect(() => {
  const fetchBeds = async () => {
    if (!wardType) {
      setAvailableBeds([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/beds/available/${wardType}`
      );

      const data = await response.json();
      setAvailableBeds(data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchBeds();
}, [wardType]);

  const handleAdmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${patientId}/admit`,
        {
          method: "POST",
           credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          
          body: JSON.stringify({
            wardType,
            roomNumber,
            bedNumber,
            admissionReason,
            admissionDate,
            expectedDischarge
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error");
        return;
      }
      if (procedureType && surgeonName && otDate) {
  await fetch(
    `http://localhost:5000/api/patients/${patientId}/procedure`,
    {
      method: "PUT",
       credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        procedureType,
        surgeonName,
        otDate
      })
    }
  );
}

      setMessage("Patient admitted successfully");

    } catch (error) {
      setMessage("Server error");
    }
  };

  const handleDischarge = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${patientId}/discharge`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error");
        return;
      }

      setMessage("Patient discharged successfully");

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Admission Management</h2>

      <div className="card">
        <input
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <select
          value={wardType}
          onChange={(e) => setWardType(e.target.value)}
        >
          <option value="">Select Ward</option>
          <option>ICU</option>
          <option>General Ward</option>
          <option>Special Ward</option>
          <option>Pediatric Ward</option>
        </select>
        <select
  onChange={(e) => {
    const selected = JSON.parse(e.target.value);
    setRoomNumber(selected.roomNumber);
    setBedNumber(selected.bedNumber);
  }}
>
  <option value="">Select Available Bed</option>

  {availableBeds.map((bed) => (
    <option
      key={bed._id}
      value={JSON.stringify({
        roomNumber: bed.roomNumber,
        bedNumber: bed.bedNumber
      })}
    >
      Room {bed.roomNumber} - Bed {bed.bedNumber}
    </option>
  ))}
</select>
{roomNumber && bedNumber && (
  <p style={{ marginTop: "10px" }}>
    Selected: Room {roomNumber}, Bed {bedNumber}
  </p>
)}

        <input
          placeholder="Admission Reason"
          value={admissionReason}
          onChange={(e) => setAdmissionReason(e.target.value)}
        />

        <input
          type="date"
          value={admissionDate}
          onChange={(e) => setAdmissionDate(e.target.value)}
        />

        <input
          type="date"
          value={expectedDischarge}
          onChange={(e) => setExpectedDischarge(e.target.value)}
        />

        <select
  value={procedureType}
  onChange={(e) => setProcedureType(e.target.value)}
>
  <option value="">Select Procedure</option>
  <option>Angiography</option>
  <option>Angioplasty</option>
  <option>Stent Placement</option>
  <option>Bypass Surgery</option>
  <option>Valve Replacement</option>
</select>

<input
  placeholder="Surgeon Name"
  value={surgeonName}
  onChange={(e) => setSurgeonName(e.target.value)}
/>

<input
  type="date"
  value={otDate}
  onChange={(e) => setOtDate(e.target.value)}
/>

        <button
          className="button-primary"
          onClick={handleAdmit}
        >
          Admit Patient
        </button>

        <button
          className="button-danger"
          onClick={handleDischarge}
          style={{ marginLeft: "10px" }}
        >
          Discharge
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

export default Admission;