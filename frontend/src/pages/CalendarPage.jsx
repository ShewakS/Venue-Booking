import React from "react";
import CalendarView from "../components/calendar/CalendarView";

const CalendarPage = () => {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Calendar</h2>
      <CalendarView />
    </div>
  );
};

export default CalendarPage;
