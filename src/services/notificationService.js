import api from "./api";

export const notificationService = {
  getAll: () =>
    api.get("/notifications").then((r) => r.data),

  markRead: (notifId) =>
    api.patch(`/notifications/${notifId}/read`).then((r) => r.data),

  markAllRead: () =>
    api.patch("/notifications/read-all").then((r) => r.data),

  delete: (notifId) =>
    api.delete(`/notifications/${notifId}`).then((r) => r.data),
};