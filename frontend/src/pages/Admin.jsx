import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { useEffect, useState } from "react";

function Admin() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/allOrder",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOrders(res.data.orders);
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };
    fetchOrders();
  }, []);

  const columns = ["new", "Preparing", "Ready"];

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const orderId = result.draggableId;
    const newStatus = result.destination.droppableId;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
    const token = localStorage.getItem("token");
    await axios.patch(
      `http://localhost:5000/api/orders/updateStatus/${orderId}`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {columns.map((column) => (
          <Droppable droppableId={column} key={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width: "300px",
                  minHeight: "500px",
                  background: "#f4f4f4",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <h2>{column}</h2>

                {orders
                  .filter((order) => order.status === column)
                  .map((order, index) => (
                    <Draggable
                      key={order._id}
                      draggableId={order._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "10px",
                            marginBottom: "10px",
                            background: "white",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {order.items.map((item) => (
                            <p key={item.name}>
                              {item.name} x {item.quantity}
                            </p>
                          ))}
                          <p>Total: ₹{order.totalPrice}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default Admin;
