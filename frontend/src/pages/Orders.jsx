import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Orders() {
  const socket = io("http://localhost:5000");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchOrders = async () => {
      const res = await axios.get("http://localhost:5000/api/orders/allOrder", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    };
    fetchOrders();
    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);

 return (
  <>
    <h2>My Orders</h2>

    {orders.map((order) => (
      <div
        key={order._id}
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
        }}
      >
        <h4>Order ID: {order._id}</h4>

        {order.items.map((item) => (
          <p key={item._id}>
            {item.name} x {item.quantity}
          </p>
        ))}

        <p>
          <strong>Total:</strong> ₹{order.totalPrice}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                order.status === "Ready"
                  ? "green"
                  : order.status === "Preparing"
                    ? "orange"
                    : "blue",
              fontWeight: "bold",
            }}
          >
            {order.status}
          </span>
        </p>
      </div>
    ))}
  </>
);
}

export default Orders;
