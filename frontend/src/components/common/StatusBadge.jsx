import React from "react";

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || "pending";
  return <span className={`badge ${normalized}`}>{status}</span>;
};

export default StatusBadge;
