import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";
import "./AdminHome.css"; // Import CSS for animations

const AdminHome = () => {
  const location = useLocation(); // Get current path

  return (
    <Navbar>
      {/* Show Welcome Message ONLY on /home */}
      {location.pathname === "/home" && (
        <div className="welcome-container">
          <h1 className="welcome-message">✨ WELCOME TO RAFIA AND SUMBAL ✨</h1>
          <p className="welcome-subtext">
            Manage your dashboard, products, orders, and blogs with ease.
          </p>
        </div>
      )}

      <Outlet />
    </Navbar>
  );
};

export default AdminHome;
