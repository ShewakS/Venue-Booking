import React from "react";
import SpaceList from "../components/space/SpaceList";
import { useData } from "../context/DataContext";

const SpacePage = () => {
  const { spaces } = useData();

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div>
        <h2 style={{ margin: 0 }}>Available Spaces</h2>
        <p style={{ margin: "4px 0 0 0", color: "#5b6475", fontSize: "14px" }}>
          Browse all venues, view images, capacity and check availability.
        </p>
      </div>
      {spaces.length === 0 ? (
        <p style={{ color: "#5b6475", textAlign: "center", padding: "32px 0" }}>No spaces available yet.</p>
      ) : (
        <SpaceList spaces={spaces} />
      )}
    </div>
  );
};

export default SpacePage;
