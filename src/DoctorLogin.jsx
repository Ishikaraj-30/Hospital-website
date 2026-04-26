import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(
      "https://hospital-backend-kdn2.onrender.com/api/doctor/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();

    if (res.ok) {
       localStorage.setItem("doctorName", data.doctor.name);
  localStorage.setItem("doctorRoom", data.doctor.roomNumber);

  // OPTIONAL DEBUG
  console.log("Logged in:", data.doctor);
    navigate("/doctor");  
    }
  };

  return (
    <div className="container">
      <h2>Doctor Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default DoctorLogin;