// src/components/common/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader"; // Import loader

const Layout = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}
      <Outlet /> {/* Renders child routes inside AdminHome */}
    </>
  );
};

export default Layout;
