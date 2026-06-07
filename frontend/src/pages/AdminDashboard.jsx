import axios from "axios";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    preparingOrders: 0,
    readyOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/orders/allOrder",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const orders = res.data.orders;

        const totalOrders = orders.length;

        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );

        const preparingOrders = orders.filter(
          (order) => order.status === "Preparing"
        ).length;

        const readyOrders = orders.filter(
          (order) => order.status === "Ready"
        ).length;

        setStats({
          totalOrders,
          totalRevenue,
          preparingOrders,
          readyOrders,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 250px)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Orders</h3>
          <h1>{stats.totalOrders}</h1>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Revenue</h3>
          <h1>₹{stats.totalRevenue}</h1>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Preparing Orders</h3>
          <h1>{stats.preparingOrders}</h1>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Ready Orders</h3>
          <h1>{stats.readyOrders}</h1>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;