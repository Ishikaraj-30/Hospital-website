
import { useState } from "react";

function Dashboard() {
  const [searchId, setSearchId] = useState("");
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setPatient(null);

      const response = await fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/${searchId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setError("Patient Not Found");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPatient(data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching patient");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h2>Patient Dashboard</h2>

      <input
        type="text"
        placeholder="Enter Patient ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button
        onClick={handleSearch}
        style={{
          padding: "10px",
          backgroundColor: "#0077B6",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {patient && (
        <div
          style={{
            marginTop: "20px",
            background: "#E6F4F9",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Phone:</b> {patient.phone}</p>

          <h3>Appointments</h3>

          {patient.appointments?.length === 0 && (
            <p>No appointments found.</p>
          )}

          {patient.appointments?.map((appt, index) => {
            const appointmentDate = new Date(appt.date);
            const now = new Date();

            let status = appt.status || "Scheduled";

            return (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginTop: "10px",
                  borderRadius: "5px",
                  backgroundColor: "white",
                }}
              >
                <p><b>Date:</b> {appointmentDate.toDateString()}</p>
                <p><b>Doctor:</b> {appt.doctor}</p>
                <p><b>Status:</b> {status}</p>

                {appointmentDate > now && status !== "Cancelled" && (
                  <button
                    onClick={async () => {
                      const res = await fetch(
                        `https://hospital-backend-kdn2.onrender.com/api/patients/${patient.patientId}/appointment/${index}`,
                        {
                          method: "PUT",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "Cancelled" }),
                        }
                      );

                      const updated = await res.json();
                      setPatient(updated);
                    }}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "6px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            );
          })}

          {/* ✅ DOWNLOAD BUTTONS */}
          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <button
              onClick={() =>
                window.open(
                  `https://hospital-backend-kdn2.onrender.com/api/patients/${patient.patientId}/download`,
                  "_blank"
                )
              }
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Download Full Report
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://hospital-backend-kdn2.onrender.com/api/patients/${patient.patientId}/receipt`,
                  "_blank"
                )
              }
              style={{
                backgroundColor: "#0A2E5C",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

