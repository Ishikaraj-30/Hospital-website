import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const navigate = useNavigate();
  // 📊 Count Patients by Department
const departmentCount = {};

patients.forEach((patient) => {
  const dept = patient.department || "Unknown";
  departmentCount[dept] = (departmentCount[dept] || 0) + 1;
});

const chartData = {
  labels: Object.keys(departmentCount),
  datasets: [
    {
      label: "Patients by Department",
      data: Object.values(departmentCount),
      backgroundColor: "#0077B6",
    },
  ],
};
// 📊 Count Appointment Status
const statusCount = {};

patients.forEach((patient) => {
  patient.appointments.forEach((appt) => {
    const status = appt.status || "Unknown";
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
});

const statusChartData = {
  labels: Object.keys(statusCount),
  datasets: [
    {
      data: Object.values(statusCount),
      backgroundColor: [
        "#2ECC71",  // Completed - green
        "#E74C3C",  // Cancelled - red
        "#0077B6",  // Scheduled - blue
        "#F1C40F",  // Missed - yellow
        "#95A5A6",  // Unknown - grey
      ],
    },
  ],
};

// 📈 Monthly Appointment Trend
const monthlyCount = {};

patients.forEach((patient) => {
  patient.appointments.forEach((appt) => {
    const month = new Date(appt.date).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });

    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });
});

const sortedMonths = Object.keys(monthlyCount);

const lineChartData = {
  labels: sortedMonths,
  datasets: [
    {
      label: "Appointments per Month",
      data: sortedMonths.map((m) => monthlyCount[m]),
      borderColor: "#0A2E5C",
      backgroundColor: "#0077B6",
      tension: 0.3,
    },
  ],
};

// 💰 Revenue Analytics
const consultationFee = 500;
const gstRate = 0.18;

let completedAppointments = 0;

patients.forEach((patient) => {
  patient.appointments.forEach((appt) => {
    if (appt.status === "Completed") {
      completedAppointments++;
    }
  });
});

const subtotal = completedAppointments * consultationFee;
const gstAmount = subtotal * gstRate;
const totalRevenue = subtotal + gstAmount;

// 🔮 Prediction Model (Average Monthly Forecast)

const monthlyAppointments = {};

