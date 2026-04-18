import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Jaydev Hospital</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/appointment">Appointment</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/diagnostics">Diagnostics</Link>
        <Link to="/admin">Admin</Link>
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