import axios from "axios";
import { useEffect, useState, useCallback } from "react";

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/menuItem");
      setMenuItems(res.data);
    } catch (err) {
      setError("Failed to load menu items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleSubmit = async () => {
    if (!name.trim() || !price || !category.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/menuItem/${editId}`,
          { name, price: Number(price), category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/menuItem/menu",
          { name, price: Number(price), category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      resetForm();
      fetchMenuItems();
    } catch (err) {
      setError(editId ? "Failed to update item." : "Failed to add item.");
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setError("");
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/menuItem/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMenuItems();
    } catch (err) {
      setError("Failed to delete item.");
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setEditId(null);
    setError("");
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const styles = {
    container: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      maxWidth: 680,
      margin: "40px auto",
      padding: "0 20px",
      color: "#1a1a2e",
    },
    heading: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 24,
      letterSpacing: "-0.5px",
      borderBottom: "3px solid #e63946",
      paddingBottom: 10,
    },
    formCard: {
      background: "#f8f9ff",
      border: "1px solid #e0e4f0",
      borderRadius: 14,
      padding: "24px 28px",
      marginBottom: 32,
      display: "flex",
      flexDirection: "column",
      gap: 14,
    },
    formTitle: {
      fontSize: 14,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#666",
      marginBottom: 4,
    },
    input: {
      padding: "10px 14px",
      borderRadius: 8,
      border: "1.5px solid #d0d5e8",
      fontSize: 15,
      outline: "none",
      transition: "border-color 0.2s",
      background: "#fff",
    },
    buttonRow: {
      display: "flex",
      gap: 10,
      marginTop: 4,
    },
    primaryBtn: {
      padding: "10px 22px",
      borderRadius: 8,
      border: "none",
      background: "#e63946",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      letterSpacing: 0.3,
    },
    cancelBtn: {
      padding: "10px 18px",
      borderRadius: 8,
      border: "1.5px solid #ccc",
      background: "transparent",
      color: "#555",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    },
    error: {
      background: "#fff0f0",
      border: "1px solid #f5c0c0",
      color: "#c0392b",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 14,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
    },
    card: {
      background: "#fff",
      border: "1.5px solid #e8eaf0",
      borderRadius: 12,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    cardName: {
      fontSize: 17,
      fontWeight: 700,
      margin: 0,
      color: "#1a1a2e",
    },
    cardPrice: {
      fontSize: 15,
      color: "#e63946",
      fontWeight: 600,
      margin: 0,
    },
    cardCategory: {
      fontSize: 13,
      color: "#888",
      margin: 0,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    cardActions: {
      display: "flex",
      gap: 8,
      marginTop: 10,
    },
    editBtn: {
      flex: 1,
      padding: "7px 0",
      borderRadius: 7,
      border: "1.5px solid #3a86ff",
      background: "transparent",
      color: "#3a86ff",
      fontWeight: 600,
      fontSize: 13,
      cursor: "pointer",
    },
    deleteBtn: {
      flex: 1,
      padding: "7px 0",
      borderRadius: 7,
      border: "none",
      background: "#fff0f0",
      color: "#e63946",
      fontWeight: 600,
      fontSize: 13,
      cursor: "pointer",
    },
    empty: {
      textAlign: "center",
      color: "#aaa",
      padding: "40px 0",
      fontSize: 15,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🍽 Menu Management</h2>

      <div style={styles.formCard}>
        <span style={styles.formTitle}>
          {editId ? "Edit Item" : "Add New Item"}
        </span>

        <input
          style={styles.input}
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Price (₹)"
          value={price}
          min={0}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Category (e.g. Starters)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonRow}>
          <button style={styles.primaryBtn} onClick={handleSubmit}>
            {editId ? "Update Item" : "Add Item"}
          </button>
          {editId && (
            <button style={styles.cancelBtn} onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p style={styles.empty}>Loading menu…</p>
      ) : menuItems.length === 0 ? (
        <p style={styles.empty}>No menu items yet. Add one above!</p>
      ) : (
        <div style={styles.grid}>
          {menuItems.map((item) => (
            <div key={item._id} style={styles.card}>
              <h4 style={styles.cardName}>{item.name}</h4>
              <p style={styles.cardPrice}>₹{item.price}</p>
              <p style={styles.cardCategory}>{item.category}</p>
              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuManagement;
