// src/pages/AdminHome.jsx
import React from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const AdminHome = () => {
  return (
    <Navbar>
      <Outlet />
    </Navbar>
  );
};

export default AdminHome;
