import React from "react";

const StudentCoordinatorDashboard = () => {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Student Coordinator Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Club Requests</h4>
          <p>7</p>
        </div>
        <div className="card">
          <h4>Upcoming Sessions</h4>
          <p>4</p>
        </div>
        <div className="card">
          <h4>Spaces Reserved</h4>
          <p>2</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCoordinatorDashboard;
