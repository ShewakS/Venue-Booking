import React from "react";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { appLogoImage } from "../../assets/images";

const TopNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const roleText =
    user?.role === "coordinator" ? "STUDENT" : (user?.role ? String(user.role).toUpperCase() : "GUEST");

  return (
    <header className="navbar">
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open navigation menu">
        <span />
        <span />
        <span />
      </button>
      <div className="navbar-brand">
        <img src={appLogoImage} alt="SECE Logo" className="navbar-logo" />
        <div className="navbar-brand-text">
          <p className="navbar-subtitle"><strong>Venue Booking System</strong></p>
        </div>
      </div>
      <div className="navbar-actions">
        <span className="role-pill">{roleText}</span>
        <span className="navbar-user">{user?.name || "Guest"}</span>
        <Button className="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
