import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import AdminHome from "./components/pages/AdminHome";
import Products from "./components/pages/Products";
import Blogs from "./components/pages/Blogs";
import Dashboard from "./components/pages/Dashboard";
import Orders from "./components/pages/Orders";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<AdminHome />}>
            <Route path="products" element={<Products />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
