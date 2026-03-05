import React from "react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";
import Particles from "../common/Particles";

const DashboardLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <div className="dashboard-particles">
          <Particles
            particleColors={["#ffffff"]}
            particleCount={2000}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>
        <TopNavbar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
