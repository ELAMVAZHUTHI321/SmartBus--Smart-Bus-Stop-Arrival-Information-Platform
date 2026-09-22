import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, getById, insert } from "./store.js";
import { uid } from "../utils/format.js";

function decorate(prediction) {
  const trip = getById("trips", prediction.tripId);
  const stop = getById("stops", prediction.stopId);
  return {
    ...prediction,
    busId: trip?.busId,
    busNumber: trip?.busId ? getById("buses", trip.busId)?.busNumber : null,
    routeId: trip?.routeId,
    routeName: trip?.routeId ? getById("routes", trip.routeId)?.routeName : null,
    stop: stop || null,
  };
}

export const predictionService = {
  async forTrip(tripId) {
    if (USE_MOCK) {
      await delay();
      return getAll("predictions").filter((p) => p.tripId === tripId).map(decorate);
    }
    return httpRequest(`/trips/${tripId}/predictions`);
  },

  async upcomingAtStop(stopId) {
    if (USE_MOCK) {
      await delay();
      const now = Date.now();
      return getAll("predictions")
        .filter((p) => p.stopId === stopId && new Date(p.predictedArrival).getTime() > now - 60000)
        .map(decorate)
        .sort((a, b) => new Date(a.predictedArrival) - new Date(b.predictedArrival));
    }
    return httpRequest(`/stops/${stopId}/arrivals`);
  },

  async generate(tripId, stopId, predictedArrival, confidenceScore) {
    if (USE_MOCK) {
      await delay();
      return insert("predictions", {
        id: uid("pr"),
        tripId,
        stopId,
        predictedArrival,
        predictionTime: new Date().toISOString(),
        confidenceScore: Number(confidenceScore),
      });
    }
    return httpRequest("/predictions", {
      method: "POST",
      body: JSON.stringify({ tripId, stopId, predictedArrival, confidenceScore }),
    });
  },
};