import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import BookingPage from "../pages/BookingPage";
import SpacePage from "../pages/SpacePage";
import CalendarPage from "../pages/CalendarPage";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../utils/roles";
import { PATHS } from "../utils/routePaths";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route
        path={PATHS.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.FACULTY_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
            <DashboardLayout>
              <FacultyDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.COORDINATOR_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.COORDINATOR]}>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.BOOKINGS}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR]}>
            <DashboardLayout>
              <BookingPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.SPACES}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR]}>
            <DashboardLayout>
              <SpacePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.CALENDAR}
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACULTY, ROLES.COORDINATOR]}>
            <DashboardLayout>
              <CalendarPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={PATHS.LOGIN} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
