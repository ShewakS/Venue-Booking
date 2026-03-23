import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import BookingList from "../components/booking/BookingList";
import Button from "../components/common/Button";
import CalendarView from "../components/calendar/CalendarView";
import StatCard from "../components/common/StatCard";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const AdminDashboard = () => {
  const {
    spaces,
    bookings,
    timetable,
    timetableOverrides,
    pendingUsers,
    addSpace,
    updateSpace,
    deleteSpace,
    updateBookingStatus,
    approveUser,
    rejectUser,
    setTimetableOverride,
  } = useData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", capacity: "", imageUrl: "" });
  const [formError, setFormError] = useState("");

  const totals = useMemo(
    () => ({
      totalSpaces: spaces.length,
      totalBookings: bookings.length,
      pendingRequests: bookings.filter((booking) => booking.status === "Pending").length,
      pendingUsers: pendingUsers.length,
    }),
    [spaces, bookings, pendingUsers]
  );

  const resetForm = () => {
    setForm({ name: "", type: "", capacity: "", imageUrl: "" });
    setEditingId(null);
  };

  const handleEdit = (space) => {
    setEditingId(space.id);
    setForm({
      name: space.name,
      type: space.type,
      capacity: String(space.capacity),
      imageUrl: space.imageUrl || "",
    });
  };

  const handleImageFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setFormError("Please upload a valid image file.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setFormError("Image size must be 2 MB or less.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(selectedFile);
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      setFormError("");
    } catch {
      setFormError("Unable to read selected image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const payload = {
      id: editingId,
      name: form.name.trim(),
      type: form.type.trim(),
      capacity: Number(form.capacity),
      imageUrl: form.imageUrl || null,
    };

    if (!payload.name || !payload.type || !payload.capacity) {
      setFormError("Please enter valid space details.");
      return;
    }

    let saved = null;
    if (editingId) {
      saved = await updateSpace(payload);
    } else {
      saved = await addSpace(payload);
    }

    if (!saved) {
      setFormError("Unable to save space. Please try again.");
      return;
    }

    resetForm();
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div className="card-grid">
        <StatCard title="Total Spaces" value={totals.totalSpaces} icon="spaces" tone="blue" />
        <StatCard title="Total Requests" value={totals.totalBookings} icon="bookings" tone="teal" />
        <StatCard title="Pending Requests" value={totals.pendingRequests} icon="pending" tone="amber" />
        <StatCard title="Pending Users" value={totals.pendingUsers} icon="pending" tone="red" />
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Space" : "Add Space"}</h3>
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
            <label className="input-field" htmlFor="spaceImage">
              <span>Venue Image</span>
              <input id="spaceImage" type="file" accept="image/*" onChange={handleImageFileChange} />
              <small style={{ color: "#6b7280" }}>Accepted: image files up to 2 MB</small>
            </label>
            {form.imageUrl ? (
              <div style={{ display: "grid", gap: "8px" }}>
                <img src={form.imageUrl} alt="Venue preview" className="space-form-preview" />
                <div>
                  <Button
                    className="secondary"
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            ) : null}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Button type="submit">{editingId ? "Update Space" : "Add Space"}</Button>
              {editingId ? (
                <Button className="secondary" type="button" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
            {formError ? <p style={{ color: "#c62828", margin: 0 }}>{formError}</p> : null}
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
                    {space.imageUrl ? (
                      <div style={{ marginTop: "8px" }}>
                        <img src={space.imageUrl} alt={`${space.name} venue`} className="space-list-thumb" />
                      </div>
                    ) : null}
                    <div style={{ fontSize: "12px", color: "#5b6475" }}>
                      {space.type} • {space.capacity} capacity
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <Button onClick={() => handleEdit(space)} style={{ padding: "6px 10px", fontSize: "12px" }}>
                      Edit
                    </Button>
                    <Button
                      className="secondary"
                      onClick={async () => {
                        await deleteSpace(space.id);
                      }}
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
        <h3 style={{ marginTop: 0 }}>Pending User Approvals</h3>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {pendingUsers.length === 0 ? (
            <p style={{ color: "#5b6475", textAlign: "center" }}>No pending users</p>
          ) : (
            pendingUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #e5e9f2",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ fontSize: "12px", color: "#5b6475" }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: "12px", color: "#5b6475" }}>
                    Role: {user.role} • {user.roleDescription}
                  </div>
                  <div style={{ fontSize: "12px", color: "#5b6475" }}>
                    Status: {user.status || "pending"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#5b6475" }}>
                    Phone: {user.phone}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Button
                    onClick={async () => {
                      await approveUser(user.id);
                    }}
                    style={{ padding: "6px 10px", fontSize: "12px" }}
                  >
                    Approve
                  </Button>
                  <Button
                    className="secondary"
                    onClick={async () => {
                      if (window.confirm(`Reject registration for ${user.name}?`)) {
                        await rejectUser(user.id);
                      }
                    }}
                    style={{ padding: "6px 10px", fontSize: "12px" }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
