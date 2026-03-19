import React, { useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import { getDayAbbrev, isTimeOverlapping } from "../../utils/time";

const STATUS_OPTIONS = [
  { value: "academic", label: "Academic Reserved" },
  { value: "available", label: "Available" },
];

const buildSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour += 1) {
    const start = `${String(hour).padStart(2, "0")}:00`;
    const end = `${String(hour + 1).padStart(2, "0")}:00`;
    slots.push({ start, end, label: `${start} - ${end}` });
  }
  return slots;
};

const getNextDateForDay = (dayAbbrev) => {
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const targetIndex = dayNames.indexOf(dayAbbrev);
  if (targetIndex === -1) {
    return today;
  }
  const offset = (targetIndex - today.getDay() + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + offset);
  return result;
};

const formatDateInput = (date) => {
  return date.toISOString().split("T")[0];
};

const CalendarView = ({ editable = false, overrides = [], onSetOverride }) => {
  const { spaces, bookings, timetable } = useData();
  const [selectedEditStatus, setSelectedEditStatus] = useState("academic");
  const [selectedDate, setSelectedDate] = useState(() => {
    if (!timetable.length) {
      return formatDateInput(new Date());
    }
    return formatDateInput(getNextDateForDay(timetable[0].day));
  });
  const slots = useMemo(() => buildSlots(), []);
  const day = getDayAbbrev(selectedDate);

  const hasAcademicSlots = timetable.some((entry) => entry.day === day);

  const resolveSlotStatus = (spaceId, slot) => {
    const override = overrides.find((entry) => {
      if (entry.spaceId !== spaceId || entry.date !== selectedDate) {
        return false;
      }
      return isTimeOverlapping(slot.start, slot.end, entry.start, entry.end);
    });
    if (override?.status === "available") {
      return "available";
    }
    if (override?.status === "booked") {
      return "booked";
    }
    if (override?.status === "academic") {
      return "academic";
    }

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

  const handleSlotClick = (spaceId, slot) => {
    if (!editable || !onSetOverride) {
      return;
    }

    onSetOverride({
      spaceId,
      date: selectedDate,
      start: slot.start,
      end: slot.end,
      status: selectedEditStatus,
    });
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h3>Space Availability</h3>
          <p className="muted">
            Academic timetable and booking visibility by time slot.
            {editable ? " Choose a status and click any slot to apply it." : ""}
            {editable && !hasAcademicSlots ? " No academic slots for this date." : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
          {editable ? (
            <label className="input-field" htmlFor="calendarSlotStatus">
              <span>Mark Slot As</span>
              <select
                id="calendarSlotStatus"
                value={selectedEditStatus}
                onChange={(event) => setSelectedEditStatus(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

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
      </div>

      <div className="legend">
        <span className="legend-item academic">Academic Reserved</span>
        <span className="legend-item booked">Approved Booking</span>
        <span className="legend-item pending">Pending Request</span>
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
              return (
                <div
                  key={`${space.id}-${slot.label}`}
                  className={`slot-cell ${status}${editable ? " interactive" : ""}`}
                  onClick={() => handleSlotClick(space.id, slot)}
                  role={editable ? "button" : undefined}
                  tabIndex={editable ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSlotClick(space.id, slot);
                    }
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
