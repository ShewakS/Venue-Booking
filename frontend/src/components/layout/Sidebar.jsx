import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATHS } from "../../utils/routePaths";
import { ROLES, roleHomePath } from "../../utils/roles";

const Sidebar = () => {
  const { role } = useAuth();

  const links = [
    { label: "Dashboard", path: roleHomePath(role), roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Bookings", path: PATHS.BOOKINGS, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Spaces", path: PATHS.SPACES, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
    { label: "Calendar", path: PATHS.CALENDAR, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Smart Campus</div>
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
    </aside>
  );
};

export default Sidebar;
