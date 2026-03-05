import React from "react";
import { NavLink } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../utils/routePaths";
import { ROLE_LABELS, ROLES, roleHomePath } from "../../utils/roles";
import logo from "./SECE Logo.png";

const TopNavbar = () => {
  const { user, role, logout } = useAuth();

  const links = [
    { label: "Dashboard", path: roleHomePath(role), roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Bookings", path: PATHS.BOOKINGS, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Spaces", path: PATHS.SPACES, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Calendar", path: PATHS.CALENDAR, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="SECE Logo" className="navbar-logo" />
        <strong>Sri Eshwar Venue Management</strong>
      </div>
      <nav className="navbar-nav">
        {links
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <NavLink key={link.path} to={link.path} className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
              {link.label}
            </NavLink>
          ))}
      </nav>
      <div className="navbar-actions">
        <span className="role-pill">{ROLE_LABELS[user?.role] || "Guest"}</span>
        <span className="navbar-user">{user?.name || "Guest"}</span>
        <Button className="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
