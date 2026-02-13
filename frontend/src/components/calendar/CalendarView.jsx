import React, { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import { getDayAbbrev, isTimeOverlapping } from "../../utils/time";

const buildSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour += 1) {
    const start = `${String(hour).padStart(2, "0")}:00`;
    const end = `${String(hour + 1).padStart(2, "0")}:00`;
    slots.push({ start, end, label: `${start} - ${end}` });
  }
  return slots;
};

const CalendarView = () => {
  const { spaces, bookings, timetable } = useData();
  const [selectedDate, setSelectedDate] = useState("2026-02-14");
  const slots = useMemo(() => buildSlots(), []);
  const day = getDayAbbrev(selectedDate);

  const resolveSlotStatus = (spaceId, slot) => {
    const academic = timetable.some((entry) => {
      if (entry.spaceId !== spaceId || entry.day !== day) {
        return false;
      }
      return isTimeOverlapping(slot.start, slot.end, entry.start, entry.end);
    });
    if (academic) {
      return "academic";
    }

    const approved = bookings.find((entry) => {
      if (entry.spaceId !== spaceId || entry.date !== selectedDate || entry.status !== "Approved") {
        return false;
      }
      return isTimeOverlapping(slot.start, slot.end, entry.start, entry.end);
    });
    if (approved) {
      return "booked";
    }

    const pending = bookings.find((entry) => {
      if (entry.spaceId !== spaceId || entry.date !== selectedDate || entry.status !== "Pending") {
        return false;
      }
      return isTimeOverlapping(slot.start, slot.end, entry.start, entry.end);
    });
    if (pending) {
      return "pending";
    }
    return "available";
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h3>Space Availability</h3>
          <p className="muted">Academic timetable and booking visibility by time slot.</p>
        </div>
        <label className="input-field" htmlFor="calendarDate">
          <span>Date</span>
          <input
            id="calendarDate"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
      </div>

      <div className="legend">
        <span className="legend-item academic">Academic Reserved</span>
        <span className="legend-item pending">Pending Booking</span>
        <span className="legend-item booked">Approved Booking</span>
        <span className="legend-item available">Available</span>
      </div>

      <div className="slot-grid">
        <div className="slot-header">Space</div>
        {slots.map((slot) => (
          <div key={slot.label} className="slot-header">
            {slot.start}
          </div>
        ))}
        {spaces.map((space) => (
          <React.Fragment key={space.id}>
            <div className="slot-space">{space.name}</div>
            {slots.map((slot) => {
              const status = resolveSlotStatus(space.id, slot);
              return <div key={`${space.id}-${slot.label}`} className={`slot-cell ${status}`} />;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
