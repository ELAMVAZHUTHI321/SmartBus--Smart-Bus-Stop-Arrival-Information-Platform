import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, update, remove } from "./store.js";
import { uid } from "../utils/format.js";

function decorate(schedule) {
  const route = getById("routes", schedule.routeId);
  const bus = getById("buses", schedule.busId);
  return {
    ...schedule,
    routeName: route?.routeName || "Unknown route",
    busNumber: bus?.busNumber || "Unknown bus",
  };
}

const toDto = (s) => ({
  routeId: s.routeId,
  busId: s.busId,
  departureTime: s.departureTime,
  arrivalTime: s.arrivalTime,
  days: s.days,
});

export const scheduleService = {
  async list() {
    if (USE_MOCK) {
      await delay();
      return getAll("schedules").map(decorate);
    }
    return httpRequest("/schedules");
  },

  async create(data) {
    if (USE_MOCK) {
      await delay();
      const schedule = insert("schedules", {
        id: uid("sc"),
        ...toDto(data),
      });
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "CREATE", entityType: "SCHEDULE", entityId: schedule.id, createdAt: new Date().toISOString() });
      return decorate(schedule);
    }
    return httpRequest("/schedules", { method: "POST", body: JSON.stringify(toDto(data)) });
  },

  async update(id, data) {
    if (USE_MOCK) {
      await delay();
      const schedule = update("schedules", id, toDto(data));
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "UPDATE", entityType: "SCHEDULE", entityId: id, createdAt: new Date().toISOString() });
      return decorate(schedule);
    }
    return httpRequest(`/schedules/${id}`, { method: "PUT", body: JSON.stringify(toDto(data)) });
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay();
      remove("schedules", id);
      return { ok: true };
    }
    return httpRequest(`/schedules/${id}`, { method: "DELETE" });
  },

  async forRoute(routeId) {
    if (USE_MOCK) {
      await delay();
      return getAll("schedules").filter((s) => s.routeId === routeId).map(decorate);
    }
    return httpRequest(`/routes/${routeId}/schedules`);
  },
};