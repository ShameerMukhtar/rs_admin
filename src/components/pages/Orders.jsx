import React, { useState, useEffect } from "react";
import "./Orders.css"; // Import CSS for styling
import { FaEye } from "react-icons/fa"; // Import Eye Icon

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order cart

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedStatus, orders]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/get-all-orders-admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === selectedStatus)
      );
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");

    if (newStatus === "shipped" && !trackingId) {
      alert("Please provide a tracking ID before shipping the order.");
      return;
    }

    const requestBody =
      newStatus === "shipped"
        ? { status: newStatus, trackingId }
        : { status: newStatus };

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/product/change-order-status/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        fetchOrders();
        setTrackingId(""); // Reset tracking ID after update
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="orders-container">
      <h1>Orders</h1>

      {/* Status Filter Buttons */}
      <div className="filter-buttons">
        {[
          "all",
          "pending",
          "accepted",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            className={selectedStatus === status ? "active-filter" : ""}
            onClick={() => setSelectedStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading orders...</p>}

      {/* Orders Table Container */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Tracking ID</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Actions</th>
              <th>Cart</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td data-label="Order ID">{order._id}</td>
                <td data-label="Email">{order.email}</td>
                <td data-label="Phone">{order.phone}</td>
                <td data-label="City">{order.city}</td>
                <td data-label="Tracking ID">{order.trackingId || "Null"}</td>
                <td data-label="Status">{order.status}</td>
                <td data-label="Total Price">Rs {order.totalPrice}</td>
                <td data-label="Actions">
                  {order.status === "pending" && (
                    <button
                      className="accept-btn"
                      onClick={() => updateOrderStatus(order._id, "accepted")}
                    >
                      Accept
                    </button>
                  )}
                  {order.status === "accepted" && (
                    <>
                      <input
                        type="text"
                        placeholder="Tracking ID"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="tracking-input"
                      />
                      <button
                        className="ship-btn"
                        onClick={() => updateOrderStatus(order._id, "shipped")}
                      >
                        Ship
                      </button>
                    </>
                  )}
                  {order.status === "shipped" && (
                    <button
                      className="deliver-btn"
                      onClick={() => updateOrderStatus(order._id, "delivered")}
                    >
                      Deliver
                    </button>
                  )}
                  {order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          updateOrderStatus(order._id, "cancelled")
                        }
                      >
                        Cancel
                      </button>
                    )}
                </td>
                <td data-label="Cart">
                  <FaEye
                    className="eye-icon"
                    onClick={() => setSelectedOrder(order)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Modal */}
      {selectedOrder && (
        <div className="cart-modal">
          <div className="cart-content">
            <h2>Order Cart</h2>
            <button
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              X
            </button>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.cart.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Product">{item.title}</td>
                    <td data-label="Size">{item.size || "N/A"}</td>
                    <td data-label="Quantity">{item.quantity}</td>
                    <td data-label="Price">Rs {item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
