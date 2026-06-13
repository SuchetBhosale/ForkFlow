import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Orders() {
  const socket = io("import.meta.env.VITE_API_URL");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await axios.get("import.meta.env.VITE_API_URL/api/orders/allOrder", { headers: { Authorization: `Bearer ${token}` } });
        setOrders(res.data.orders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
    socket.on("orderStatusUpdated", (updated) => {
      setOrders((p) => p.map((o) => o._id === updated._id ? updated : o));
    });
    return () => { socket.disconnect(); };
  }, []);

  const statusBadge = {
    new: { cls: "bg-primary", icon: "bi-bell-fill", label: "New" },
    Preparing: { cls: "bg-warning text-dark", icon: "bi-fire", label: "Preparing" },
    Ready: { cls: "bg-success", icon: "bi-check-circle-fill", label: "Ready!" },
  };

  return (
    <div className="ff-page">
      <div className="ff-page-inner">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">My Orders</h4>
          <p className="text-secondary small mb-0">Real-time order tracking</p>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--ff-brand)" }} /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            <p className="fw-semibold mb-1">No orders yet</p>
            <p className="small">Head to the menu to place your first order</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3" style={{ maxWidth: 680 }}>
            {[...orders].reverse().map((order) => {
              const s = statusBadge[order.status] || statusBadge["new"];
              return (
                <div key={order._id} className="ff-card card">
                  <div className="card-body p-0">
                    <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
                      <code className="small text-secondary">#{order._id.slice(-8).toUpperCase()}</code>
                      <span className={`badge d-flex align-items-center gap-1 ${s.cls}`}>
                        <i className={`bi ${s.icon}`}></i> {s.label}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      {order.items.map((item) => (
                        <div key={item._id} className="d-flex justify-content-between small py-1 border-bottom">
                          <span className="fw-medium">{item.name}</span>
                          <span className="text-secondary">×{item.quantity} — ₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="d-flex justify-content-between align-items-center pt-3">
                        <span className="text-secondary fw-semibold small">Total</span>
                        <span className="fw-bold" style={{ color: "var(--ff-brand)", fontSize: "1.05rem" }}>₹{order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;