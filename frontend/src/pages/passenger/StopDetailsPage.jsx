import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardBody, CardHeader } from "../../components/common/Card.jsx";
import MapPlaceholder from "../../components/common/MapPlaceholder.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import ArrivalCard from "../../components/arrivals/ArrivalCard.jsx";
import { stopService } from "../../services/stopService.js";
import { predictionService } from "../../services/predictionService.js";
import { favoriteService } from "../../services/favoriteService.js";
import { formatTime } from "../../utils/format.js";

export default function StopDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const navigate = useNavigate();
  const [stop, setStop] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [favStops, setFavStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [s, routesAtStop, upcoming, favs] = await Promise.all([
      stopService.getById(id),
      stopService.routesForStop(id),
      predictionService.upcomingAtStop(id),
      favoriteService.listStops(user.id),
    ]);
    setStop(s);
    setRoutes(routesAtStop);
    setArrivals(upcoming);
    setFavStops(favs);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    load()
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    const timer = setInterval(() => load().catch(() => {}), 20000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [id, user.id]);

  const isFav = favStops.some((f) => f.stopId === id);

  const toggleFav = async () => {
    try {
      if (isFav) {
        await favoriteService.removeStop(user.id, id);
        toast.info("Removed from favorite stops.");
      } else {
        await favoriteService.addStop(user.id, id);
        toast.success("Added to favorite stops ⭐");
      }
      const favs = await favoriteService.listStops(user.id);
      setFavStops(favs);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;
  if (!stop) return <EmptyState icon="📍" title="Stop not found" description="This stop may have been removed." />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link to="/search" className="text-sm font-medium text-slate-500 hover:text-brand-600">
          ‹ Back to search
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-2xl">📍</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{stop.stopName}</h1>
              <p className="text-sm text-slate-500">
                {stop.address} · {stop.latitude.toFixed(4)}°, {stop.longitude.toFixed(4)}°
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title="Next arrivals"
              subtitle={`${arrivals.length} expected vehicles · auto-refreshes every 20s`}
            />
            <CardBody className="space-y-3">
              {arrivals.length === 0 ? (
                <EmptyState
                  icon="🕐"
                  title="No buses arriving soon"
                  description={`Check the schedule to see when the next service reaches ${stop.stopName}.`}
                />
              ) : (
                arrivals.map((p) => (
                  <ArrivalCard
                    key={p.id}
                    prediction={p}
                    onClick={() => p.busId && navigate(`/buses/${p.busId}`)}
                  />
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Routes serving this stop" subtitle={`${routes.length} routes`} />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {routes.map((r) => (
                  <Link
                    key={r.id}
                    to={`/routes/${r.id}`}
                    className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                  >
                    {r.routeName} <span className="font-normal text-brand-400">· {r.source}→{r.destination}</span>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader title="Location" subtitle="Map preview" />
            <CardBody>
              <MapPlaceholder latitude={stop.latitude} longitude={stop.longitude} label={stop.stopName} />
              <p className="mt-3 text-xs text-slate-400">
                Arrival times shown are AI predictions &nbsp;·&nbsp; last computed {formatTime(arrivals[0]?.predictionTime)}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}