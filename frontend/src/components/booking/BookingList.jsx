import React from "react";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";

const BookingList = ({ bookings, spaces, onStatusChange, showActions = false }) => {
  const spaceLookup = new Map(spaces.map((space) => [space.id, space.name]));

  return (
    <div className="card">
      <h3>Booking Requests</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Space</th>
            <th>Date</th>
            <th>Time</th>
            <th>Participants</th>
            <th>Status</th>
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <strong>{booking.title}</strong>
                <div style={{ color: "#5b6475", fontSize: "12px" }}>{booking.requestedBy}</div>
              </td>
              <td>{spaceLookup.get(booking.spaceId) || "-"}</td>
              <td>{booking.date}</td>
              <td>
                {booking.start} - {booking.end}
              </td>
              <td>{booking.participants}</td>
              <td>
                <StatusBadge status={booking.status} />
              </td>
              {showActions ? (
                <td style={{ display: "flex", gap: "8px" }}>
                  <Button
                    onClick={() => onStatusChange(booking.id, "Approved")}
                    disabled={booking.status === "Approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    className="secondary"
                    onClick={() => onStatusChange(booking.id, "Rejected")}
                    disabled={booking.status === "Rejected"}
                  >
                    Reject
                  </Button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {bookings.length === 0 ? <p style={{ color: "#5b6475" }}>No booking requests yet.</p> : null}
    </div>
  );
};

export default BookingList;
