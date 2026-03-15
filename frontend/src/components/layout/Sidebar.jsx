import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../utils/routePaths";
import { ROLES, roleHomePath } from "../../utils/roles";

const SidebarIcon = ({ name }) => {
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

  if (name === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="5" />
        <rect x="13" y="10" width="8" height="11" />
        <rect x="3" y="13" width="8" height="8" />
      </svg>
    );
  }

  if (name === "bookings") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M4 11h16" />
      </svg>
    );
  }

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

  if (name === "calendar") {
    return (
      <svg {...common}>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    );
  }

  if (name === "report") {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }
};

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
      title: "Student Portal",
      subtitle: "Campus Events",
    },
  };

  const header = roleHeader[role] || {
    title: "Smart Campus Portal",
    subtitle: "Venue Management",
  };

  const links = [
    {
      label: "Dashboard",
      icon: "dashboard",
      path: roleHomePath(role),
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR],
    },
    { label: "Bookings", icon: "bookings", path: PATHS.BOOKINGS, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Spaces", icon: "spaces", path: PATHS.SPACES, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    {
      label: "Calendar",
      icon: "calendar",
      path: PATHS.CALENDAR,
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR],
    },
    {
      label: "Report",
      icon: "report",
      path: PATHS.BOOKING_REPORT,
      roles: [ROLES.ADMIN],
    },
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
              <span className="sidebar-link-icon">
                <SidebarIcon name={link.icon} />
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-help">
        <p className="sidebar-help-title">Need help?</p>
        <p className="sidebar-help-text">Contact support for booking issues.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
