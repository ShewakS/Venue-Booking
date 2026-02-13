import React from "react";
import SpaceList from "../components/space/SpaceList";

const SpacePage = () => {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h2>Spaces</h2>
      <SpaceList />
    </div>
  );
};

export default SpacePage;
