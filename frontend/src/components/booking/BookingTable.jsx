import React from "react";
import StatusBadge from "../common/StatusBadge";

const BookingTable = () => {
  const bookings = [
    { id: 1, space: "Lab 101", date: "2026-02-15", status: "Pending" },
    { id: 2, space: "Seminar Hall 2", date: "2026-02-17", status: "Approved" },
    { id: 3, space: "Classroom C1", date: "2026-02-18", status: "Rejected" },
  ];

  return (
    <div className="card">
      <h3>Recent Booking Requests</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Space</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.space}</td>
              <td>{booking.date}</td>
              <td>
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
