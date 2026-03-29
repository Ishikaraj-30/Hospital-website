function DepartmentCard({ dept }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "8px",
      width: "250px"
    }}>
      <h3>{dept.name}</h3>
      <p>{dept.desc}</p>
    </div>
  );
}

export default DepartmentCard;