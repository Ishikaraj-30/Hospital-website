import { useState } from "react";

function AppointmentInfo() {
  const [patientId, setPatientId] = useState("");
  const [data, setData] = useState(null);

  const fetchInfo = async () => {
    const res = await fetch(
      `http://localhost:5000/api/patients/${patientId}/appointment-info`
    );
    const result = await res.json();
    setData(result);
  };

  return (
    <div className="container">
      <h2>Find Your Appointment</h2>

      <input
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button onClick={fetchInfo}>Get Details</button>

      {data && (
        <div className="card">
          <p><b>Doctor:</b> {data.doctor}</p>
          <p><b>Room:</b> {data.roomNumber}</p>
          <p><b>Date:</b> {new Date(data.date).toDateString()}</p>
          <p><b>Time:</b> {data.time}</p>
        </div>
      )}
    </div>
  );
}

export default AppointmentInfo;