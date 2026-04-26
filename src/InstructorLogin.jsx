import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InstructorLogin() {
  // ✅ STATE (THIS WAS MISSING)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NAVIGATION (THIS WAS MISSING)
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://hospital-backend-kdn2.onrender.com/api/instructor/login",
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
        // ✅ SAVE NAME
        localStorage.setItem("instructorName", data.instructor.name);

        alert(`Welcome ${data.instructor.name}`);

        navigate("/instructor-panel");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Instructor Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default InstructorLogin;