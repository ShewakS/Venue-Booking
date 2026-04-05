import React from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/common/StatCard";
import BookingList from "../components/booking/BookingList";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { spaces, bookings } = useData();
  const roleBookings = bookings.filter((booking) => booking.requestedRole === user?.role);

  const activeRequests = roleBookings.filter((booking) => booking.status === "Pending").length;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div className="card-grid">
        <StatCard title="Total Requests" value={roleBookings.length} icon="bookings" tone="teal" />
        <StatCard title="Spaces Available" value={spaces.length} icon="spaces" tone="blue" />
        <StatCard title="Active Requests" value={activeRequests} icon="pending" tone="amber" />
      </div>
      <BookingList bookings={bookings} spaces={spaces} />
    </div>
  );
};

export default StudentDashboard;
