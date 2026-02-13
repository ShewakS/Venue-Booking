import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import BookingList from "../components/booking/BookingList";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { spaces, bookings, timetable } = useData();

  const myBookings = bookings.filter((booking) => booking.requestedBy === user?.name);

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Faculty Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Active Requests</h4>
          <p>{myBookings.length}</p>
        </div>
        <div className="card">
          <h4>Spaces Available</h4>
          <p>{spaces.length}</p>
        </div>
        <div className="card">
          <h4>Academic Blocks</h4>
          <p>{timetable.length}</p>
        </div>
      </div>

      <div className="card">
        <h3>Booking Requests</h3>
        <BookingList bookings={myBookings} spaces={spaces} />
      </div>
    </div>
  );
};

export default FacultyDashboard;
