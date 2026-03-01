import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const GroupChat = ({ courseId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const newSocket = io(backendUrl, { transports: ["websocket"], reconnection: true });
    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("joinCourse", courseId);
    });
    newSocket.on("receiveMessage", (data) => setMessages((prev) => [...prev, data]));
    newSocket.on("connect_error", () => setIsConnected(false));
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [courseId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/messages/${courseId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };
    fetchMessages();
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;
    socket.emit("sendMessage", {
      courseId,
      user: { _id: user?.id, name: user?.name || "Anonymous", pic: user?.pic || "" },
      message: inputMessage.trim(),
    });
    setInputMessage("");
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const formatTime = (ts) =>
    ts ? new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";

  const isOwnMessage = (msg) => msg.user?._id === user?.id || msg.user?.name === user?.name;

  return (
    <>
      <style>{`
        .gc-root {
          display: flex;
          flex-direction: column;
          height: 520px;
          background: #080810;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }

        /* Header */
        .gc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #0d1117;
          border-bottom: 1px solid #1e293b;
          flex-shrink: 0;
        }
        .gc-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gc-header-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .gc-header-title {
          font-size: 14px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: 0.01em;
        }
        .gc-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #475569;
        }
        .gc-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .gc-dot-on { background: #4ade80; box-shadow: 0 0 6px #4ade8088; }
        .gc-dot-off { background: #ef4444; }

        /* Messages area */
        .gc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #080810;
        }
        .gc-messages::-webkit-scrollbar { width: 4px; }
        .gc-messages::-webkit-scrollbar-track { background: transparent; }
        .gc-messages::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }

        /* Empty state */
        .gc-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #334155;
        }
        .gc-empty-icon { font-size: 32px; opacity: 0.4; }
        .gc-empty-text { font-size: 14px; color: #475569; }
        .gc-empty-sub { font-size: 12px; color: #334155; }

        /* Message row */
        .gc-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          animation: fadeUp 0.2s ease;
        }
        .gc-msg-row-own { flex-direction: row-reverse; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Avatar */
        .gc-avatar {
          width: 30px; height: 30px; min-width: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          overflow: hidden;
          flex-shrink: 0;
        }
        .gc-avatar img { width: 100%; height: 100%; object-fit: cover; }

        /* Bubble */
        .gc-bubble-wrap { display: flex; flex-direction: column; max-width: 65%; gap: 3px; }
        .gc-bubble-wrap-own { align-items: flex-end; }

        .gc-sender {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          padding: 0 4px;
        }
        .gc-sender-own { color: #6366f1; }

        .gc-bubble {
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.5;
          word-break: break-word;
        }
        .gc-bubble-other {
          background: #0f172a;
          color: #cbd5e1;
          border: 1px solid #1e293b;
          border-bottom-left-radius: 4px;
        }
        .gc-bubble-own {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .gc-time {
          font-size: 10px;
          color: #334155;
          padding: 0 4px;
        }

        /* Input area */
        .gc-input-area {
          padding: 14px 20px;
          background: #0d1117;
          border-top: 1px solid #1e293b;
          flex-shrink: 0;
        }
        .gc-input-form {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .gc-input {
          flex: 1;
          background: #080810;
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 10px 16px;
          color: #e2e8f0;
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          caret-color: #6366f1;
        }
        .gc-input::placeholder { color: #334155; }
        .gc-input:focus { border-color: #4f46e5; }
        .gc-input:disabled { opacity: 0.4; cursor: not-allowed; }

        .gc-send-btn {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.15s;
          font-size: 16px;
        }
        .gc-send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
        .gc-send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

        .gc-reconnect {
          font-size: 11px;
          color: #ef4444;
          margin-top: 6px;
          padding-left: 4px;
        }
      `}</style>

      <div className="gc-root">

        {/* Header */}
        <div className="gc-header">
          <div className="gc-header-left">
            <div className="gc-header-icon">💬</div>
            <span className="gc-header-title">Live Discussion</span>
          </div>
          <div className="gc-status">
            <div className={`gc-dot ${isConnected ? "gc-dot-on" : "gc-dot-off"}`} />
            {isConnected ? "Connected" : "Connecting..."}
          </div>
        </div>

        {/* Messages */}
        <div className="gc-messages">
          {messages.length === 0 ? (
            <div className="gc-empty">
              <div className="gc-empty-icon">💭</div>
              <p className="gc-empty-text">No messages yet</p>
              <p className="gc-empty-sub">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const own = isOwnMessage(msg);
              return (
                <div key={idx} className={`gc-msg-row ${own ? "gc-msg-row-own" : ""}`}>
                  {/* Avatar */}
                  <div className="gc-avatar">
                    {msg.user?.pic
                      ? <img src={msg.user.pic} alt="" />
                      : getInitials(msg.user?.name)}
                  </div>

                  {/* Bubble */}
                  <div className={`gc-bubble-wrap ${own ? "gc-bubble-wrap-own" : ""}`}>
                    <span className={`gc-sender ${own ? "gc-sender-own" : ""}`}>
                      {own ? "You" : msg.user?.name || "Anonymous"}
                    </span>
                    <div className={`gc-bubble ${own ? "gc-bubble-own" : "gc-bubble-other"}`}>
                      {msg.message}
                    </div>
                    <span className="gc-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="gc-input-area">
          <form className="gc-input-form" onSubmit={handleSend}>
            <input
              className="gc-input"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={!isConnected}
            />
            <button
              className="gc-send-btn"
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
            >
              ➤
            </button>
          </form>
          {!isConnected && (
            <p className="gc-reconnect">⚡ Reconnecting to chat...</p>
          )}
        </div>

      </div>
    </>
  );
};

export default GroupChat;