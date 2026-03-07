import React from "react";
import { useData } from "../context/DataContext";
import BookingList from "../components/booking/BookingList";
import StatCard from "../components/common/StatCard";

const FacultyDashboard = () => {
  const { spaces, bookings, timetable } = useData();

  const myBookings = bookings.filter((booking) => booking.requestedRole === "faculty");

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div className="card-grid">
        <StatCard title="Active Requests" value={myBookings.length} icon="bookings" tone="teal" />
        <StatCard title="Spaces Available" value={spaces.length} icon="spaces" tone="blue" />
        <StatCard title="Academic Blocks" value={timetable.length} icon="academic" tone="violet" />
      </div>

      <BookingList bookings={myBookings} spaces={spaces} />
    </div>
  );
};

export default FacultyDashboard;
