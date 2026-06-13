import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const COLS = [
  { id: "new", label: "New Orders", icon: "bi-bell", badge: "bg-primary", border: "#0d6efd" },
  { id: "Preparing", label: "Preparing", icon: "bi-fire", badge: "bg-warning text-dark", border: "#ffc107" },
  { id: "Ready", label: "Ready", icon: "bi-check-circle", badge: "bg-success", border: "#198754" },
];

function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("import.meta.env.VITE_API_URL/api/orders/allOrder", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const id = result.draggableId;
    const status = result.destination.droppableId;
    setOrders((p) => p.map((o) => (o._id === id ? { ...o, status } : o)));
    const token = localStorage.getItem("token");
    await axios.patch(`import.meta.env.VITE_API_URL/api/orders/updateStatus/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <div className="ff-page">
      <div className="ff-page-inner">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold mb-1">Order Board</h4>
            <p className="text-secondary small mb-0">Drag cards to update order status</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm fw-semibold" onClick={() => navigate("/menu-management")}>
              <i className="bi bi-menu-button-wide me-1"></i>Manage Menu
            </button>
            <button className="btn btn-brand btn-sm" onClick={() => navigate("/dashboard")}>
              <i className="bi bi-bar-chart-line me-1"></i>Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--ff-brand)" }} /></div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="row g-3">
              {COLS.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.id);
                return (
                  <div key={col.id} className="col-12 col-md-4">
                    <div className="ff-kanban-header" style={{ background: `${col.border}15`, border: `1px solid ${col.border}30` }}>
                      <i className={`bi ${col.icon}`} style={{ color: col.border, fontSize: 18 }}></i>
                      <span className="fw-bold" style={{ color: col.border }}>{col.label}</span>
                      <span className={`badge ms-auto ${col.badge}`}>{colOrders.length}</span>
                    </div>
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`ff-kanban-col ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                        >
                          {colOrders.length === 0 && !snapshot.isDraggingOver && (
                            <p className="text-center text-secondary small py-4 mb-0">Drop orders here</p>
                          )}
                          {colOrders.map((order, idx) => (
                            <Draggable key={order._id} draggableId={order._id} index={idx}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`ff-order-card ${snapshot.isDragging ? "dragging" : ""}`}
                                  style={provided.draggableProps.style}
                                >
                                  <div className="ff-order-id">#{order._id.slice(-8).toUpperCase()}</div>
                                  {order.items.map((item) => (
                                    <div key={item.name} className="d-flex justify-content-between small py-1 border-bottom">
                                      <span>{item.name}</span>
                                      <span className="text-secondary fw-semibold">×{item.quantity}</span>
                                    </div>
                                  ))}
                                  <div className="fw-bold mt-2" style={{ color: "var(--ff-brand)" }}>₹{order.totalPrice}</div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

export default Admin;