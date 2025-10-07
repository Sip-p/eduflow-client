import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const backendUrl=import.meta.env.VITE_BACKEND_URL

const CourseChat = ({ courseId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user.id) {
  console.error("❌ User not found or missing _id in localStorage");
}
  // ✅ Initialize socket connection
  useEffect(() => {
    const newSocket = io(backendUrl, {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected! Socket ID:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("joinCourse", courseId);
    });

    newSocket.on("receiveMessage", (data) => {
      console.log("📩 Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [courseId]);

  // ✅ Fetch old messages once on mount
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const response = await axios.get(
         `${backendUrl}/api/messages/${courseId}`
        );
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };

    getAllMessages();
  }, [courseId]);

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
const handleSendMessage = (e) => {
  e.preventDefault();

  if (!inputMessage.trim()) return;

  const messageData = {
    courseId,
    user: {
      _id: user?.id,            // required by backend
      name: user?.name || "Anonymous",
      pic: user?.pic || "https://via.placeholder.com/40"
    },
    message: inputMessage.trim(),
  };

  socket.emit("sendMessage", messageData);
  setInputMessage("");
};




  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <h3 className="font-bold text-lg">Live Chat</h3>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <span>{isConnected ? "Connected" : "Connecting..."}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Be the first to say something!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-3">
               <img
  src={msg.user?.pic || "https://via.placeholder.com/40"}
  alt={msg.user?.name || "Anonymous"}
  className="w-10 h-10 rounded-full border-2 border-white shadow"
/>

                <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {msg.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">Reconnecting to chat...</p>
        )}
      </div>
    </div>
  );
};

export default CourseChat;
