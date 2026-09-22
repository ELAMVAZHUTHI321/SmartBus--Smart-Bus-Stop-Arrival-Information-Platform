import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, update, remove } from "./store.js";
import { uid } from "../utils/format.js";

const toDto = (s) => ({
  stopName: s.stopName,
  latitude: s.latitude == null ? null : Number(s.latitude),
  longitude: s.longitude == null ? null : Number(s.longitude),
  address: s.address || null,
});

export const stopService = {
  async list() {
    if (USE_MOCK) {
      await delay();
      return getAll("stops");
    }
    return httpRequest("/stops");
  },

  async getById(id) {
    if (USE_MOCK) {
      await delay();
      const stop = getById("stops", id);
      if (!stop) throw new Error("Stop not found.");
      return stop;
    }
    return httpRequest(`/stops/${id}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await delay();
      const stop = insert("stops", {
        id: uid("s"),
        ...toDto(data),
        createdAt: new Date().toISOString(),
      });
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "CREATE", entityType: "STOP", entityId: stop.id, createdAt: new Date().toISOString() });
      return stop;
    }
    return httpRequest("/stops", { method: "POST", body: JSON.stringify(toDto(data)) });
  },

  async update(id, data) {
    if (USE_MOCK) {
      await delay();
      const stop = update("stops", id, toDto(data));
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "UPDATE", entityType: "STOP", entityId: id, createdAt: new Date().toISOString() });
      return stop;
    }
    return httpRequest(`/stops/${id}`, { method: "PUT", body: JSON.stringify(toDto(data)) });
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay();
      remove("stops", id);
      return { ok: true };
    }
    return httpRequest(`/stops/${id}`, { method: "DELETE" });
  },

  async routesForStop(stopId) {
    if (USE_MOCK) {
      await delay();
      const rs = getAll("routeStops").filter((r) => r.stopId === stopId);
      const routeIds = [...new Set(rs.map((r) => r.routeId))];
      return getAll("routes").filter((r) => routeIds.includes(r.id));
    }
    return httpRequest(`/stops/${stopId}/routes`);
  },
};