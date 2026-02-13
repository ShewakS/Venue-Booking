import React from "react";
import SpaceList from "../components/space/SpaceList";
import CalendarView from "../components/calendar/CalendarView";
import { useData } from "../context/DataContext";

const SpacePage = () => {
  const { spaces } = useData();

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Space Availability</h2>
      <SpaceList spaces={spaces} />
      <CalendarView />
    </div>
  );
};

export default SpacePage;
