import React from "react";
import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";

const BookingList = ({
  bookings,
  spaces,
  onStatusChange,
  showActions = false,
  showRequesterPhone = false,
}) => {
  const spaceLookup = new Map(spaces.map((space) => [space.id, space.name]));

  return (
    <div className="card">
      <h3>Booking Requests</h3>
      <div className="booking-desktop-table table-wrap">
        <table className="table booking-table">
          <colgroup>
            <col className="col-event" />
            <col className="col-space" />
            <col className="col-date" />
            <col className="col-time" />
            <col className="col-participants" />
            <col className="col-organizer" />
            {showRequesterPhone ? <col className="col-phone" /> : null}
            <col className="col-status" />
            {showActions ? <col className="col-actions" /> : null}
          </colgroup>
          <thead>
            <tr>
              <th>Event</th>
              <th>Space</th>
              <th>Date</th>
              <th>Time</th>
              <th>Participants</th>
              <th>Organized By</th>
              {showRequesterPhone ? <th>Mobile Number</th> : null}
              <th>Status</th>
              {showActions ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              // Status decision is final: once not Pending, disable both action buttons.
              // This prevents toggling Approved <-> Rejected from the UI.
              <tr key={booking.id}>
                <td>
                  <strong className="booking-title">{booking.title}</strong>
                  <div className="booking-subtitle">{booking.requestedBy}</div>
                </td>
                <td>{spaceLookup.get(booking.spaceId) || "-"}</td>
                <td>{booking.date}</td>
                <td>
                  {booking.start} - {booking.end}
                </td>
                <td>{booking.participants}</td>
                <td>{booking.organizedBy || "-"}</td>
                {showRequesterPhone ? <td>{booking.requestedPhone || "-"}</td> : null}
                <td>
                  <StatusBadge status={booking.status} />
                </td>
                {showActions ? (
                  <td className="actions-cell">
                    <Button
                      onClick={() => onStatusChange(booking.id, "Approved")}
                      disabled={booking.status !== "Pending"}
                    >
                      Approve
                    </Button>
                    <Button
                      className="secondary"
                      onClick={() => onStatusChange(booking.id, "Rejected")}
                      disabled={booking.status !== "Pending"}
                    >
                      Reject
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="booking-mobile-list">
        {bookings.map((booking) => (
          <article key={booking.id} className="booking-mobile-item">
            <div className="booking-mobile-head">
              <div>
                <strong className="booking-title">{booking.title}</strong>
                <div className="booking-subtitle">{booking.requestedBy}</div>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <div className="booking-mobile-grid">
              <p><span>Space</span>{spaceLookup.get(booking.spaceId) || "-"}</p>
              <p><span>Date</span>{booking.date}</p>
              <p><span>Time</span>{booking.start} - {booking.end}</p>
              <p><span>Participants</span>{booking.participants}</p>
              <p><span>Organized By</span>{booking.organizedBy || "-"}</p>
              {showRequesterPhone ? <p><span>Mobile Number</span>{booking.requestedPhone || "-"}</p> : null}
            </div>
            {showActions ? (
              <div className="booking-mobile-actions">
                <Button
                  onClick={() => onStatusChange(booking.id, "Approved")}
                  disabled={booking.status !== "Pending"}
                >
                  Approve
                </Button>
                <Button
                  className="secondary"
                  onClick={() => onStatusChange(booking.id, "Rejected")}
                  disabled={booking.status !== "Pending"}
                >
                  Reject
                </Button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
      {bookings.length === 0 ? <p style={{ color: "#5b6475" }}>No booking requests yet.</p> : null}
    </div>
  );
};

export default BookingList;
