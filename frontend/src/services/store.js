import {
  mockUsers,
  mockPassengers,
  mockOperators,
  mockBuses,
  mockRoutes,
  mockStops,
  mockRouteStops,
  mockSchedules,
  mockTrips,
  mockBusLocations,
  mockPredictions,
  mockFavoriteStops,
  mockFavoriteRoutes,
  mockNotifications,
  mockDelayReports,
  mockFeedback,
  mockAuditLogs,
} from "./mockData.js";

const seed = () => ({
  users: [...mockUsers],
  passengers: [...mockPassengers],
  operators: [...mockOperators],
  buses: [...mockBuses],
  routes: [...mockRoutes],
  stops: [...mockStops],
  routeStops: [...mockRouteStops],
  schedules: [...mockSchedules],
  trips: [...mockTrips],
  busLocations: [...mockBusLocations],
  predictions: [...mockPredictions],
  favoriteStops: [...mockFavoriteStops],
  favoriteRoutes: [...mockFavoriteRoutes],
  notifications: [...mockNotifications],
  delayReports: [...mockDelayReports],
  feedback: [...mockFeedback],
  auditLogs: [...mockAuditLogs],
});

let db = seed();

export function resetDb() {
  db = seed();
}

export function getAll(key) {
  return db[key] ?? [];
}

export function getById(key, id) {
  return getAll(key).find((r) => r.id === id);
}

export function insert(key, record) {
  db[key] = [...getAll(key), record];
  return record;
}

export function update(key, id, patch) {
  db[key] = getAll(key).map((r) => (r.id === id ? { ...r, ...patch } : r));
  return getById(key, id);
}

export function remove(key, id) {
  db[key] = getAll(key).filter((r) => r.id !== id);
}