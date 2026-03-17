import React from "react";
import { useData } from "../context/DataContext";
import StatCard from "../components/common/StatCard";
import BookingList from "../components/booking/BookingList";

const StudentDashboard = () => {
  const { spaces, bookings } = useData();

  const myBookings = bookings.filter(
    (booking) => booking.requestedRole === "student" || booking.requestedRole === "coordinator"
  );
  const activeRequests = myBookings.filter((booking) => booking.status === "Pending").length;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div className="card-grid">
        <StatCard title="Total Requests" value={myBookings.length} icon="bookings" tone="teal" />
        <StatCard title="Spaces Available" value={spaces.length} icon="spaces" tone="blue" />
        <StatCard title="Active Requests" value={activeRequests} icon="pending" tone="amber" />
      </div>
      <BookingList bookings={myBookings} spaces={spaces} />
    </div>
  );
};

export default StudentDashboard;
