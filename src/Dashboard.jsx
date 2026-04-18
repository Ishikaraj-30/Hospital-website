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
  `http://localhost:5000/api/patients/${searchId}`,
  {
    method: "GET",
    credentials: "include",   // 🔥 VERY IMPORTANT
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
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

      {loading && <div classNmae="spinner"></div>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {patient && (
        <div
          style={{
            marginTop: "20px",
            background: "#E6F4F9",
            padding: "15px",
            borderRadius: "6px"
          }}
        >
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Phone:</b> {patient.phone}</p>

          <p><b>Appointments:</b></p>

          {patient.appointments && patient.appointments.length === 0 && (
            <p>No appointments found.</p>
          )}

          {patient.appointments &&
            patient.appointments.map((appt, index) => {
              const appointmentDate = new Date(appt.date);
              const now = new Date();

              let status = appt.status;
              let resultText = appt.result || "";

              if (!status) {
                const diffDays =
                  (now - appointmentDate) / (1000 * 60 * 60 * 24);

                if (appointmentDate > now) {
                  status = "Scheduled";
                  resultText = "Pending";
                } else if (diffDays > 7) {
                  status = "Missed";
                  resultText = "No consultation done";
                } else {
                  status = "Awaiting Update";
                  resultText = "Doctor has not updated result yet";
                }
              }

              if (status === "Cancelled") {
                resultText = "Appointment was cancelled";
              }

              if (status === "Completed") {
                resultText = appt.result || "Consultation completed";
              }

              {appt.diagnosis && (
  <p><b>Diagnosis:</b> {appt.diagnosis}</p>
)}

{appt.prescription && (
  <p><b>Prescription:</b> {appt.prescription}</p>
)}

{appt.followUp && (
  <p><b>Follow-up:</b> {appt.followUp}</p>
)}

              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "5px",
                    backgroundColor: "white"
                  }}
                >
                  <p><b>Date:</b> {appointmentDate.toDateString()}</p>
                  <p><b>Doctor:</b> {appt.doctor}</p>
                  <p><b>Designation:</b> {appt.designation}</p>
                  
                  <p><b>Result:</b> {resultText}</p>
                   <span className={`status-badge ${status.toLowerCase()}`}>
  {status}
</span>
                  {/* Cancel button only if future and not cancelled */}
                  {appointmentDate > now && status !== "Cancelled" && (
  <>
    {/* CANCEL */}
    <button
      onClick={async () => {
        const response = await fetch(
          `http://localhost:5000/api/patients/${patient.patientId}/appointment/${index}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Cancelled" }),
          }
        );

        const updatedPatient = await response.json();
        setPatient(updatedPatient);
      }}
      style={{
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "6px",
        marginRight: "10px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Cancel
    </button>

    {/* RESCHEDULE DATE PICKER */}
    <input
      type="date"
      onChange={(e) => (appt.newDate = e.target.value)}
      style={{ marginRight: "10px" }}
    />

    {/* RESCHEDULE BUTTON */}
    <button
      onClick={async () => {
        if (!appt.newDate) {
          alert("Select new date first");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/patients/${patient.patientId}/appointment/${index}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: appt.newDate,
              status: "Scheduled",
            }),
          }
        );

        const updatedPatient = await response.json();
        setPatient(updatedPatient);
      }}
      style={{
        backgroundColor: "orange",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Reschedule
    </button>
  </>
)}

<button
  onClick={() =>
    window.open(
      `http://localhost:5000/api/patients/${patient.patientId}/download`,
      "_blank"
    )
  }
  style={{
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px"
  }}
>
  Download Medical Report (PDF)
</button>

<button
  onClick={() =>
    window.open(
      `http://localhost:5000/api/patients/${patient.patientId}/receipt`,
      "_blank"
    )
  }
  style={{
    backgroundColor: "#0A2E5C",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px"
  }}
>
  Download Receipt
</button>
                    
                </div>
              );
            })}
            {patient.diagnostics && patient.diagnostics.length > 0 && (
  <>
    <h3 style={{ marginTop: "30px" }}>
      Diagnostic Tests
    </h3>

    {patient.diagnostics.map((test, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "5px",
          backgroundColor: "white"
        }}
      >
        <p><b>Test:</b> {test.testType}</p>
        <p>
          <b>Date:</b> {new Date(test.date).toDateString()}
        </p>
        <p>
          <b>Status:</b> {test.status}
        </p>
      </div>
    ))}
  </>
)}
{patient.admission?.isAdmitted && (
  <div
    style={{
      marginTop: "30px",
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "8px",
      backgroundColor: "white"
    }}
  >
    <h3>Admission Details</h3>

    <p>
      <b>Status:</b>{" "}
      <span style={{ color: "green", fontWeight: "bold" }}>
        {patient.admission.currentStatus}
      </span>
    </p>

    <p><b>Ward:</b> {patient.admission.wardType}</p>
    <p><b>Room:</b> {patient.admission.roomNumber}</p>
    <p><b>Bed:</b> {patient.admission.bedNumber}</p>
    <p><b>Reason:</b> {patient.admission.admissionReason}</p>

    <p>
      <b>Admission Date:</b>{" "}
      {patient.admission.admissionDate
        ? new Date(patient.admission.admissionDate).toDateString()
        : "-"}
    </p>

    <p>
      <b>Expected Discharge:</b>{" "}
      {patient.admission.expectedDischarge
        ? new Date(patient.admission.expectedDischarge).toDateString()
        : "-"}
    </p>
      {patient.admission.procedureType && (
  <>
    <p><b>Procedure:</b> {patient.admission.procedureType}</p>
    <p><b>Surgeon:</b> {patient.admission.surgeonName}</p>

    <p>
      <b>OT Date:</b>{" "}
      {patient.admission.otDate
        ? new Date(patient.admission.otDate).toDateString()
        : "-"}
    </p>

    <p>
      <b>Status:</b> {patient.admission.procedureStatus}
    </p>
  </>
)}
{patient.admission.cathLab && (
      <>
        <p><b>Diagnosis:</b> {patient.admission.cathLab.diagnosis}</p>

        <p>
          <b>Procedure Done:</b>{" "}
          {patient.admission.cathLab.procedurePerformed}
        </p>

        <p>
          <b>Implant:</b>{" "}
          {patient.admission.cathLab.implantDetails}
        </p>

        <p>
          <b>Post Location:</b>{" "}
          {patient.admission.cathLab.postProcedureLocation}
        </p>

        <p>
          <b>Emergency:</b>{" "}
          {patient.admission.cathLab.emergencyShift ? "Yes" : "No"}
        </p>
      </>
    )}
     {patient.admission.operationTheater && (
      <>
        <p><b>Surgery:</b> {patient.admission.operationTheater.surgeryType}</p>
        <p><b>Surgeon:</b> {patient.admission.operationTheater.surgeonName}</p>
        <p><b>Materials:</b> {patient.admission.operationTheater.materialsUsed}</p>
        <p><b>Notes:</b> {patient.admission.operationTheater.surgeryNotes}</p>
        <p><b>Post Monitoring:</b> {patient.admission.operationTheater.postOpMonitoring}</p>
        <p><b>Observations:</b> {patient.admission.operationTheater.observations}</p>
        <p><b>Final Ward:</b> {patient.admission.operationTheater.finalWard}</p>
      </>
    )}
    {patient.pharmacy && patient.pharmacy.length > 0 && (
  <>
    <h3 style={{ marginTop: "30px" }}>Pharmacy</h3>

    {patient.pharmacy.map((med, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "5px",
          backgroundColor: "white"
        }}
      >
        <p><b>Medicine:</b> {med.medicineName}</p>
        <p><b>Quantity:</b> {med.quantity}</p>
        <p><b>Price:</b> ₹{med.price}</p>
        <p><b>Total:</b> ₹{med.total}</p>
        <p><b>Status:</b> {med.status}</p>
      </div>
    ))}
  </>
)}
  </div>
)}
        </div>
      )}
    </div>
  );
}

export default Dashboard;