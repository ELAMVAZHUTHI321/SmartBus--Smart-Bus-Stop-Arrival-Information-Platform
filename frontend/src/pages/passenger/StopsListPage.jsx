import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components/common/States.jsx";
import { stopService } from "../../services/stopService.js";

export default function StopsListPage() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    stopService
      .list()
      .then((s) => mounted && setStops(s))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bus stops</h1>
        <p className="mt-1 text-sm text-slate-500">All {stops.length} stops served by SmartBus.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {stops.map((s) => (
          <Link
            key={s.id}
            to={`/stops/${s.id}`}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-xl">📍</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-800 group-hover:text-brand-600">{s.stopName}</div>
              <div className="mt-0.5 truncate text-xs text-slate-500">{s.address}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}