import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
const backendUrl=import.meta.env.VITE_BACKEND_URL

const socket = io(backendUrl); // backend URL

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
 
  // Load old notifications on mount
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/notifications`);
      setNotifications(res.data);
      console.log("Notifications-", res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for new notifications
    socket.on("courseNotification", (data) => {
      setNotifications((prev) => [data, ...prev]); // add new on top
    });

    return () => {
      socket.off("courseNotification");
    };
  }, []);

  // Helper to extract title and creator from message
  const getTitleAndCreator = (note) => {
    if (note.title && note.createdBy) {
      return { title: note.title, createdBy: note.createdBy };
    }

    // Fallback: parse string message like "New course created: holoj by Instructor"
    const regex = /New course created: (.+?) by (.+)/;
    const match = note.message?.match(regex);
    if (match) {
      return { title: match[1], createdBy: match[2] };
    }

    // Last fallback: show full message
    return { title: note.message, createdBy: "Unknown" };
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md">
      <h2 className="text-lg font-bold mb-2">🔔 Notifications</h2>
      <ul className="space-y-1 max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="text-gray-500">No notifications yet</li>
        ) : (
          notifications.map((note, idx) => {
            const { title, createdBy } = getTitleAndCreator(note);
            return (
              <li
                key={note._id || idx}
                className="bg-gray-100 px-3 py-2 rounded-lg shadow-sm"
              >
                <p className="font-medium text-gray-800">
                  📢 New course: <span className="text-blue-600">{title}</span>
                </p>
                <p className="text-sm text-gray-600">👤 Created by: {createdBy}</p>
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Notification;
