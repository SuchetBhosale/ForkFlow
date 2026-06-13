import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, preparingOrders: 0, readyOrders: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("import.meta.env.VITE_API_URL/api/orders/allOrder", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = res.data.orders;
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders.reduce((s, o) => s + o.totalPrice, 0),
          preparingOrders: orders.filter((o) => o.status === "Preparing").length,
          readyOrders: orders.filter((o) => o.status === "Ready").length,
        });
        setRecent([...orders].reverse().slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: "bi-receipt", accent: "c-brand", bg: "rgba(232,67,26,.1)", color: "var(--ff-brand)" },
    { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: "bi-currency-rupee", accent: "c-green", bg: "rgba(25,135,84,.1)", color: "#198754" },
    { label: "Preparing", value: stats.preparingOrders, icon: "bi-fire", accent: "c-yellow", bg: "rgba(255,193,7,.1)", color: "#ffc107" },
    { label: "Ready to Serve", value: stats.readyOrders, icon: "bi-check-circle", accent: "c-purple", bg: "rgba(111,66,193,.1)", color: "#6f42c1" },
  ];

  const badgeClass = { new: "bg-primary", Preparing: "bg-warning text-dark", Ready: "bg-success" };

  return (
    <div className="ff-page">
      <div className="ff-page-inner">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold mb-1">Dashboard</h4>
            <p className="text-secondary small mb-0">Restaurant performance at a glance</p>
          </div>
          <button className="btn btn-outline-secondary btn-sm fw-semibold" onClick={() => navigate("/admin")}>
            <i className="bi bi-arrow-left me-1"></i>Order Board
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--ff-brand)" }} /></div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              {statCards.map((c) => (
                <div key={c.label} className="col-12 col-sm-6 col-xl-3">
                  <div className={`ff-stat-card ${c.accent}`}>
                    <div className="ff-stat-icon" style={{ background: c.bg }}>
                      <i className={`bi ${c.icon}`} style={{ color: c.color, fontSize: 22 }}></i>
                    </div>
                    <div className="ff-stat-value">{c.value}</div>
                    <div className="ff-stat-label">{c.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ff-card">
              <div className="card-body p-0">
                <div className="d-flex align-items-center justify-content-between px-4 pt-4 pb-3">
                  <div>
                    <h6 className="fw-bold mb-0">Recent Orders</h6>
                    <p className="text-secondary small mb-0">Last {recent.length} orders placed</p>
                  </div>
                </div>
                {recent.length === 0 ? (
                  <div className="text-center text-secondary py-5">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>No orders yet
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table ff-table mb-0">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((o) => (
                          <tr key={o._id}>
                            <td><code className="small">#{o._id.slice(-8).toUpperCase()}</code></td>
                            <td className="small">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</td>
                            <td className="fw-bold" style={{ color: "var(--ff-brand)" }}>₹{o.totalPrice}</td>
                            <td><span className={`badge ${badgeClass[o.status] || "bg-primary"}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;