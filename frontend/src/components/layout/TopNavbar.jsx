import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { appLogoImage } from "../../assets/images";
import { PATHS } from "../../utils/routePaths";
import { ROLES, roleHomePath } from "../../utils/roles";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const userInitial = user?.name ? String(user.name).trim().charAt(0).toUpperCase() : "U";
  const roleText =
    user?.role === "coordinator" ? "STUDENT" : (user?.role ? String(user.role).toUpperCase() : "GUEST");

  const navLinks = useMemo(() => {
    const links = [
      { label: "Dashboard", path: roleHomePath(user?.role), roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
      { label: "Bookings", path: PATHS.BOOKINGS, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
      { label: "Spaces", path: PATHS.SPACES, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
      { label: "Calendar", path: PATHS.CALENDAR, roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR] },
      { label: "Report", path: PATHS.BOOKING_REPORT, roles: [ROLES.ADMIN] },
    ];

    return links.filter((link) => link.roles.includes(user?.role));
  }, [user?.role]);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={appLogoImage} alt="SECE Logo" className="navbar-logo" />
        <div className="navbar-brand-text">
          <p className="navbar-subtitle"><strong>Venue Booking System</strong></p>
        </div>
      </div>

      <button
        className="mobile-menu-btn"
        onClick={() => setIsNavOpen((prev) => !prev)}
        aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-nav${isNavOpen ? " open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setIsNavOpen(false)}
            className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <span className="navbar-avatar" aria-hidden="true">{userInitial}</span>
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
