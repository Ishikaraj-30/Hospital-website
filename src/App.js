import { useEffect,useState,useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import About from "./About";
import doctors from "./data/doctors";
import DoctorCard from "./components/DoctorCard";
import Navbar from "./components/Navbar";
import Dashboard from "./Dashboard";
import AppointmentInfo from "./AppointmentInfo";
import Admin from "./Admin";
import Login from "./Login";
import departments from "./data/departments";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DepartmentDetail from "./DepartmentDetail";
import logo from "./assets/logo.png";
import Diagnostics from "./Diagnostics";
import Pharmacy from "./Pharmacy";
import Admission from "./Admission";
import CathLab from "./CathLab";
import OperationTheater from "./OperationTheater";
import DoctorLogin from "./DoctorLogin";
import DoctorDashboard from "./DoctorDashboard";
import DoctorPanel from "./DoctorPanel";
/* ================= HOME ================= */

function Home() {

const navigate = useNavigate();
const statsRef = useRef(null);
const [startCount, setStartCount] = useState(false);
const [doctorCount, setDoctorCount] = useState(0);
const [bedCount, setBedCount] = useState(0);
const [patientCount, setPatientCount] = useState(0);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setStartCount(true);
      }
    },
    { threshold: 0.5 }
  );

  if (statsRef.current) {
    observer.observe(statsRef.current);
  }

  return () => observer.disconnect();
}, []);

const animateValue = (setter, end, duration) => {
  let start = 0;
  const increment = end / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= end) {
      setter(end);
      clearInterval(timer);
    } else {
      setter(Math.floor(start));
    }
  }, 16);
};

useEffect(() => {
  if (startCount) {
    animateValue(setDoctorCount, 50, 1000);
    animateValue(setBedCount, 200, 1000);
    animateValue(setPatientCount, 10000, 1500);
  }
}, [startCount]);
  
  return (
    <>
      <div className="hero">
  <div className="hero-content">
    <img src={logo} alt="Sri Jayadeva Institute of Cardiovascular Sciences and Research Logo" className="hero-logo" />

    <h1>Sri Jayadeva Institute of Cardiovascular Sciences and Research</h1>
    <p className="hero-tagline">
  Leading Cardiac Care Institute with Advanced Treatment & Expert Doctors
</p>

    <Link to="/appointment">
      <button className="button-primary hero-btn">
        Book Appointment
      </button>
    </Link>
  </div>
</div>

<div className="services-section">
  <h2 className="section-title">Our Services</h2>
  <p className="services-subtitle">
    Comprehensive cardiac care with advanced technology and expert specialists
  </p>

  <div className="services-grid">

    {[
      { icon: "🚑", title: "24/7 Emergency", desc: "Immediate care with ICU & ambulance support" },
      { icon: "🫀", title: "Cardiac Care", desc: "Angioplasty, bypass surgery & heart treatments" },
      { icon: "🧪", title: "Diagnostics", desc: "MRI, CT Scan, ECG & lab services" },
      { icon: "👨‍⚕️", title: "Expert Doctors", desc: "Highly experienced cardiologists" },
      { icon: "💊", title: "Pharmacy", desc: "24/7 in-house medicine availability" },
      { icon: "🏥", title: "Inpatient Care", desc: "Advanced wards & monitoring systems" },
    ].map((service, i) => (
      <div className="service-card" key={i}>
        <div className="service-icon">{service.icon}</div>
        <h3>{service.title}</h3>
        <p>{service.desc}</p>
        <span className="service-hover-line"></span>
      </div>
    ))}

  </div>
</div>
      <div className="about-preview">
  <div className="about-content">

    {/* LEFT TEXT */}
    <div className="about-text">
      <h2>Sri Jayadeva Institute of Cardiovascular Sciences and Research</h2>

      <p>
        A premier cardiac care hospital known for advanced treatment,
        expert cardiologists, and state-of-the-art medical facilities.
        Trusted by thousands of patients across India.
      </p>

      <ul>
        <li>✔ 24/7 Emergency & ICU</li>
        <li>✔ Advanced Cardiac Procedures</li>
        <li>✔ Modern Diagnostics (CT, MRI)</li>
        <li>✔ Experienced Specialists</li>
      </ul>

      <Link to="/about">
        <button className="button-primary">
          Explore More →
        </button>
      </Link>
    </div>

    {/* RIGHT IMAGE */}
    <div className="about-image">
      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        alt="Hospital"
      />
    </div>

  </div>
</div>
       <div className="stats" ref={statsRef}>
        <h2 className="section-title">Our Achievements</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{doctorCount}+</div>
            <div className="stat-label">Expert Doctors</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{bedCount}+</div>
            <div className="stat-label">Hospital Beds</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{departments.length}+</div>
            <div className="stat-label">Departments</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">{patientCount}+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          </div>
          </div>
          {/* 👇 ADD DEPARTMENTS HERE */}
<div className="container">
  <h2 className="section-title">Our Departments</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    }}
  >    
  {departments.map((dept) => (
  <div
    key={dept.id}
    className="card"
    style={{ cursor: "pointer" }}
    onClick={() => navigate(`/department/${dept.id}`)}
  >
    
        <h3>{dept.name}</h3>
        <p>{dept.description}</p>
      </div>
    ))}
        </div>
      </div>

