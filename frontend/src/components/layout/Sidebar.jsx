import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../utils/routePaths";
import { ROLE_LABELS, ROLES, roleHomePath } from "../../utils/roles";

const Sidebar = () => {
  const { role } = useAuth();

  const roleHeader = {
    [ROLES.ADMIN]: {
      title: "Organizer Portal",
      subtitle: "Venue Operations",
    },
    [ROLES.FACULTY]: {
      title: "Faculty Portal",
      subtitle: "Booking Requests",
    },
    [ROLES.COORDINATOR]: {
      title: "Coordinator Portal",
      subtitle: "Campus Events",
    },
  };

  const header = roleHeader[role] || {
    title: "Smart Campus Portal",
    subtitle: "Venue Management",
  };

  const links = [
    { label: "Dashboard", path: roleHomePath(role), roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Bookings", path: PATHS.BOOKINGS, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Spaces", path: PATHS.SPACES, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Calendar", path: PATHS.CALENDAR, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">{header.title}</div>
        <p className="sidebar-subtitle">{header.subtitle}</p>
      </div>
      <nav className="sidebar-nav">
        {links
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-help">
        <p className="sidebar-help-title">Need help?</p>
        <p className="sidebar-help-text">Contact support for booking issues.</p>
      </div>

      <div className="sidebar-role">{ROLE_LABELS[role] || "Guest"}</div>
    </aside>
  );
};

export default Sidebar;
