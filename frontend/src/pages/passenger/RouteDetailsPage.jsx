import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardBody, CardHeader } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import RouteLine from "../../components/arrivals/RouteLine.jsx";
import { routeService } from "../../services/routeService.js";
import { busService } from "../../services/busService.js";
import { scheduleService } from "../../services/scheduleService.js";
import { favoriteService } from "../../services/favoriteService.js";
import { formatClock, weekdayLabel } from "../../utils/format.js";

export default function RouteDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [route, setRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [r, rs, bs, sc, favRoutes] = await Promise.all([
          routeService.getById(id),
          routeService.stopsForRoute(id),
          busService.byRoute(id),
          scheduleService.forRoute(id),
          favoriteService.listRoutes(user.id),
        ]);
        if (!mounted) return;
        setRoute(r);
        setStops(rs);
        setBuses(bs);
        setSchedules(sc);
        setIsFav(favRoutes.some((f) => f.routeId === id));
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, user.id]);

  const toggleFav = async () => {
    try {
      if (isFav) {
        await favoriteService.removeRoute(user.id, id);
        toast.info("Removed from favorite routes.");
      } else {
        await favoriteService.addRoute(user.id, id);
        toast.success("Added to favorite routes ⭐");
      }
      setIsFav((v) => !v);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;
  if (!route) {
    return <EmptyState icon="🗺️" title="Route not found" description="This route may have been removed." />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link to="/search" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ‹ Back to search
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-2xl">🗺️</div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{route.routeName}</h1>
                <Badge value={route.status} />
              </div>
              <p className="text-sm text-slate-500">
                {route.source} → {route.destination}
              </p>
            </div>
          </div>
          <button
            onClick={toggleFav}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-amber-300"
          >
            {isFav ? "⭐ Favorited" : "☆ Add to favorites"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Stops on this route" subtitle={`${stops.length} stops in order`} />
          <CardBody>
            <RouteLine stops={stops} />
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Buses serving this route" subtitle={`${buses.length} assigned vehicles`} />
            <CardBody>
              {buses.length === 0 ? (
                <EmptyState icon="🚌" title="No buses assigned" />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {buses.map((b) => (
                    <li key={b.id}>
                      <Link to={`/buses/${b.id}`} className="flex items-center justify-between py-2.5 text-sm hover:text-brand-600">
                        <span className="flex items-center gap-2">
                          <span>🚌</span>
                          <span className="font-medium text-slate-700">{b.busNumber}</span>
                          <Badge value={b.status} />
                        </span>
                        <span className="text-slate-400">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Fare & trip summary" subtitle="Quick glance" />
            <CardBody className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Total distance</div>
                <div className="font-semibold text-slate-800">
                  {stops.length ? `${(+stops[stops.length - 1].distanceKm || 0).toFixed(1)} km` : "—"}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Stops</div>
                <div className="font-semibold text-slate-800">{stops.length}</div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Schedule" subtitle={`${schedules.length} departures configured`} />
        <Table
          columns={[
            { key: "busNumber", label: "Bus" },
            { key: "departureTime", label: "Departure", render: (r) => formatClock({ hour: +r.departureTime.split(":")[0], minute: +r.departureTime.split(":")[1] }) },
            { key: "arrivalTime", label: "Arrival", render: (r) => formatClock({ hour: +r.arrivalTime.split(":")[0], minute: +r.arrivalTime.split(":")[1] }) },
            { key: "days", label: "Days", render: (r) => weekdayLabel(r.days) },
          ]}
          rows={schedules}
          empty="No schedules configured for this route."
        />
      </Card>
    </div>
  );
}