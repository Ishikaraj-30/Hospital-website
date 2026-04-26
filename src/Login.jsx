import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "https://hospital-backend-kdn2.onrender.com/api/admin/login",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    navigate("/admin");
  } else {
    alert(data.message);
  }
  // 🟢 SURGEON LOGIN
if (role === "surgeon") {
  const response = await fetch(
    "https://hospital-backend-kdn2.onrender.com/api/surgeon/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("doctorName", data.surgeon.name);
    navigate("/surgery");
  } else {
    alert(data.message);
  }
}
};

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
        />

        <button
        
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#0077B6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;