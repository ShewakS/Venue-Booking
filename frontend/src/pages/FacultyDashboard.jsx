import React from "react";

const FacultyDashboard = () => {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Faculty Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Your Bookings</h4>
          <p>5</p>
        </div>
        <div className="card">
          <h4>Approved Requests</h4>
          <p>3</p>
        </div>
        <div className="card">
          <h4>Spaces Available</h4>
          <p>19</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
