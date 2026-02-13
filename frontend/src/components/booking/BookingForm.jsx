import React, { useEffect, useMemo, useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { getDayAbbrev, isTimeOverlapping } from "../../utils/time";

const BookingForm = ({ spaces, bookings, timetable, onAddBooking }) => {
  const { user, role } = useAuth();
  const [errors, setErrors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "Seminar",
    spaceId: "",
    date: "",
    start: "",
    end: "",
    participants: "",
    equipment: [],
    notes: "",
  });

  useEffect(() => {
    if (spaces.length && !form.spaceId) {
      setForm((prev) => ({ ...prev, spaceId: String(spaces[0].id) }));
    }
  }, [spaces, form.spaceId]);

  const equipmentOptions = useMemo(() => {
    const all = new Set();
    spaces.forEach((space) => {
      space.equipment.forEach((item) => all.add(item));
    });
    return Array.from(all);
  }, [spaces]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const toggleEquipment = (value) => {
    setForm((prev) => {
      const exists = prev.equipment.includes(value);
      const updated = exists ? prev.equipment.filter((item) => item !== value) : [...prev.equipment, value];
      return { ...prev, equipment: updated };
    });
  };

  const validateBooking = () => {
    const issues = [];
    const selectedSpace = spaces.find((space) => String(space.id) === form.spaceId);

    if (!form.title.trim()) {
      issues.push("Event title is required.");
    }
    if (!form.date) {
      issues.push("Date is required.");
    }
    if (!form.start || !form.end) {
      issues.push("Start and end time are required.");
    }
    if (!form.participants || Number(form.participants) <= 0) {
      issues.push("Number of participants must be greater than 0.");
    }
    if (!selectedSpace) {
      issues.push("Please select a valid venue.");
    }

    if (selectedSpace && Number(form.participants) > selectedSpace.capacity) {
      issues.push("Participant count exceeds the selected space capacity.");
    }

    if (selectedSpace) {
      const missingEquipment = form.equipment.filter((item) => !selectedSpace.equipment.includes(item));
      if (missingEquipment.length) {
        issues.push("Selected space does not support all requested equipment.");
      }
    }

    if (form.start && form.end && form.start >= form.end) {
      issues.push("End time must be later than start time.");
    }

    if (selectedSpace && form.date && form.start && form.end) {
      const overlapWithBookings = bookings.some((booking) => {
        if (booking.spaceId !== Number(form.spaceId) || booking.date !== form.date) {
          return false;
        }
        return isTimeOverlapping(form.start, form.end, booking.start, booking.end);
      });

      const day = getDayAbbrev(form.date);
      const overlapWithTimetable = timetable.some((slot) => {
        if (slot.spaceId !== Number(form.spaceId) || slot.day !== day) {
          return false;
        }
        return isTimeOverlapping(form.start, form.end, slot.start, slot.end);
      });

      if (overlapWithTimetable) {
        issues.push("Selected time overlaps with academic timetable slots.");
      }
      if (overlapWithBookings) {
        issues.push("Selected time overlaps with an existing booking.");
      }
    }

    return issues;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const issues = validateBooking();
    setErrors(issues);
    if (issues.length) {
      return;
    }

    onAddBooking({
      title: form.title,
      type: form.type,
      spaceId: Number(form.spaceId),
      date: form.date,
      start: form.start,
      end: form.end,
      participants: Number(form.participants),
      equipment: form.equipment,
      notes: form.notes,
      requestedBy: user?.name || "Campus User",
      requestedRole: role,
    });

    setForm({
      title: "",
      type: "Seminar",
      spaceId: form.spaceId,
      date: "",
      start: "",
      end: "",
      participants: "",
      equipment: [],
      notes: "",
    });
    setErrors([]);
  };

  return (
    <form className="card" style={{ marginBottom: "20px" }} onSubmit={handleSubmit}>
      <h3>Request a Space</h3>
      <div className="form-grid">
        <InputField id="title" label="Event Title" value={form.title} onChange={handleChange("title")} />
        <label className="input-field" htmlFor="type">
          <span>Event Type</span>
          <select id="type" value={form.type} onChange={handleChange("type")}>
            <option>Seminar</option>
            <option>Lab</option>
            <option>Club</option>
            <option>Workshop</option>
            <option>Lecture</option>
          </select>
        </label>
        <label className="input-field" htmlFor="space">
          <span>Select Venue</span>
          <select id="space" value={form.spaceId} onChange={handleChange("spaceId")}>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} ({space.capacity})
              </option>
            ))}
          </select>
        </label>
        <InputField id="date" label="Date" type="date" value={form.date} onChange={handleChange("date")} />
        <InputField id="start" label="Start Time" type="time" value={form.start} onChange={handleChange("start")} />
        <InputField id="end" label="End Time" type="time" value={form.end} onChange={handleChange("end")} />
        <InputField
          id="participants"
          label="Number of Participants"
          type="number"
          min="1"
          value={form.participants}
          onChange={handleChange("participants")}
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <div className="form-section">
          <span className="section-title">Equipment Required</span>
          <div className="checkbox-grid">
            {equipmentOptions.map((item) => (
              <label key={item} className="checkbox-pill">
                <input
                  type="checkbox"
                  checked={form.equipment.includes(item)}
                  onChange={() => toggleEquipment(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
        <label className="input-field" htmlFor="notes" style={{ marginTop: "12px" }}>
          <span>Additional Notes</span>
          <textarea id="notes" rows="3" value={form.notes} onChange={handleChange("notes")} />
        </label>
      </div>

      {errors.length ? (
        <div className="alert" role="alert">
          {errors.map((issue) => (
            <div key={issue}>{issue}</div>
          ))}
        </div>
      ) : null}

      <div style={{ marginTop: "16px" }}>
        <Button type="submit">Submit Booking</Button>
      </div>
    </form>
  );
};

export default BookingForm;
