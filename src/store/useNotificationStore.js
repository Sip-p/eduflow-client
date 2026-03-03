import { create } from "zustand";
import { notificationService } from "../services/notificationService";

export const useNotificationStore = create((set, get) => ({
  // ── State ──
  notifications: [],
  unreadCount:   0,
  loading:       false,

  // ── Actions ──
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const data = await notificationService.getAll();
      const unread = data.notifications.filter((n) => !n.read).length;
      set({ notifications: data.notifications, unreadCount: unread, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  markRead: async (notifId) => {
    try {
      await notificationService.markRead(notifId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notifId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (e) {
      console.error("Mark read failed:", e.message);
    }
  },

  markAllRead: async () => {
    try {
      await notificationService.markAllRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (e) {
      console.error("Mark all read failed:", e.message);
    }
  },

  // Called from Socket.io when new notification arrives
  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
}));