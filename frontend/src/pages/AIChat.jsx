import axios from "axios";
import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:5000/api/ai/recommend";

const SUGGESTIONS = [
  "What's good for a light lunch?",
  "Suggest something spicy under Rs.200",
  "What are your vegetarian options?",
  "What's the most popular dish?",
];

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm Aria, your dining assistant. How can I help you today? 🍽️",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const trimmed = (text || query).trim();
    if (!trimmed || loading) return;

    setQuery("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        { query: trimmed },
        { timeout: 25000 }
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer },
      ]);
    } catch (err) {
      let errMsg = "Something went wrong. Please try again.";
      if (err.code === "ECONNABORTED") {
        errMsg = "Request timed out. Please try again.";
      } else if (!err.response) {
        errMsg = "Cannot reach the server. Is your backend running on port 5000?";
      } else if (err.response?.status === 429) {
        errMsg = "I'm a little busy right now. Please wait a moment and try again!";
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      setMessages((prev) => [
        ...prev,
        { role: "error", text: errMsg },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Hello! I'm Aria, your dining assistant. How can I help you today? 🍽️",
      },
    ]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .aria-root {
          min-height: 100vh;
          background: #0f0e0c;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'DM Sans', sans-serif;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(185,145,80,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 110%, rgba(185,100,60,0.08) 0%, transparent 60%);
        }

        .aria-window {
          width: 100%;
          max-width: 640px;
          background: #181714;
          border: 1px solid rgba(185,145,80,0.2);
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 32px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(185,145,80,0.05);
          display: flex;
          flex-direction: column;
          height: 680px;
        }

        /* ── Header ─────────────────────────────── */
        .aria-header {
          background: linear-gradient(135deg, #1e1b16 0%, #16130f 100%);
          border-bottom: 1px solid rgba(185,145,80,0.15);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .aria-header-left { display: flex; align-items: center; gap: 14px; }

        .aria-avatar {
          width: 46px; height: 46px;
          background: linear-gradient(135deg, #b99150, #7a5c28);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 16px rgba(185,145,80,0.3);
          flex-shrink: 0;
        }

        .aria-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #f0e4c8;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .aria-subtitle {
          font-size: 12px;
          color: #7a6e5c;
          margin-top: 2px;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .aria-status {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #6d9e6d; font-weight: 500;
        }

        .aria-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #6d9e6d;
          box-shadow: 0 0 6px #6d9e6d;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── Messages ───────────────────────────── */
        .aria-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          scrollbar-width: thin;
          scrollbar-color: rgba(185,145,80,0.2) transparent;
        }

        .aria-messages::-webkit-scrollbar { width: 4px; }
        .aria-messages::-webkit-scrollbar-thumb {
          background: rgba(185,145,80,0.2); border-radius: 4px;
        }

        .msg-row {
          display: flex;
          gap: 10px;
          animation: msg-in 0.25s ease;
        }
        .msg-row.user { flex-direction: row-reverse; }

        @keyframes msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .msg-icon {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0; margin-top: 2px;
        }

        .msg-icon.ai {
          background: linear-gradient(135deg, #b99150, #7a5c28);
          box-shadow: 0 2px 8px rgba(185,145,80,0.25);
        }

        .msg-icon.user-icon {
          background: #252219;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .msg-bubble {
          max-width: 78%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 400;
        }

        .msg-bubble.ai {
          background: #211e18;
          border: 1px solid rgba(185,145,80,0.12);
          color: #d4c8b0;
          border-bottom-left-radius: 4px;
        }

        .msg-bubble.user {
          background: linear-gradient(135deg, #b99150, #8a6a32);
          color: #fff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px rgba(185,145,80,0.2);
        }

        .msg-bubble.error {
          background: #2a1515;
          border: 1px solid rgba(220,80,80,0.25);
          color: #e08080;
          border-bottom-left-radius: 4px;
          font-size: 13px;
        }

        /* ── Typing indicator ───────────────────── */
        .typing-row {
          display: flex; gap: 10px; align-items: center;
          animation: msg-in 0.25s ease;
        }

        .typing-bubble {
          background: #211e18;
          border: 1px solid rgba(185,145,80,0.12);
          border-radius: 14px;
          border-bottom-left-radius: 4px;
          padding: 14px 18px;
          display: flex; gap: 5px; align-items: center;
        }

        .typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #b99150;
          animation: typing 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* ── Suggestions ────────────────────────── */
        .aria-suggestions {
          padding: 0 20px 12px;
          display: flex; flex-wrap: wrap; gap: 8px;
          flex-shrink: 0;
        }

        .suggestion-chip {
          background: transparent;
          border: 1px solid rgba(185,145,80,0.25);
          color: #9a8868;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .suggestion-chip:hover {
          background: rgba(185,145,80,0.1);
          border-color: rgba(185,145,80,0.5);
          color: #c4aa78;
        }

        /* ── Input area ─────────────────────────── */
        .aria-input-area {
          padding: 14px 20px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: #141210;
          flex-shrink: 0;
        }

        .aria-input-row {
          display: flex; gap: 10px; align-items: flex-end;
        }

        .aria-input {
          flex: 1;
          background: #201d18;
          border: 1px solid rgba(185,145,80,0.2);
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          color: #e8dcc8;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          resize: none;
          min-height: 46px;
          max-height: 120px;
          line-height: 1.5;
          transition: border-color 0.2s;
        }

        .aria-input::placeholder { color: #4a4236; }
        .aria-input:focus { border-color: rgba(185,145,80,0.45); }

        .aria-send-btn {
          width: 46px; height: 46px; flex-shrink: 0;
          background: linear-gradient(135deg, #b99150, #7a5c28);
          border: none;
          border-radius: 13px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(185,145,80,0.25);
        }

        .aria-send-btn:hover:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(185,145,80,0.4);
        }

        .aria-send-btn:disabled {
          background: #2a2520;
          cursor: not-allowed;
          box-shadow: none;
        }

        .aria-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 10px;
        }

        .aria-hint { font-size: 11px; color: #3d3830; }

        .clear-btn {
          background: none; border: none; color: #4a4236;
          font-size: 11px; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .clear-btn:hover { color: #b99150; }

        .header-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #9a8868;
          width: 34px; height: 34px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .header-btn:hover {
          background: rgba(185,145,80,0.15);
          border-color: rgba(185,145,80,0.35);
          color: #c4aa78;
        }

        .header-actions { display: flex; align-items: center; gap: 8px; }
      `}</style>

      <div className="aria-root">
        <div className="aria-window">

          {/* Header */}
          <div className="aria-header">
            <div className="aria-header-left">
              <div className="aria-avatar">🍽️</div>
              <div>
                <div className="aria-name">Aria</div>
                <div className="aria-subtitle">Hotel Dining Assistant</div>
              </div>
            </div>
            <div className="header-actions">
              <div className="aria-status">
                <div className="aria-dot" />
                Online
              </div>
              <button
                className="header-btn"
                onClick={() => window.history.back()}
                title="Close"
                style={{ fontSize: 18 }}
              >
                &#x2715;
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="aria-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role === "user" ? "user" : ""}`}>
                <div className={`msg-icon ${msg.role === "user" ? "user-icon" : "ai"}`}>
                  {msg.role === "user" ? "👤" : "✨"}
                </div>
                <div className={`msg-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="typing-row">
                <div className="msg-icon ai">✨</div>
                <div className="typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions — only show at the start */}
          {messages.length === 1 && !loading && (
            <div className="aria-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="aria-input-area">
            <div className="aria-input-row">
              <textarea
                ref={inputRef}
                className="aria-input"
                rows={1}
                placeholder="Ask about our menu, dishes, or get recommendations…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button
                className="aria-send-btn"
                onClick={() => send()}
                disabled={loading || !query.trim()}
                title="Send"
              >
                {loading ? "⏳" : "➤"}
              </button>
            </div>
            <div className="aria-footer">
              <span className="aria-hint">Enter to send · Shift+Enter for new line</span>
              <button className="clear-btn" onClick={clearChat}>Clear chat</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AIChat;