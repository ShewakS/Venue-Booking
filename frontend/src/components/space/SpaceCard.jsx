import React from "react";
import Button from "../common/Button";

const SpaceCard = ({ space }) => {
  return (
    <div className="card">
      <h4>{space.name}</h4>
      <p style={{ color: "#5b6475" }}>{space.type}</p>
      <p>Capacity: {space.capacity}</p>
      <Button className="secondary">View Availability</Button>
    </div>
  );
};

export default SpaceCard;
