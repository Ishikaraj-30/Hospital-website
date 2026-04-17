import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Pharmacy() {
  const [patientId, setPatientId] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${patientId}/pharmacy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            medicineName,
            quantity,
            price
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Medicine dispensed successfully");

    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Pharmacy</h2>

      <div className="card">
        <input placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />

        <input placeholder="Medicine Name" value={medicineName} onChange={e => setMedicineName(e.target.value)} />

        <input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />

        <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />

        <button className="button-primary" onClick={handleSubmit}>
          Dispense Medicine
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Pharmacy;