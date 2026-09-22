import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, update, remove } from "./store.js";
import { uid } from "../utils/format.js";

function decorate(trip) {
  const bus = getById("buses", trip.busId);
  const route = getById("routes", trip.routeId);
  return {
    ...trip,
    busNumber: bus?.busNumber || "—",
    routeName: route?.routeName || "—",
  };
}

const toDto = (t) => ({
  busId: t.busId,
  routeId: t.routeId,
  scheduleId: t.scheduleId || null,
  tripDate: t.tripDate,
  startTime: t.startTime || null,
  endTime: t.endTime || null,
  status: t.status,
});

export const tripService = {
  async list() {
    if (USE_MOCK) {
      await delay();
      return getAll("trips").map(decorate);
    }
    return httpRequest("/trips");
  },

  async getById(id) {
    if (USE_MOCK) {
      await delay();
      const trip = getById("trips", id);
      if (!trip) throw new Error("Trip not found.");
      return decorate(trip);
    }
    return httpRequest(`/trips/${id}`);
  },

  async create(data) {
    if (USE_MOCK) {
      await delay();
      const trip = insert("trips", {
        id: uid("t"),
        ...toDto({ ...data, status: data.status || "SCHEDULED" }),
      });
      insert("auditLogs", { id: uid("al"), userId: data.auditorId || null, action: "CREATE", entityType: "TRIP", entityId: trip.id, createdAt: new Date().toISOString() });
      return decorate(trip);
    }
    return httpRequest("/trips", { method: "POST", body: JSON.stringify(toDto(data)) });
  },

  async updateStatus(id, status) {
    if (USE_MOCK) {
      await delay();
      const trip = getById("trips", id);
      if (!trip) throw new Error("Trip not found.");
      const patch = { status };
      if (status === "ONGOING" && !trip.startTime) patch.startTime = new Date().toISOString();
      if (["COMPLETED", "CANCELLED"].includes(status)) patch.endTime = new Date().toISOString();
      const updated = update("trips", id, patch);
      return decorate(updated);
    }
    return httpRequest(`/trips/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay();
      remove("trips", id);
      return { ok: true };
    }
    return httpRequest(`/trips/${id}`, { method: "DELETE" });
  },

  async locationsForTrip(tripId) {
    if (USE_MOCK) {
      await delay();
      return getAll("busLocations").filter((l) => l.tripId === tripId);
    }
    return httpRequest(`/trips/${tripId}/locations`);
  },

  async recordLocation(tripId, { latitude, longitude }) {
    if (USE_MOCK) {
      await delay();
      const loc = insert("busLocations", {
        id: uid("l"),
        tripId,
        latitude: Number(latitude),
        longitude: Number(longitude),
        recordedAt: new Date().toISOString(),
      });
      return loc;
    }
    return httpRequest(`/trips/${tripId}/locations`, {
      method: "POST",
      body: JSON.stringify({ latitude, longitude }),
    });
  },
};