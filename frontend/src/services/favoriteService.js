import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert, remove } from "./store.js";
import { uid } from "../utils/format.js";

const passengerId = (userId) =>
  getAll("passengers").find((p) => p.userId === userId)?.id;

export const favoriteService = {
  async listStops(userId) {
    if (USE_MOCK) {
      await delay();
      const pid = passengerId(userId);
      if (!pid) return [];
      return getAll("favoriteStops")
        .filter((f) => f.passengerId === pid)
        .map((f) => ({ ...f, stop: getById("stops", f.stopId) || null }));
    }
    return httpRequest(`/users/${userId}/favorites/stops`);
  },

  async listRoutes(userId) {
    if (USE_MOCK) {
      await delay();
      const pid = passengerId(userId);
      if (!pid) return [];
      return getAll("favoriteRoutes")
        .filter((f) => f.passengerId === pid)
        .map((f) => ({ ...f, route: getById("routes", f.routeId) || null }));
    }
    return httpRequest(`/users/${userId}/favorites/routes`);
  },

  async addStop(userId, stopId) {
    if (USE_MOCK) {
      await delay();
      const pid = passengerId(userId);
      if (!pid) throw new Error("Passenger profile not found.");
      const exists = getAll("favoriteStops").some(
        (f) => f.passengerId === pid && f.stopId === stopId,
      );
      if (exists) return { alreadyFavorite: true };
      return insert("favoriteStops", {
        id: uid("f"),
        passengerId: pid,
        stopId,
        createdAt: new Date().toISOString(),
      });
    }
    return httpRequest(`/users/${userId}/favorites/stops`, {
      method: "POST",
      body: JSON.stringify({ stopId }),
    });
  },

  async removeStop(userId, stopId) {
    if (USE_MOCK) {
      await delay();
      const pid = passengerId(userId);
      const fav = getAll("favoriteStops").find(
        (f) => f.passengerId === pid && f.stopId === stopId,
      );
      if (fav) remove("favoriteStops", fav.id);
      return { ok: true };
    }
    return httpRequest(`/users/${userId}/favorites/stops/${stopId}`, { method: "DELETE" });
  },

  async addRoute(userId, routeId) {
    if (USE_MOCK) {
      await delay();
      const pid = passengerId(userId);
      if (!pid) throw new Error("Passenger profile not found.");
      const exists = getAll("favoriteRoutes").some(
        (f) => f.passengerId === pid && f.routeId === routeId,
      );
      if (exists) return { alreadyFavorite: true };
      return insert("favoriteRoutes", {
        id: uid("fr"),
        passengerId: pid,
        routeId,
        createdAt: new Date().toISOString(),
      });
    }
    return httpRequest(`/users/${userId}/favorites/routes`, {
      method: "POST",
      body: JSON.stringify({ routeId }),
    });
  },

  async removeRoute(userId, routeId) {
    if (USE_MOCK) {
      await delay();
      const pid = passengerId(userId);
      const fav = getAll("favoriteRoutes").find(
        (f) => f.passengerId === pid && f.routeId === routeId,
      );
      if (fav) remove("favoriteRoutes", fav.id);
      return { ok: true };
    }
    return httpRequest(`/users/${userId}/favorites/routes/${routeId}`, { method: "DELETE" });
  },
};