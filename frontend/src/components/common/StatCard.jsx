import React from "react";

const Icon = ({ name }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "spaces") {
    return (
      <svg {...common}>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
      </svg>
    );
  }

  if (name === "pending") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "academic") {
    return (
      <svg {...common}>
        <path d="M12 3 2 8l10 5 10-5-10-5z" />
        <path d="M6 10v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
};

const StatCard = ({ title, value, icon = "bookings", tone = "blue" }) => {
  return (
    <div className={`card stat-card tone-${tone}`}>
      <div className="stat-card-head">
        <span className="stat-icon">
          <Icon name={icon} />
        </span>
        <h4>{title}</h4>
      </div>
      <p className="stat-value">{value}</p>
    </div>
  );
};

export default StatCard;
