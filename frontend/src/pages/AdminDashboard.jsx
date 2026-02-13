import React from "react";

const AdminDashboard = () => {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Admin Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Total Spaces</h4>
          <p>48</p>
        </div>
        <div className="card">
          <h4>Pending Approvals</h4>
          <p>12</p>
        </div>
        <div className="card">
          <h4>Upcoming Events</h4>
          <p>8</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
