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
    console.log("Instructor login:", data);

    if (res.ok) {
      // ✅ SAVE NAME CORRECTLY
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