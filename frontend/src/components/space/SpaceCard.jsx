import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { PATHS } from "../../utils/routePaths";

const SpaceCard = ({ space }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      {space.imageUrl ? (
        <div className="space-card-image-wrap">
          <img src={space.imageUrl} alt={`${space.name} venue`} className="space-card-image" />
        </div>
      ) : null}
      <h4>{space.name}</h4>
      <p style={{ color: "#5b6475" }}>{space.type}</p>
      <p>Capacity: {space.capacity}</p>
      <Button className="secondary" onClick={() => navigate(PATHS.CALENDAR)}>
        View Availability
      </Button>
    </div>
  );
};

export default SpaceCard;
