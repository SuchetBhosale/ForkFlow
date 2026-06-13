import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/ai/recommend`;
const SUGGESTIONS = [
  "What's good for a light lunch?",
  "Suggest something spicy under Rs.200",
  "What are your vegetarian options?",
  "What's the most popular dish?",
];

function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm Aria, your dining assistant. How can I help you today? 🍽️" },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const trimmed = (text || query).trim();
    if (!trimmed || loading) return;
    setQuery("");
    setMessages((p) => [...p, { role: "user", text: trimmed }]);
    setLoading(true);
    try {
      const res = await axios.post(API_URL, { query: trimmed }, { timeout: 25000 });
      setMessages((p) => [...p, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      let msg = "Something went wrong. Please try again.";
      if (err.code === "ECONNABORTED") msg = "Request timed out. Please try again.";
      else if (!err.response) msg = "Cannot reach the server. Is your backend running?";
      else if (err.response?.status === 429) msg = "AI is busy. Please wait a moment.";
      else if (err.response?.data?.message) msg = err.response.data.message;
      setMessages((p) => [...p, { role: "error", text: msg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const clearChat = () => setMessages([{ role: "assistant", text: "Hello! I'm Aria, your dining assistant. How can I help you today? 🍽️" }]);

  return (
    <div className="ff-page">
      <div className="ff-page-inner" style={{ maxWidth: 760 }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <button className="btn btn-outline-secondary btn-sm fw-semibold" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-1"></i>Back
          </button>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, var(--ff-brand), var(--ff-brand-dark))",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              boxShadow: "0 3px 10px rgba(var(--ff-brand-rgb),.3)"
            }}>✨</div>
            <div>
              <p className="fw-bold mb-0" style={{ fontSize: 15 }}>Aria</p>
              <p className="mb-0 d-flex align-items-center gap-1" style={{ fontSize: 12, color: "#198754" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#198754", display: "inline-block" }}></span>
                Online
              </p>
            </div>
          </div>
          <button className="btn btn-outline-secondary btn-sm fw-semibold ms-auto" onClick={clearChat}>
            <i className="bi bi-arrow-counterclockwise me-1"></i>Clear
          </button>
        </div>

        <div className="ff-chat-wrap">
          <div className="ff-chat-msgs">
            {messages.map((msg, i) => (
              <div key={i} className={`d-flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role !== "user" && (
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0, marginTop: 2,
                    background: msg.role === "error" ? "rgba(220,53,69,.1)" : "linear-gradient(135deg, var(--ff-brand), var(--ff-brand-dark))",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>
                    {msg.role === "error" ? "⚠️" : "✨"}
                  </div>
                )}
                <div className={`ff-bubble ${msg.role}`}>{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="d-flex gap-2 align-items-center">
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "linear-gradient(135deg, var(--ff-brand), var(--ff-brand-dark))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
                }}>✨</div>
                <div className="ff-bubble ai d-flex gap-1 align-items-center ff-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && !loading && (
            <div className="d-flex flex-wrap gap-2 px-3 pb-3">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="ff-chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="px-3 pb-3 pt-2 border-top d-flex gap-2 align-items-end">
            <textarea
              ref={inputRef}
              className="form-control"
              rows={1}
              placeholder="Ask about our menu, dishes, or get recommendations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              style={{ resize: "none", minHeight: 44 }}
            />
            <button
              className="btn btn-brand fw-semibold flex-shrink-0"
              style={{ height: 44, padding: "0 18px" }}
              onClick={() => send()}
              disabled={loading || !query.trim()}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm" />
                : <i className="bi bi-send-fill"></i>}
            </button>
          </div>
        </div>

        <p className="text-center text-secondary mt-2" style={{ fontSize: 11 }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default AIChat;