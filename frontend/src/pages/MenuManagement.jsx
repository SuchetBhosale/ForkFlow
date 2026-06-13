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
    try {
      const res = await axios.get("import.meta.env.VITE_API_URL/api/menuItem");
      setMenuItems(res.data);
    } catch (err) {
      setError("Failed to load menu items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenuItems(); }, [fetchMenuItems]);

  const handleSubmit = async () => {
    if (!name.trim() || !price || !category.trim()) { setError("Please fill in all fields."); return; }
    setError("");
    try {
      if (editId) {
        await axios.put(`import.meta.env.VITE_API_URL/api/menuItem/${editId}`, { name, price: Number(price), category }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("import.meta.env.VITE_API_URL/api/menuItem/menu", { name, price: Number(price), category }, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetForm(); fetchMenuItems();
    } catch (err) {
      setError(editId ? "Failed to update item." : "Failed to add item."); console.error(err);
    }
  };

  const handleEdit = (item) => { setEditId(item._id); setName(item.name); setPrice(item.price); setCategory(item.category); setError(""); };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`import.meta.env.VITE_API_URL/api/menuItem/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMenuItems();
    } catch (err) { setError("Failed to delete item."); console.error(err); }
  };
  const resetForm = () => { setName(""); setPrice(""); setCategory(""); setEditId(null); setError(""); };
  const categories = [...new Set(menuItems.map((i) => i.category))];

  return (
    <div className="ff-page">
      <div className="ff-page-inner">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold mb-1">Menu Management</h4>
            <p className="text-secondary small mb-0">{menuItems.length} items · {categories.length} categories</p>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-4">
            <div className="ff-card card">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">
                  <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"} me-2`} style={{ color: "var(--ff-brand)" }}></i>
                  {editId ? "Edit Item" : "Add New Item"}
                </h6>

                {error && (
                  <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill"></i> {error}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input className="form-control" type="text" placeholder="e.g. Butter Chicken"
                    value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-control" type="number" placeholder="e.g. 280" min={0}
                    value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Category</label>
                  <input className="form-control" type="text" placeholder="e.g. Main Course"
                    value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-brand flex-grow-1 fw-semibold" onClick={handleSubmit}>
                    <i className={`bi ${editId ? "bi-check-lg" : "bi-plus-lg"} me-1`}></i>
                    {editId ? "Update Item" : "Add Item"}
                  </button>
                  {editId && (
                    <button className="btn btn-outline-secondary fw-semibold" onClick={resetForm}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="ff-card card">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--ff-brand)" }} /></div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <i className="bi bi-grid fs-1 d-block mb-2"></i>No menu items yet
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table ff-table mb-0">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item._id}>
                          <td className="fw-semibold">{item.name}</td>
                          <td><span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">{item.category}</span></td>
                          <td className="fw-bold" style={{ color: "var(--ff-brand)" }}>₹{item.price}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary fw-semibold" onClick={() => handleEdit(item)}>
                                <i className="bi bi-pencil me-1"></i>Edit
                              </button>
                              <button className="btn btn-sm btn-outline-danger fw-semibold" onClick={() => handleDelete(item._id)}>
                                <i className="bi bi-trash me-1"></i>Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuManagement;