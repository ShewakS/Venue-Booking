import React from "react";
import SpaceList from "../components/space/SpaceList";
import { useData } from "../context/DataContext";

const SpacePage = () => {
  const { spaces } = useData();

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Available Spaces</h2>
      <SpaceList spaces={spaces} />
    </div>
  );
};

export default SpacePage;
