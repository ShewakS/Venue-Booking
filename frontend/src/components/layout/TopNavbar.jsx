import React from "react";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

const TopNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <strong>Space Booking & Allocation</strong>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span>{user?.name || "Guest"}</span>
        <Button className="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