patients.forEach((patient) => {
  patient.appointments.forEach((appt) => {
    const month = new Date(appt.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    monthlyAppointments[month] =
      (monthlyAppointments[month] || 0) + 1;
  });
});

const monthValues = Object.values(monthlyAppointments);

let predictedNextMonth = 0;

if (monthValues.length > 0) {
  const total = monthValues.reduce((a, b) => a + b, 0);
  predictedNextMonth = total / monthValues.length;
}

  // 🔐 Check Token
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

  // 📦 Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
      const response = await fetch(
  "http://localhost:5000/api/patients",
  {
    credentials: "include"
  }
);

        if (!response.ok) {
          setPatients([]);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.log(error);
        setPatients([]);
      }
    };

    fetchPatients();
  }, []);

  // 🗑 Delete Patient
  const handleDelete = async (id) => {
   await fetch(`http://localhost:5000/api/patients/${id}`, {
  method: "DELETE",
  credentials: "include"
}); 
    setPatients(patients.filter((p) => p.patientId !== id));
  };

  // ✏ Edit
  const handleEdit = (patient) => {
    setEditingId(patient.patientId);
    setEditName(patient.name);
    setEditPhone(patient.phone);
  };

  // 💾 Update
  const handleUpdate = async (id) => {
    const response = await fetch(
      `http://localhost:5000/api/patients/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
        }),
      }
    );

    const updatedPatient = await response.json();

    setPatients(
      patients.map((p) =>
        p.patientId === id ? updatedPatient : p
      )
    );

    setEditingId(null);
  };

  return (

    <div className="container">
      <h2>Admin Dashboard</h2>

    <button
  className="button-primary"
  style={{ marginBottom: "20px" }}
  onClick={async () => {
    try {
      await fetch("http://localhost:5000/api/admin/logout", {
        method: "POST",
        credentials: "include" // 🔥 VERY IMPORTANT
      });

      window.location.href = "/login"; // redirect after logout
    } catch (err) {
      console.log("Logout error:", err);
    }
  }}
>
  Logout
</button>
      <button
  onClick={() =>
    window.open(
      "http://localhost:5000/api/admin/analytics/download",
      "_blank"
    )
  }
  className="button-primary"
  style={{ marginBottom: "20px", marginLeft: "10px" }}
>
  Download Analytics Report
</button>
<button
  onClick={() => navigate("/admission")}
  className="button-primary"
  style={{ marginBottom: "20px", marginLeft: "10px" }}
>
  Admission Management
</button>

<button
  onClick={() => navigate("/cathlab")}
  className="button-primary"
  style={{ marginLeft: "10px" }}
>
  Cath Lab
</button>

<button
  onClick={() => navigate("/ot")}
  className="button-primary"
  style={{ marginLeft: "10px" }}
>
  Operation Theater
</button>

<button
  onClick={() => navigate("/pharmacy")}
  className="button-primary"
  style={{ marginLeft: "10px" }}
>
  Pharmacy
</button>

      <p><b>Total Patients:</b> {patients.length}</p>
      {/* 📊 Analytics Section */}
<h3 style={{ marginTop: "40px" }}>Patients by Department</h3>

<div style={{ maxWidth: "600px", margin: "20px auto" }}>
  <Bar data={chartData} />
</div>
{/* 📊 Appointment Status Distribution */}
<h3 style={{ marginTop: "50px" }}>
  Appointment Status Distribution
</h3>

<div style={{ maxWidth: "500px", margin: "20px auto" }}>
  <Pie data={statusChartData} />
</div>

{/* 📈 Monthly Appointment Trend */}
<h3 style={{ marginTop: "60px" }}>
  Monthly Appointment Trend
</h3>

<div style={{ maxWidth: "700px", margin: "30px auto" }}>
  <Line data={lineChartData} />
</div>

{/* 💰 Revenue Analytics */}
<h3 style={{ marginTop: "60px" }}>Revenue Overview</h3>

<div
  style={{
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
    flexWrap: "wrap",
  }}
>
  <div className="card" style={{ minWidth: "200px" }}>
    <h4>Completed Appointments</h4>
    <p>{completedAppointments}</p>
  </div>

  <div className="card" style={{ minWidth: "200px" }}>
    <h4>Subtotal</h4>
    <p>₹ {subtotal}</p>
  </div>

  <div className="card" style={{ minWidth: "200px" }}>
    <h4>GST (18%)</h4>
    <p>₹ {gstAmount.toFixed(2)}</p>
  </div>

  <div className="card" style={{ minWidth: "200px" }}>
    <h4>Total Revenue</h4>
    <p><b>₹ {totalRevenue.toFixed(2)}</b></p>
  </div>
</div>

{/* 🔮 Prediction Section */}
<h3 style={{ marginTop: "60px" }}>
  Next Month Forecast
</h3>

<div
  className="card"
  style={{
    textAlign: "center",
    maxWidth: "400px",
    margin: "20px auto",
    background: "#E6F4F9",
  }}
>
  <h4>Predicted Appointments</h4>
  <h2 style={{ color: "#0077B6" }}>
    {Math.round(predictedNextMonth)}
  </h2>
  <p>Based on historical monthly average</p>
</div>

      {Array.isArray(patients) &&
        patients.map((patient) => (
          <div key={patient._id} className="card">
            <p><b>ID:</b> {patient.patientId}</p>

            {editingId === patient.patientId ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />

                <button
                  onClick={() => handleUpdate(patient.patientId)}
                  className="button-primary"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p><b>Name:</b> {patient.name}</p>
                <p><b>Phone:</b> {patient.phone}</p>

                <button
                  onClick={() => handleEdit(patient)}
                  className="button-secondary"
                >
                  Edit
                </button>
              </>
            )}

            <p><b>Total Appointments:</b> {patient.appointments.length}</p>
             {/* 🔥 APPOINTMENT HISTORY SECTION */}
{patient.appointments.map((appt, index) => {
  const isPast = new Date(appt.date) < new Date();

  return (
    <div
      key={index}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "5px"
      }}
    >
      <p><b>Date:</b> {new Date(appt.date).toDateString()}</p>
      <p><b>Doctor:</b> {appt.doctor}</p>
      <p><b>Status:</b> {appt.status}</p>
      <p><b>Result:</b> {appt.result}</p>

      {/* Only allow editing if appointment is in the past */}
      {isPast && (
        <>
          <input
            type="text"
            placeholder="Enter Result"
            value={appt.result || ""}
            onChange={(e) => {
              const updatedPatients = [...patients];
              updatedPatients
                .find(p => p.patientId === patient.patientId)
                .appointments[index].result = e.target.value;
              setPatients(updatedPatients);
            }}
            style={{ marginTop: "5px", padding: "5px" }}
          />

          <textarea
  placeholder="Diagnosis"
  value={appt.diagnosis || ""}
  onChange={(e) => {
    const updatedPatients = [...patients];
    updatedPatients
      .find(p => p.patientId === patient.patientId)
      .appointments[index].diagnosis = e.target.value;
    setPatients(updatedPatients);
  }}
/>

<textarea
  placeholder="Prescription"
  value={appt.prescription || ""}
  onChange={(e) => {
    const updatedPatients = [...patients];
    updatedPatients
      .find(p => p.patientId === patient.patientId)
      .appointments[index].prescription = e.target.value;
    setPatients(updatedPatients);
  }}
/>

<input
  type="text"
  placeholder="Follow-up Advice"
  value={appt.followUp || ""}
  onChange={(e) => {
    const updatedPatients = [...patients];
    updatedPatients
      .find(p => p.patientId === patient.patientId)
      .appointments[index].followUp = e.target.value;
    setPatients(updatedPatients);
  }}
/>

          <button
            onClick={async () => {
              await fetch(
                `http://localhost:5000/api/patients/${patient.patientId}/appointment/${index}`,
                {
                  method: "PUT",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    result: appt.result,
                     diagnosis: appt.diagnosis,
                      prescription: appt.prescription,
                       followUp: appt.followUp,
                    status: "Completed",
                  }),
                }
              );

              alert("Result Updated");
            }}
            style={{
              marginTop: "5px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "5px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Update Result
             </button>
        </>
      )}
    </div>
  );
})}
            <button
              onClick={() => handleDelete(patient.patientId)}
              className="button-danger"
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default Admin;