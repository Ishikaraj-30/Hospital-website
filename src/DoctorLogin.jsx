import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorLogin() {
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!doctorId || !password) {
      alert("Enter login details");
      return;
    }

    localStorage.setItem("doctorName", doctorId);

    navigate("/doctor-panel");
  };

  return (
    <div className="container">
      <h2>Doctor Login</h2>

      <div className="card">
        <input
          type="text"
          placeholder="Doctor ID / Name"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="button-primary"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default DoctorLogin;