import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import Card, { CardBody } from "../../components/common/Card.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import ArrivalCard from "../../components/arrivals/ArrivalCard.jsx";
import { favoriteService } from "../../services/favoriteService.js";
import { predictionService } from "../../services/predictionService.js";
import { greeting } from "../../utils/format.js";

export default function HomePage() {
  const { user } = useAuth();
  const [favStops, setFavStops] = useState([]);
  const [favRoutes, setFavRoutes] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [stops, routes] = await Promise.all([
          favoriteService.listStops(user.id),
          favoriteService.listRoutes(user.id),
        ]);
        if (!mounted) return;
        setFavStops(stops);
        setFavRoutes(routes);

        const upcoming = await Promise.all(
          stops.map((f) => predictionService.upcomingAtStop(f.stopId)),
        );
        const flat = upcoming
          .flat()
          .slice(0, 4)
          .sort((a, b) => new Date(a.predictedArrival) - new Date(b.predictedArrival));
        setArrivals(flat);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-medium text-brand-100">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          Where is your bus right now?
        </h1>
        <div className="mt-5 max-w-xl">
          <SearchBar size="lg" />
        </div>
      </section>

      {arrivals.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Next arrivals at your stops</h2>
            <Link to="/favorites" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              See all →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {arrivals.map((p) => (
              <ArrivalCard key={p.id} prediction={p} onClick={() => {}} />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">⭐ Favorite stops</h3>
              <Link to="/favorites" className="text-xs font-semibold text-brand-600">Manage</Link>
            </div>
            {favStops.length === 0 ? (
              <EmptyState icon="📍" title="No favorite stops yet" description="Find a stop and tap the star to save it for quick arrival checks." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {favStops.map((f) => (
                  <li key={f.id}>
                    <Link to={`/stops/${f.stopId}`} className="flex items-center justify-between py-2.5 text-sm hover:text-brand-600">
                      <span className="font-medium text-slate-700">{f.stop?.stopName}</span>
                      <span className="text-slate-400">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">⭐ Favorite routes</h3>
              <Link to="/favorites" className="text-xs font-semibold text-brand-600">Manage</Link>
            </div>
            {favRoutes.length === 0 ? (
              <EmptyState icon="🗺️" title="No favorite routes yet" description="Star a route to track its full schedule quickly." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {favRoutes.map((f) => (
                  <li key={f.id}>
                    <Link to={`/routes/${f.routeId}`} className="flex items-center justify-between py-2.5 text-sm hover:text-brand-600">
                      <span className="font-medium text-slate-700">{f.route?.routeName}</span>
                      <span className="text-slate-400">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { to: "/schedules", icon: "🕒", title: "View schedules", desc: "Departure & arrival times" },
          { to: "/search", icon: "🚌", title: "Find a bus", desc: "Search by number or route" },
          { to: "/stops", icon: "📍", title: "Browse stops", desc: "Find stops near you" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <div className="text-2xl">{c.icon}</div>
            <div className="mt-2 text-sm font-semibold text-slate-800 group-hover:text-brand-600">{c.title}</div>
            <div className="mt-0.5 text-xs text-slate-500">{c.desc}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}