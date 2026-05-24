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
      <h2>Orders</h2>
      {orders.map((order) => (
        <div key={order._id}>
          {order.items.map((item) => (
            <p key={item._id}>
              {item.name} x {item.quantity}
            </p>
          ))}
          <p>Total :{order.totalPrice}</p>
          <p>Status : {order.status}</p>
        </div>
      ))}
    </>
  );
}

export default Orders;
