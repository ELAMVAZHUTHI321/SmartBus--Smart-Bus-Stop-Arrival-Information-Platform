import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { busService } from "../../services/busService.js";
import { routeService } from "../../services/routeService.js";
import { stopService } from "../../services/stopService.js";
import { cx } from "../../utils/format.js";

const TABS = [
  { key: "routes", label: "Routes" },
  { key: "buses", label: "Buses" },
  { key: "stops", label: "Stops" },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const tab = searchParams.get("t") || "routes";

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const [b, r, s] = await Promise.all([busService.list(), routeService.list(), stopService.list()]);
        const term = q.toLowerCase();
        const fBuses = b.filter((bus) => bus.busNumber.toLowerCase().includes(term) || bus.busType?.toLowerCase().includes(term));
        const fRoutes = r.filter((rt) => rt.routeName.toLowerCase().includes(term) || rt.source.toLowerCase().includes(term) || rt.destination.toLowerCase().includes(term));
        const fStops = s.filter((st) => st.stopName.toLowerCase().includes(term) || st.address?.toLowerCase().includes(term));
        if (!mounted) return;
        setBuses(fBuses);
        setRoutes(fRoutes);
        setStops(fStops);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [q]);

  const items = tab === "buses" ? buses : tab === "routes" ? routes : stops;
  const noResults = !loading && items.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Search SmartBus</h1>
        <p className="mt-1 text-sm text-slate-500">Find buses, routes and stops by name or keyword.</p>
      </div>

      <SearchBar initial={`:${q}`} size="lg" />

      <div className="flex gap-1 text-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSearchParams((p) => ({ q, t: t.key }), { replace: true })}
            className={cx(
              "rounded-full px-4 py-1.5 font-medium transition-colors",
              tab === t.key
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-brand-50",
            )}
          >
            {t.label} ({t.key === "buses" ? buses.length : t.key === "routes" ? routes.length : stops.length})
          </button>
        ))}
      </div>

      {loading && <PageLoader />}
      {noResults && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center text-sm text-slate-500">
          No {tab} found matching "{q}"
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {!loading &&
          items.map((item) => {
            if (tab === "buses") {
              return (
                <Link
                  key={item.id}
                  to={`/buses/${item.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">
                    🚌
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-800 group-hover:text-brand-600">{item.busNumber}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{item.busType} · capacity {item.capacity || "—"} · {item.status}</div>
                  </div>
                </Link>
              );
            }
            if (tab === "routes") {
              return (
                <Link
                  key={item.id}
                  to={`/routes/${item.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-2xl">
                    🗺️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-800 group-hover:text-brand-600">{item.routeName}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{item.source} → {item.destination}</div>
                  </div>
                </Link>
              );
            }
            return (
              <Link
                key={item.id}
                to={`/stops/${item.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-2xl">
                  📍
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-brand-600">{item.stopName}</div>
                  <div className="mt-0.5 truncate text-xs text-slate-500">{item.address}</div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}