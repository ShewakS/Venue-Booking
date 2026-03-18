import React from "react";
import CalendarView from "../components/calendar/CalendarView";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { ROLES } from "../utils/roles";

const CalendarPage = () => {
  const { role } = useAuth();
  const { timetableOverrides, setTimetableOverride } = useData();
  const canEdit = role === ROLES.ADMIN;

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Calendar</h2>
      <CalendarView editable={canEdit} overrides={timetableOverrides} onSetOverride={setTimetableOverride} />
    </div>
  );
};

export default CalendarPage;
