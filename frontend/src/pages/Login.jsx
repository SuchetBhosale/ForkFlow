import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("import.meta.env.VITE_API_URL/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate(res.data.role === "admin" ? "/admin" : "/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ff-auth-wrap">
      <div className="ff-auth-card">
        <div className="text-center mb-4">
          <div className="ff-auth-icon">🍴</div>
          <h4 className="fw-800 mb-1" style={{ fontWeight: 800, letterSpacing: "-.3px" }}>Welcome back</h4>
          <p className="text-secondary small mb-0">Sign in to your ForkFlow account</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
            {loading
              ? <span className="spinner-border spinner-border-sm me-2" />
              : <i className="bi bi-box-arrow-in-right me-2"></i>}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-secondary small mt-3 mb-0">
          Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: "var(--ff-brand)" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;