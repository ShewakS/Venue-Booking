import React from "react";
import SpaceCard from "./SpaceCard";

const SpaceList = () => {
  const spaces = [
    { id: 1, name: "Lab 101", type: "Computer Lab", capacity: 40 },
    { id: 2, name: "Seminar Hall 2", type: "Seminar Hall", capacity: 120 },
    { id: 3, name: "Classroom C1", type: "Classroom", capacity: 60 },
  ];

  return (
    <div className="card-grid">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
};

export default SpaceList;
