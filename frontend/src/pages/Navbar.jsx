import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);

  const authPages = ["/", "/register"];
  if (authPages.includes(location.pathname)) return null;

  const role = localStorage.getItem("role");

  const adminLinks = [
    { to: "/admin", label: "Order Board", icon: "bi-kanban" },
    { to: "/menu-management", label: "Menu", icon: "bi-menu-button-wide" },
    { to: "/dashboard", label: "Dashboard", icon: "bi-bar-chart-line" },
  ];

  const userLinks = [
    { to: "/menu", label: "Menu", icon: "bi-grid" },
    { to: "/orders", label: "My Orders", icon: "bi-receipt" },
    { to: "/ai", label: "AI Assistant", icon: "bi-stars" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;
  const isActive = (to) => location.pathname === to;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="ff-navbar navbar fixed-top px-3">
      <div className="container-xl d-flex align-items-center gap-3 h-100">
        <Link to={role === "admin" ? "/admin" : "/menu"} className="text-decoration-none d-flex align-items-center gap-2 me-4">
          <div className="ff-brand-icon">🍴</div>
          <span className="ff-brand-text">Fork<span>Flow</span></span>
        </Link>

        <div className="d-flex align-items-center gap-1 flex-grow-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`ff-nav-link nav-link d-flex align-items-center gap-2 ${isActive(l.to) ? "active" : ""}`}>
              <i className={`bi ${l.icon}`}></i>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="ff-theme-btn" onClick={() => dispatch(toggleTheme())} title="Toggle theme">
            <i className={`bi ${mode === "dark" ? "bi-sun" : "bi-moon"}`}></i>
          </button>
          <button className="btn btn-sm btn-outline-secondary fw-semibold" onClick={logout}>
            <i className="bi bi-box-arrow-right me-1"></i>Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;