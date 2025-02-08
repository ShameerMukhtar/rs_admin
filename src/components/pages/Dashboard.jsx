import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Import CSS
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchDashboardData();

    // Handle window resize for dynamic chart scaling
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/get-data`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  // Chart Data
  const chartData = dashboardData
    ? {
        labels: ["Pending", "Accepted", "Cancelled", "Shipped", "Delivered"],
        datasets: [
          {
            label: "Order Statuses",
            data: [
              dashboardData.pendingOrders,
              dashboardData.acceptedOrders,
              dashboardData.cancelledOrders,
              dashboardData.shippedOrders,
              dashboardData.deliveredOrders,
            ],
            backgroundColor: [
              "#FFA726",
              "#66BB6A",
              "#EF5350",
              "#42A5F5",
              "#AB47BC",
            ],
          },
        ],
      }
    : null;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {loading ? <p>Loading dashboard data...</p> : null}

      {/* Summary Box */}
      {dashboardData && (
        <div className="summary-box">
          <div className="summary-item">
            <h3>Total Orders</h3>
            <p>{dashboardData.totalOrders}</p>
          </div>
          <div className="summary-item">
            <h3>Total Products</h3>
            <p>{dashboardData.totalProducts}</p>
          </div>
          <div className="summary-item">
            <h3>Total Income</h3>
            <p>Rs {dashboardData.totalIncome}</p>
          </div>
        </div>
      )}

      {/* Orders Chart */}
      {chartData && (
        <div className="chart-container">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Allows dynamic resizing
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
