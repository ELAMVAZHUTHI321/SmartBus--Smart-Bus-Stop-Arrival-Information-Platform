import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card, { CardBody, CardHeader } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import MapPlaceholder from "../../components/common/MapPlaceholder.jsx";
import Table from "../../components/common/Table.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import { RouteBadge } from "../../components/arrivals/ArrivalCard.jsx";
import { busService } from "../../services/busService.js";
import { tripService } from "../../services/tripService.js";
import { scheduleService } from "../../services/scheduleService.js";
import { predictionService } from "../../services/predictionService.js";
import { routeService } from "../../services/routeService.js";
import { formatClock, weekdayLabel, formatTime, relativeMinutes } from "../../utils/format.js";

export default function BusDetailsPage() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [latestLoc, setLatestLoc] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [b, trips, scheds] = await Promise.all([
          busService.getById(id),
          tripService.list(),
          scheduleService.list(),
        ]);
        if (!mounted) return;
        setBus(b);
        setSchedules(scheds.filter((s) => s.busId === id));

        const active = trips.find((t) => t.busId === id && t.status === "ONGOING");
        if (active) {
          setTrip(active);
          const [routeStops, preds, locs] = await Promise.all([
            routeService.stopsForRoute(active.routeId),
            predictionService.forTrip(active.id),
            tripService.locationsForTrip(active.id),
          ]);
          if (!mounted) return;
          setStops(routeStops);
          setPredictions(preds);
          setLatestLoc(locs.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0]);
        }
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <PageLoader />;
  if (!bus) {
    return <EmptyState icon="🚌" title="Bus not found" description="This bus may have been removed." />;
  }

  const predictionMap = Object.fromEntries(predictions.map((p) => [p.stopId, p]));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link to="/search" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ‹ Back to search
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-2xl">🚌</div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{bus.busNumber}</h1>
              <Badge value={bus.status} />
            </div>
            <p className="text-sm text-slate-500">
              {bus.busType || "Standard"} · Capacity {bus.capacity ?? "—"} · Operated by {bus.operatorName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Live position"
            subtitle={trip ? `Trip ${trip.id} on ${trip.routeName}` : "Not on an active trip right now"}
          />
          <CardBody>
            {latestLoc ? (
              <MapPlaceholder
                latitude={latestLoc.latitude}
                longitude={latestLoc.longitude}
                label={`${bus.busNumber} · updated ${relativeMinutes(latestLoc.recordedAt)}`}
              />
            ) : (
              <EmptyState icon="📡" title="No live position available" description="Location is only broadcast while a trip is ongoing." />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Arrival predictions" subtitle={trip ? `Trip started at ${formatTime(trip.startTime)}` : "Schedules below apply"} />
          <CardBody>
            {trip && stops.length > 0 ? (
              <ol className="space-y-2">
                {stops.map((rs, i) => {
                  const p = predictionMap[rs.stopId];
                  const mins = p ? relativeMinutes(p.predictedArrival) : null;
                  return (
                    <li key={rs.stopId} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <Link to={`/stops/${rs.stopId}`} className="text-sm font-medium text-slate-700 hover:text-brand-600">
                          {rs.stop?.stopName}
                        </Link>
                      </div>
                      <div className="text-sm text-slate-600">
                        {p ? (
                          <span className="font-semibold text-brand-600">
                            {mins === "arrived" ? "Arrived" : mins}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <EmptyState icon="🚏" title="No upcoming trip" description="This bus currently has no ongoing journey to predict." />
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Schedules" subtitle={`${schedules.length} scheduled services for ${bus.busNumber}`} />
        <Table
          columns={[
            { key: "routeName", label: "Route", render: (r) => <RouteBadge routeName={r.routeName} /> },
            { key: "departureTime", label: "Departure", render: (r) => formatClock({ hour: +r.departureTime.split(":")[0], minute: +r.departureTime.split(":")[1] }) },
            { key: "arrivalTime", label: "Arrival", render: (r) => formatClock({ hour: +r.arrivalTime.split(":")[0], minute: +r.arrivalTime.split(":")[1] }) },
            { key: "days", label: "Days", render: (r) => weekdayLabel(r.days) },
          ]}
          rows={schedules}
          empty="No schedules configured for this bus."
        />
      </Card>
    </div>
  );
}