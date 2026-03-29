function DoctorCard({ doctor }) {
  console.log(doctor);
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "8px",
      width: "250px"
    }}>
      <h3>{doctor.name}</h3>
      <div className="designation-badge">
  {doctor.designation}
</div>
      <p>Specialization: {doctor.specialization}</p>
      <p>Experience: {doctor.experience}</p>
      <button style={{
        backgroundColor: "#0077B6",
        color: "white",
        padding: "8px",
        border: "none",
        borderRadius: "5px"
      }}>
        View Profile
      </button>
    </div>
  );
}

export default DoctorCard;