import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("import.meta.env.VITE_API_URL/api/users/register", { name, email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ff-auth-wrap">
      <div className="ff-auth-card">
        <div className="text-center mb-4">
          <div className="ff-auth-icon">🍴</div>
          <h4 className="mb-1" style={{ fontWeight: 800, letterSpacing: "-.3px" }}>Create account</h4>
          <p className="text-secondary small mb-0">Join ForkFlow today</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" placeholder="Your full name"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Create a password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
            {loading
              ? <span className="spinner-border spinner-border-sm me-2" />
              : <i className="bi bi-person-plus me-2"></i>}
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-secondary small mt-3 mb-0">
          Already have an account? <Link to="/" className="text-decoration-none fw-semibold" style={{ color: "var(--ff-brand)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;