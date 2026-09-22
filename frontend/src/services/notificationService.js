import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, update } from "./store.js";
import { uid } from "../utils/format.js";

export const notificationService = {
  async listForUser(userId) {
    if (USE_MOCK) {
      await delay();
      return getAll("notifications")
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return httpRequest(`/users/${userId}/notifications`);
  },

  async unreadCount(userId) {
    if (USE_MOCK) {
      await delay(120);
      return getAll("notifications").filter((n) => n.userId === userId && !n.isRead).length;
    }
    return httpRequest(`/users/${userId}/notifications/unread`);
  },

  async markRead(notificationId) {
    if (USE_MOCK) {
      await delay();
      return update("notifications", notificationId, { isRead: true });
    }
    return httpRequest(`/notifications/${notificationId}/read`, { method: "PATCH" });
  },

  async markAllRead(userId) {
    if (USE_MOCK) {
      await delay();
      getAll("notifications")
        .filter((n) => n.userId === userId && !n.isRead)
        .forEach((n) => update("notifications", n.id, { isRead: true }));
      return { ok: true };
    }
    return httpRequest(`/users/${userId}/notifications/read-all`, { method: "PATCH" });
  },

  async broadcast({ title, message, type }) {
    if (USE_MOCK) {
      await delay();
      const createdAt = new Date().toISOString();
      const created = getAll("users").map((u) =>
        insert("notifications", {
          id: uid("n"),
          userId: u.id,
          title,
          message,
          type: type || "SYSTEM",
          isRead: false,
          createdAt,
        }),
      );
      return created;
    }
    return httpRequest("/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify({ title, message, type }),
    });
  },
};