import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Jaydev Hospital</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/appointment">Appointment</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/admin">Admin</Link>
      </div>

      <a
        href="http://localhost:5000/api/patients/doctors/download"
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