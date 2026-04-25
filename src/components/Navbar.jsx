import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Sri Jayadeva Institute</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/appointment">Appointment</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/diagnostics">Diagnostics</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/doctor-login">Doctor</Link>
        <Link to="/instructor-login">Instructor</Link>
      </div>

      <a href="https://hospital-backend-kdn2.onrender.com/api/patients/doctors/download"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="button-primary">
          Download Doctors Directory
        </button>
      </a>
    </nav>
  );
}

export default Navbar;