import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import BookingList from "../components/booking/BookingList";
import Button from "../components/common/Button";
import CalendarView from "../components/calendar/CalendarView";

const AdminDashboard = () => {
  const {
    spaces,
    bookings,
    timetable,
    timetableOverrides,
    addSpace,
    updateSpace,
    deleteSpace,
    updateBookingStatus,
    setTimetableOverride,
  } = useData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", capacity: "" });

  const totals = useMemo(
    () => ({
      totalSpaces: spaces.length,
      totalBookings: bookings.length,
      pendingRequests: bookings.filter((booking) => booking.status === "Pending").length,
    }),
    [spaces, bookings]
  );

  const resetForm = () => {
    setForm({ name: "", type: "", capacity: "" });
    setEditingId(null);
  };

  const handleEdit = (space) => {
    setEditingId(space.id);
    setForm({
      name: space.name,
      type: space.type,
      capacity: String(space.capacity),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      id: editingId,
      name: form.name.trim(),
      type: form.type.trim(),
      capacity: Number(form.capacity),
      equipment: [],
    };

    if (!payload.name || !payload.type || !payload.capacity) {
      return;
    }

    if (editingId) {
      updateSpace(payload);
    } else {
      addSpace(payload);
    }
    resetForm();
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Event Organizer Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Total Spaces</h4>
          <p>{totals.totalSpaces}</p>
        </div>
        <div className="card">
          <h4>Total Requests</h4>
          <p>{totals.totalBookings}</p>
        </div>
        <div className="card">
          <h4>Pending Requests</h4>
          <p>{totals.pendingRequests}</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Add Space</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
            <label className="input-field" htmlFor="spaceName">
              <span>Space Name</span>
              <input
                id="spaceName"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="e.g., Lab 101"
              />
            </label>
            <label className="input-field" htmlFor="spaceType">
              <span>Space Type</span>
              <input
                id="spaceType"
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
                placeholder="e.g., Computer Lab"
              />
            </label>
            <label className="input-field" htmlFor="spaceCapacity">
              <span>Capacity</span>
              <input
                id="spaceCapacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => setForm({ ...form, capacity: event.target.value })}
              />
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <Button type="submit">Add Space</Button>
              {editingId ? (
                <Button className="secondary" type="button" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Manage Spaces</h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {spaces.length === 0 ? (
              <p style={{ color: "#5b6475", textAlign: "center" }}>No spaces yet</p>
            ) : (
              spaces.map((space) => (
                <div
                  key={space.id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #e5e9f2",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{space.name}</strong>
                    <div style={{ fontSize: "12px", color: "#5b6475" }}>
                      {space.type} • {space.capacity} capacity
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button onClick={() => handleEdit(space)} style={{ padding: "6px 10px", fontSize: "12px" }}>
                      Edit
                    </Button>
                    <Button
                      className="secondary"
                      onClick={() => deleteSpace(space.id)}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Booking Requests</h3>
        <BookingList bookings={bookings} spaces={spaces} onStatusChange={updateBookingStatus} showActions />
      </div>
    </div>
  );
};

export default AdminDashboard;
