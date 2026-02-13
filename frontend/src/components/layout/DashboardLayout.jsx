import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopNavbar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
