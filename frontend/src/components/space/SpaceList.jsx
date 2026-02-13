import React from "react";
import SpaceCard from "./SpaceCard";

const SpaceList = ({ spaces }) => {
  return (
    <div className="card-grid">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
};

export default SpaceList;
