function About() {
  return (
    <div className="container">

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Sri Jayadeva Institute of Cardiovascular Sciences and Research
      </h1>

      <p style={{ textAlign: "center", marginBottom: "40px" }}>
        A premier cardiac care center providing advanced treatment,
        expert doctors, and world-class facilities.
      </p>

      {/* FACILITIES */}
      <h2 className="section-title">Facilities Available</h2>

      <div className="grid">
        {[
          "Ambulance Services",
          "24 Hours Emergency & ICU",
          "Color Doppler Echocardiography, TEE",
          "Stress ECG & Perfusion Scan",
          "Cardiac Catheterization (Angiogram, Angioplasty, Stenting)",
          "Pacemaker & Device Closure",
          "Electrophysiology (RF Ablation, EP Studies)",
          "Holter Monitoring & Head Tilt Test",
          "Open Heart Surgery",
          "Biochemistry, Pathology & Microbiology",
          "64 Slice Cardiac CT Scan",
          "MRI Facility"
        ].map((item, index) => (
          <div key={index} className="card">
            {item}
          </div>
        ))}
      </div>

      {/* SCHEMES */}
      <h2 className="section-title" style={{ marginTop: "40px" }}>
        Schemes Adopted
      </h2>

      <div className="card">
        <ul>
          <li>Yeshasvini</li>
          <li>Arogya Bhagya</li>
          <li>Health Insurance Schemes</li>
          <li>Suvarna Arogya Chaitanya Scheme (Children)</li>
        </ul>
      </div>

      {/* CREDIT FACILITY */}
      <h2 className="section-title" style={{ marginTop: "40px" }}>
        Credit Facilities
      </h2>

      <div className="card">
        <ul>
          <li>Government Servants</li>
          <li>CGHS, ESI</li>
          <li>KSRTC, BMTC, BBMP</li>
          <li>ISRO, BDA, BWSSB</li>
          <li>KPTCL, KSDL</li>
          <li>Mysore Minerals Ltd</li>
          <li>Hutti Gold Mines</li>
          <li>Health Insurance Card Holders</li>
        </ul>
      </div>

    </div>
  );
}

export default About;