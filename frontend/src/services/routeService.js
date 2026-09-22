import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, update, remove } from "./store.js";
import { uid } from "../utils/format.js";

const toDto = (r) => ({
  routeName: r.routeName,
  source: r.source,
  destination: r.destination,
  status: r.status,
});

export const routeService = {
  async list() {
    if (USE_MOCK) {
      await delay();
      return getAll("routes");
    }
    return httpRequest("/routes");
  },

  async getById(id) {
    if (USE_MOCK) {
      await delay();
      const route = getById("routes", id);
      if (!route) throw new Error("Route not found.");
      return route;
    }
    return httpRequest(`/routes/${id}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await delay();
      if (getAll("routes").some((r) => r.routeName === data.routeName)) {
        throw new Error(`Route "${data.routeName}" already exists.`);
      }
      const route = insert("routes", {
        id: uid("r"),
        ...toDto(data),
        createdAt: new Date().toISOString(),
      });
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "CREATE", entityType: "ROUTE", entityId: route.id, createdAt: new Date().toISOString() });
      return route;
    }
    return httpRequest("/routes", { method: "POST", body: JSON.stringify(toDto(data)) });
  },

  async update(id, data) {
    if (USE_MOCK) {
      await delay();
      const route = update("routes", id, toDto(data));
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "UPDATE", entityType: "ROUTE", entityId: id, createdAt: new Date().toISOString() });
      return route;
    }
    return httpRequest(`/routes/${id}`, { method: "PUT", body: JSON.stringify(toDto(data)) });
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay();
      remove("routes", id);
      return { ok: true };
    }
    return httpRequest(`/routes/${id}`, { method: "DELETE" });
  },

  async stopsForRoute(routeId) {
    if (USE_MOCK) {
      await delay();
      return getAll("routeStops")
        .filter((rs) => rs.routeId === routeId)
        .sort((a, b) => a.stopOrder - b.stopOrder)
        .map((rs) => {
          const stop = getById("stops", rs.stopId);
          return { ...rs, stop: stop || null };
        });
    }
    return httpRequest(`/routes/${routeId}/stops`);
  },
};