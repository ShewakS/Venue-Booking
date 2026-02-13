import React from "react";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/roles";
import logo from "./SECE Logo.png";

const TopNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="SECE Logo" className="navbar-logo" />
        <strong>Sri Eshwar Venue Management</strong>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span className="role-pill">{ROLE_LABELS[user?.role] || "Guest"}</span>
        <span>{user?.name || "Guest"}</span>
        <Button className="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
