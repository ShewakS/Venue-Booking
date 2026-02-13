import React from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import SpaceList from "../components/space/SpaceList";
import BookingForm from "../components/booking/BookingForm";
import BookingList from "../components/booking/BookingList";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { spaces, bookings, timetable, addBooking } = useData();

  const myBookings = bookings.filter((booking) => booking.requestedBy === user?.name);

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Student Coordinator Dashboard</h2>
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
      <SpaceList spaces={spaces} />
      <BookingForm spaces={spaces} bookings={bookings} timetable={timetable} onAddBooking={addBooking} />
      <BookingList bookings={myBookings} spaces={spaces} />
    </div>
  );
};

export default StudentDashboard;
