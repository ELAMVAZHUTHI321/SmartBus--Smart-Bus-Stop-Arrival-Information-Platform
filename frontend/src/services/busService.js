import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, update, remove } from "./store.js";
import { uid } from "../utils/format.js";

function decorate(bus) {
  const operator = getById("operators", bus.operatorId);
  return { ...bus, operatorName: operator?.organizationName || "Unknown operator" };
}

const toDto = (bus) => ({
  busNumber: bus.busNumber,
  busType: bus.busType,
  capacity: bus.capacity == null ? null : Number(bus.capacity),
  status: bus.status,
  operatorId: bus.operatorId,
});

export const busService = {
  async list() {
    if (USE_MOCK) {
      await delay();
      return getAll("buses").map(decorate);
    }
    return httpRequest("/buses");
  },

  async getById(id) {
    if (USE_MOCK) {
      await delay();
      const bus = getById("buses", id);
      if (!bus) throw new Error("Bus not found.");
      return decorate(bus);
    }
    return httpRequest(`/buses/${id}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await delay();
      if (getAll("buses").some((b) => b.busNumber === data.busNumber)) {
        throw new Error(`Bus ${data.busNumber} already exists.`);
      }
      const bus = insert("buses", {
        id: uid("b"),
        ...toDto(data),
        operatorId: data.operatorId || "op1",
        createdAt: new Date().toISOString(),
      });
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "CREATE", entityType: "BUS", entityId: bus.id, createdAt: new Date().toISOString() });
      return decorate(bus);
    }
    return httpRequest("/buses", { method: "POST", body: JSON.stringify(toDto(data)) });
  },

  async update(id, data) {
    if (USE_MOCK) {
      await delay();
      if (
        getAll("buses").some((b) => b.busNumber === data.busNumber && b.id !== id)
      ) {
        throw new Error(`Bus ${data.busNumber} already exists.`);
      }
      const bus = update("buses", id, toDto(data));
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "UPDATE", entityType: "BUS", entityId: id, createdAt: new Date().toISOString() });
      return decorate(bus);
    }
    return httpRequest(`/buses/${id}`, { method: "PUT", body: JSON.stringify(toDto(data)) });
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay();
      remove("buses", id);
      return { ok: true };
    }
    return httpRequest(`/buses/${id}`, { method: "DELETE" });
  },

  async byRoute(routeId) {
    if (USE_MOCK) {
      await delay();
      const schedule = getAll("schedules").filter((s) => s.routeId === routeId);
      const busIds = [...new Set(schedule.map((s) => s.busId))];
      return getAll("buses").filter((b) => busIds.includes(b.id)).map(decorate);
    }
    return httpRequest(`/routes/${routeId}/buses`);
  },
};