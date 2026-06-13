import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [menuItem, setMenuItem] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("import.meta.env.VITE_API_URL/api/menuItem", { headers: { Authorization: `Bearer ${token}` } });
        setMenuItem(res.data);
      } catch (err) {
        console.error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPrice = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const categories = ["All", ...new Set(menuItem.map((i) => i.category))];
  const filtered = activeCategory === "All" ? menuItem : menuItem.filter((i) => i.category === activeCategory);

  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("import.meta.env.VITE_API_URL/api/orders", { items: cart, totalPrice }, { headers: { Authorization: `Bearer ${token}` } });
      setCart([]);
      navigate("/orders");
    } catch (err) { console.error(err.response?.data?.message); }
  };

  const increase = (id) => setCart((p) => p.map((i) => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decrease = (id) => setCart((p) => p.map((i) => i._id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  const addToCart = (item) => setCart((p) => p.find((i) => i._id === item._id) ? p : [...p, { ...item, quantity: 1 }]);
  const inCart = (id) => cart.some((i) => i._id === id);
  const getQty = (id) => cart.find((i) => i._id === id)?.quantity || 0;

  return (
    <div className="ff-page">
      <div className="ff-page-inner">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="fw-bold mb-1">Menu</h4>
            <p className="text-secondary small mb-0">{menuItem.length} dishes available</p>
          </div>
          <button className="btn btn-outline-secondary btn-sm fw-semibold" onClick={() => navigate("/ai")}>
            <i className="bi bi-stars me-1"></i>AI Suggestions
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm fw-semibold rounded-pill ${activeCategory === cat ? "btn-brand" : "btn-outline-secondary"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-8">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--ff-brand)" }} /></div>
            ) : (
              <div className="row g-3">
                {filtered.map((item) => (
                  <div key={item._id} className="col-12 col-sm-6 col-xl-4">
                    <div className="ff-menu-card">
                      <div className="ff-menu-img">🍛</div>
                      <div className="p-3">
                        <h6 className="fw-bold mb-0">{item.name}</h6>
                        <p className="text-secondary small mb-2">{item.category}</p>
                        <p className="fw-bold mb-3" style={{ color: "var(--ff-brand)", fontSize: "1.1rem" }}>₹{item.price}</p>
                        {inCart(item._id) ? (
                          <div className="d-flex align-items-center justify-content-center gap-3">
                            <button className="ff-qty-btn minus" onClick={() => decrease(item._id)}>−</button>
                            <span className="fw-bold fs-5">{getQty(item._id)}</span>
                            <button className="ff-qty-btn plus" onClick={() => increase(item._id)}>+</button>
                          </div>
                        ) : (
                          <button className="btn btn-brand w-100 btn-sm fw-semibold" onClick={() => addToCart(item)}>
                            <i className="bi bi-cart-plus me-1"></i>Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-4">
            <div className="ff-card card" style={{ position: "sticky", top: 80 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-cart3 me-2" style={{ color: "var(--ff-brand)" }}></i>
                  Cart
                  {totalItems > 0 && <span className="badge ms-2 rounded-pill" style={{ background: "var(--ff-brand)" }}>{totalItems}</span>}
                </h6>

                {cart.length === 0 ? (
                  <div className="text-center text-secondary py-4">
                    <i className="bi bi-cart fs-1 d-block mb-2"></i>
                    <p className="small mb-0">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {cart.map((item) => (
                        <div key={item._id} className="d-flex align-items-center justify-content-between rounded-3 p-2" style={{ background: "var(--ff-kanban)" }}>
                          <div>
                            <p className="fw-semibold small mb-0">{item.name}</p>
                            <p className="text-secondary" style={{ fontSize: 11 }}>₹{item.price} each</p>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button className="ff-qty-btn minus" style={{ width: 26, height: 26, fontSize: 14 }} onClick={() => decrease(item._id)}>−</button>
                            <span className="fw-bold">{item.quantity}</span>
                            <button className="ff-qty-btn plus" style={{ width: 26, height: 26, fontSize: 14 }} onClick={() => increase(item._id)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-semibold text-secondary">Total</span>
                      <span className="fw-bold fs-5" style={{ color: "var(--ff-brand)" }}>₹{totalPrice}</span>
                    </div>
                    <button className="btn btn-brand w-100 fw-semibold py-2" onClick={handleOrder}>
                      <i className="bi bi-bag-check me-2"></i>Place Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;