{/* TESTIMONIALS */}
<div className="testimonials">
  <h2 className="section-title">What Our Patients Say</h2>

  <div className="testimonial-grid">
    <div className="testimonial-card">
      <p className="testimonial-text">
        "The doctors at Sri Jayadeva Institute of Cardiovascular Sciences and Research saved my life. The care and support were outstanding."
      </p>
      <div className="testimonial-name">— Ramesh Kumar</div>
    </div>

    <div className="testimonial-card">
      <p className="testimonial-text">
        "Very clean hospital and friendly staff. Highly recommend for quality treatment."
      </p>
      <div className="testimonial-name">— Priya Sharma</div>
    </div>

    <div className="testimonial-card">
      <p className="testimonial-text">
        "Professional service and quick emergency response. Truly impressed!"
      </p>
      <div className="testimonial-name">— Arjun Mehta</div>
    </div>
  </div>
</div>
<div className="journey-section">
  <h2 className="section-title">Patient Journey</h2>

  <div className="journey-grid">
    <div className="journey-card">Help Desk Assistance</div>
    <div className="journey-card">Appointment Booking</div>
    <div className="journey-card">OPD Registration</div>
    <div className="journey-card">Doctor Consultation</div>
    <div className="journey-card">Medical Report & Receipt</div>
  </div>
</div>
      </>

      
  );
}

/* ================= DOCTORS ================= */

function Doctors() {
  return (
    <div className="container">
      <h2 className="section-title">Our Doctors</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc}/>
        ))}
      </div>
    </div>
  );
}

/* ================= APPOINTMENT ================= */
function Appointment() {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [patientId, setPatientId] = useState(null);
  const [slotMessage, setSlotMessage] = useState("");
  const [slotData, setSlotData] = useState({});
  const [phoneError, setPhoneError] = useState("");
  const [showWaitingOption, setShowWaitingOption] = useState(false);
  const [tokenNumber, setTokenNumber] = useState("");
const [roomNumber, setRoomNumber] = useState("");
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00"
  ];

  // 🔄 Fetch slot availability when doctor or date changes
  useEffect(() => {
    if (doctor && date) {
      fetch(
        `https://hospital-backend-kdn2.onrender.com/api/patients/slots?doctor=${doctor}&date=${date}`
      )
        .then((res) => res.json())
        .then((data) => setSlotData(data))
        .catch((err) => console.log(err));
    }
  }, [doctor, date]);

  const handleSubmit = async (e, joinWaiting = false) => {
  if (e) e.preventDefault();

  try {
    const response = await fetch(
      "https://hospital-backend-kdn2.onrender.com/api/patients/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          department,
          doctor,
          appointmentDate: date,
          time,
          doctor,
          joinWaiting
        }),
      }
    );

    const data = await response.json();
    setDoctor(data.doctor);
setRoomNumber(data.roomNumber);

    if (!response.ok) {
      if (data.askWaiting) {
        setShowWaitingOption(true);
        return;
      }

      setSlotMessage(data.message);
      return;
    }

    setPatientId(data.patientId);
    setTokenNumber(data.tokenNumber);

    if (data.status === "Waiting") {
      setSlotMessage("You have been added to Waiting List.");
    } else {
      setSlotMessage("Appointment Confirmed.");
    }

    setShowWaitingOption(false);

  } catch (error) {
    console.error(error);
    setSlotMessage("Server error.");
  }
};

  return (
    <div className="container">
      <h2 className="section-title">Book Appointment</h2>

      <div className="card">

        <form onSubmit={handleSubmit}>

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Doctor */}
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Select Doctor</option>

            {doctors
              .filter(
                (doc) =>
                  doc.departmentId ===
                  departments.find((d) => d.name === department)?.id
              )
              .map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.designation})
                </option>
              ))}
          </select>

          {/* Time */}
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">Select Time Slot</option>

            {timeSlots.map((slot) => {
              const slotInfo = slotData[slot];

              const isFull =
                slotInfo &&
                slotInfo.regularLeft <= 0 &&
                slotInfo.waitingLeft <= 0;

              return (
                <option
                  key={slot}
                  value={slot}
                  disabled={isFull}
                >
                  {slot}
                  {slotInfo
                    ? ` (Regular: ${slotInfo.regularLeft}, Waiting: ${slotInfo.waitingLeft})`
                    : ""}
                </option>
              );
            })}
          </select>

          {/* Slot Visual */}
          {time && slotData[time] && (
            <div style={{ marginTop: "10px" }}>
              <p>🟢 Regular Left: {slotData[time].regularLeft}</p>
              <p>🟡 Waiting Left: {slotData[time].waitingLeft}</p>
            </div>
          )}

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) return;
              setPhone(value);
            }}
            maxLength={10}
            required
          />

          {phoneError && (
            <p style={{ color: "red" }}>{phoneError}</p>
          )}

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button type="submit" className="button-primary">
            Submit Appointment
          </button>
        </form>

        {showWaitingOption && (
  <div style={{ marginTop: "15px" }}>
    <p>Regular slot is full. Do you want to join waiting list (5–6 PM)?</p>

    <button
    type="button"
      onClick={() => handleSubmit(null, true)}
      style={{ marginRight: "10px" }}
      className="button-secondary"
    >
      Yes, Join Waiting
    </button>

    <button
      type="button"
      onClick={() => setShowWaitingOption(false)}
      className="button-danger"
    >
      No, Choose Another Time
    </button>
  </div>
)}

        {/* Confirmation Section */}
   {patientId && (
  <p style={{ marginTop: "15px" }}>
    <b>Your Patient ID:</b> {patientId}
  </p>
)}

{tokenNumber && (
  <p style={{ marginTop: "10px" }}>
    <b>Your Token Number:</b> {tokenNumber}
  </p>
)}

{doctor && (
  <p>
    <b>Doctor:</b> {doctor}
  </p>
)}

{roomNumber && (
  <p>
    <b>Room Number:</b> {roomNumber}
  </p>
)}

{slotMessage && (
  <p style={{ marginTop: "10px", color: "#0077B6" }}>
    {slotMessage}
  </p>
)}

      </div>
    </div>
  );
}

/* ================= MAIN APP ================= */

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment-info" element={<AppointmentInfo />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/department/:id" element={<DepartmentDetail />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/cathlab" element={<CathLab />} />
        <Route path="/ot" element={<OperationTheater />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor" element={<DoctorPanel />} />
      </Routes>
      <footer className="footer">
       © 2026 Sri Jayadeva Institute ERP System
      </footer>
    </Router>
  );
}

export default App;