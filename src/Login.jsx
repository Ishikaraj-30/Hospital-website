import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (role === "admin") {
      try {
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
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    } else if (role === "surgeon") {
      try {
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
          localStorage.setItem("role", "surgeon");
          navigate("/surgery");
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
      >
        <option value="admin">Admin</option>
        <option value="surgeon">Surgeon</option>
      </select>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder={role === "admin" ? "Username" : "Email"}
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