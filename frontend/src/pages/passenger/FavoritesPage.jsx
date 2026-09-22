import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Card, { CardHeader, CardBody } from "../../components/common/Card.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import { favoriteService } from "../../services/favoriteService.js";
import { predictionService } from "../../services/predictionService.js";
import { relativeMinutes } from "../../utils/format.js";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [arrivalMap, setArrivalMap] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [s, r] = await Promise.all([favoriteService.listStops(user.id), favoriteService.listRoutes(user.id)]);
    setStops(s);
    setRoutes(r);

    const map = {};
    await Promise.all(
      s.map(async (f) => {
        const up = await predictionService.upcomingAtStop(f.stopId);
        map[f.stopId] = up[0] || null;
      }),
    );
    setArrivalMap(map);
  };

  useEffect(() => {
    let mounted = true;
    load()
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [user.id]);

  const removeStop = async (stopId) => {
    await favoriteService.removeStop(user.id, stopId);
    const [s, r] = await Promise.all([favoriteService.listStops(user.id), favoriteService.listRoutes(user.id)]);
    setStops(s);
    setRoutes(r);
  };

  const removeRoute = async (routeId) => {
    await favoriteService.removeRoute(user.id, routeId);
    const r = await favoriteService.listRoutes(user.id);
    setRoutes(r);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My favorites</h1>
        <p className="mt-1 text-sm text-slate-500">Quick access to the stops and routes you care about most.</p>
      </div>

      <Card>
        <CardHeader title="⭐ Favorite stops" subtitle={`${stops.length} saved stops`} />
        <CardBody>
          {stops.length === 0 ? (
            <EmptyState
              icon="📍"
              title="No favorite stops"
              description="Visit a stop page and press ☆ Add to favorites to keep it handy."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {stops.map((f) => {
                const next = arrivalMap[f.stopId] || null;
                return (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-3">
                    <Link to={`/stops/${f.stopId}`} className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-700 hover:text-brand-600">{f.stop?.stopName}</div>
                      <div className="text-xs text-slate-400">{f.stop?.address}</div>
                    </Link>
                    <div className="shrink-0 text-right">
                      {next ? (
                        <>
                          <div className="text-sm font-bold text-brand-600">
                            {relativeMinutes(next.predictedArrival)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {next.busNumber} · {next.routeName}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400">No buses soon</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeStop(f.stopId)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                      title="Remove from favorites"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="⭐ Favorite routes" subtitle={`${routes.length} saved routes`} />
        <CardBody>
          {routes.length === 0 ? (
            <EmptyState
              icon="🗺️"
              title="No favorite routes"
              description="Star a route from its details page to track schedules faster."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {routes.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 py-3">
                  <Link to={`/routes/${f.routeId}`} className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-700 hover:text-brand-600">{f.route?.routeName}</div>
                    <div className="text-xs text-slate-400">{f.route?.source} → {f.route?.destination}</div>
                  </Link>
                  <button
                    onClick={() => removeRoute(f.routeId)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500"
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}