import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import BookingList from "../components/booking/BookingList";
import Button from "../components/common/Button";

const AdminDashboard = () => {
  const { spaces, bookings, timetable, addSpace, updateSpace, deleteSpace, updateBookingStatus } = useData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", capacity: "", equipment: "" });

  const totals = useMemo(
    () => ({
      totalSpaces: spaces.length,
      totalBookings: bookings.length,
      pendingRequests: bookings.filter((booking) => booking.status === "Pending").length,
    }),
    [spaces, bookings]
  );

  const resetForm = () => {
    setForm({ name: "", type: "", capacity: "", equipment: "" });
    setEditingId(null);
  };

  const handleEdit = (space) => {
    setEditingId(space.id);
    setForm({
      name: space.name,
      type: space.type,
      capacity: String(space.capacity),
      equipment: space.equipment.join(", "),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      id: editingId,
      name: form.name.trim(),
      type: form.type.trim(),
      capacity: Number(form.capacity),
      equipment: form.equipment
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
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
      <h2>Admin Dashboard</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Total Spaces</h4>
          <p>{totals.totalSpaces}</p>
        </div>
        <div className="card">
          <h4>Total Bookings</h4>
          <p>{totals.totalBookings}</p>
        </div>
        <div className="card">
          <h4>Pending Requests</h4>
          <p>{totals.pendingRequests}</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Space" : "Add New Space"}</h3>
        <div className="form-grid">
          <label className="input-field" htmlFor="spaceName">
            <span>Space Name</span>
            <input id="spaceName" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="input-field" htmlFor="spaceType">
            <span>Space Type</span>
            <input id="spaceType" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} />
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
          <label className="input-field" htmlFor="spaceEquipment">
            <span>Equipment (comma separated)</span>
            <input
              id="spaceEquipment"
              value={form.equipment}
              onChange={(event) => setForm({ ...form, equipment: event.target.value })}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <Button type="submit">{editingId ? "Update Space" : "Add Space"}</Button>
          {editingId ? (
            <Button className="secondary" type="button" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="card">
        <h3>Manage Spaces</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Space</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Equipment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id}>
                <td>{space.name}</td>
                <td>{space.type}</td>
                <td>{space.capacity}</td>
                <td>{space.equipment.join(", ")}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <Button onClick={() => handleEdit(space)}>Edit</Button>
                  <Button className="secondary" onClick={() => deleteSpace(space.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Academic Timetable</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Space</th>
              <th>Day</th>
              <th>Time</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((slot) => (
              <tr key={slot.id}>
                <td>{spaces.find((space) => space.id === slot.spaceId)?.name || "-"}</td>
                <td>{slot.day}</td>
                <td>
                  {slot.start} - {slot.end}
                </td>
                <td>{slot.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BookingList bookings={bookings} spaces={spaces} onStatusChange={updateBookingStatus} showActions />
    </div>
  );
};

export default AdminDashboard;
