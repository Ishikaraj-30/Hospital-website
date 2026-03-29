import { useParams, useNavigate } from "react-router-dom";
import departments from "./data/departments";
import doctors from "./data/doctors";

function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dept = departments.find((d) => d.id.toString() === id);

  if (!dept)
    return <div className="container">Department Not Found</div>;

  const departmentDoctors = doctors.filter(
  (doc) =>
    doc.departmentId &&
    doc.departmentId.toString() === id
);

  return (
    <div className="container">

         <button onClick={() => navigate(-1)} className="back-button">
      ← Back to Departments
    </button>
    
      <div className="card">
        <h2>{dept.name}</h2>
        <p><b>About Department:</b></p>
        <p>{dept.details}</p>
      </div>

      <div className="card">
        <h3>Our Doctors</h3>

        {departmentDoctors.length === 0 ? (
          <p>No doctors available.</p>
        ) : (
          departmentDoctors.map((doc) => (
            <div key={doc.id} style={{ marginBottom: "15px" }}>
              <p><b>Name:</b> {doc.name}</p>
              <p><b>Specialization:</b> {doc.specialization}</p>
              <p><b>Experience:</b> {doc.experience}</p>
              <p>
  <span className="designation-badge">
    {doc.designation}
  </span>
</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DepartmentDetail;