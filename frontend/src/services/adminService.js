import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, update, insert } from "./store.js";
import { uid } from "../utils/format.js";

function operatorWithCounts(op) {
  const user = getById("users", op.userId);
  return {
    ...op,
    user: user ? { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active } : null,
    busCount: getAll("buses").filter((b) => b.operatorId === op.id).length,
    routeCount: getAll("schedules").filter((s) => getAll("buses").find((b) => b.id === s.busId)?.operatorId === op.id).length > 0 ? getAll("routes").length : 0,
  };
}

export const adminService = {
  async stats() {
    if (USE_MOCK) {
      await delay();
      const now = new Date();
      const todayIso = now.toISOString().slice(0, 10);
      return {
        users: getAll("users").length,
        passengers: getAll("passengers").length,
        operators: getAll("operators").length,
        admins: getAll("users").filter((u) => u.role === "ADMIN").length,
        buses: getAll("buses").length,
        activeBuses: getAll("buses").filter((b) => b.status === "ACTIVE").length,
        routes: getAll("routes").length,
        activeRoutes: getAll("routes").filter((r) => r.status === "ACTIVE").length,
        stops: getAll("stops").length,
        schedules: getAll("schedules").length,
        tripsToday: getAll("trips").filter((t) => t.tripDate === todayIso).length,
        ongoingTrips: getAll("trips").filter((t) => t.status === "ONGOING").length,
        feedback: getAll("feedback").length,
        delayReports: getAll("delayReports").length,
        notifications: getAll("notifications").length,
        avgRating: getAll("feedback").length
          ? getAll("feedback").reduce((a, f) => a + f.rating, 0) / getAll("feedback").length
          : 0,
      };
    }
    return httpRequest("/admin/stats");
  },

  async listUsers() {
    if (USE_MOCK) {
      await delay();
      return getAll("users").map(({ password, ...u }) => u);
    }
    return httpRequest("/admin/users");
  },

  async updateUser(userId, patch) {
    if (USE_MOCK) {
      await delay();
      const updated = update("users", userId, {
        name: patch.name,
        email: patch.email,
        role: patch.role,
        active: patch.active,
      });
      insert("auditLogs", { id: uid("al"), userId: patch.auditorId || null, action: "UPDATE", entityType: "USER", entityId: userId, createdAt: new Date().toISOString() });
      const { password, ...safe } = updated;
      return safe;
    }
    return httpRequest(`/admin/users/${userId}`, { method: "PUT", body: JSON.stringify(patch) });
  },

  async listOperators() {
    if (USE_MOCK) {
      await delay();
      return getAll("operators").map(operatorWithCounts);
    }
    return httpRequest("/admin/operators");
  },

  async createOperator({ name, email, password, organizationName, contactNumber, auditorId }) {
    if (USE_MOCK) {
      await delay();
      const createdAt = new Date().toISOString();
      if (getAll("users").some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("A user with this email already exists.");
      }
      const user = insert("users", {
        id: uid("u"),
        name,
        email,
        password: password || "password",
        role: "OPERATOR",
        active: true,
        phone: contactNumber || null,
        createdAt,
      });
      const op = insert("operators", {
        id: uid("op"),
        userId: user.id,
        organizationName,
        contactNumber: contactNumber || null,
        createdAt,
      });
      insert("auditLogs", { id: uid("al"), userId: auditorId || null, action: "CREATE", entityType: "OPERATOR", entityId: op.id, createdAt });
      return operatorWithCounts(op);
    }
    return httpRequest("/admin/operators", { method: "POST", body: JSON.stringify({ name, email, password, organizationName, contactNumber }) });
  },

  async auditLogs() {
    if (USE_MOCK) {
      await delay();
      return getAll("auditLogs")
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((l) => {
          const user = l.userId ? getById("users", l.userId) : null;
          return { ...l, actorName: user?.name || "System" };
        });
    }
    return httpRequest("/admin/audit-logs");
  },

  async feedback() {
    if (USE_MOCK) {
      await delay();
      return getAll("feedback")
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((f) => ({
          ...f,
          passengerName: f.passengerId ? getById("users", getById("passengers", f.passengerId)?.userId)?.name : "—",
          tripLabel: f.tripId ? `${getById("buses", getById("trips", f.tripId)?.busId)?.busNumber || ""} ${getById("routes", getById("trips", f.tripId)?.routeId)?.routeName || ""}`.trim() : "—",
        }));
    }
    return httpRequest("/admin/feedback");
  },

  async delayReports() {
    if (USE_MOCK) {
      await delay();
      return getAll("delayReports");
    }
    return httpRequest("/admin/delay-reports");
  },
};