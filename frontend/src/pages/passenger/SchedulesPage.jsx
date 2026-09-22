import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card, { CardHeader, CardBody } from "../../components/common/Card.jsx";
import Table from "../../components/common/Table.jsx";
import { Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { RouteBadge } from "../../components/arrivals/ArrivalCard.jsx";
import { scheduleService } from "../../services/scheduleService.js";
import { routeService } from "../../services/routeService.js";
import { formatClock, weekdayLabel } from "../../utils/format.js";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, r] = await Promise.all([scheduleService.list(), routeService.list()]);
        if (!mounted) return;
        setSchedules(s);
        setRoutes(r);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const shown = filter === "all" ? schedules : schedules.filter((s) => s.routeId === filter);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Service schedules</h1>
          <p className="mt-1 text-sm text-slate-500">Planned departures and arrivals for every route.</p>
        </div>
        <div className="w-56">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Route</span>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All routes</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>{r.routeName}</option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader title="Departures" subtitle={`${shown.length} scheduled services`} />
          <Table
            columns={[
              { key: "routeName", label: "Route", render: (r) => <RouteBadge routeName={r.routeName} /> },
              { key: "busNumber", label: "Bus", render: (r) => <Link to={`/buses/${r.busId}`} className="font-semibold text-brand-600 hover:text-brand-700">{r.busNumber}</Link> },
              { key: "departureTime", label: "Departure", render: (r) => formatClock({ hour: +r.departureTime.split(":")[0], minute: +r.departureTime.split(":")[1] }) },
              { key: "arrivalTime", label: "Arrival", render: (r) => formatClock({ hour: +r.arrivalTime.split(":")[0], minute: +r.arrivalTime.split(":")[1] }) },
              { key: "days", label: "Days", render: (r) => weekdayLabel(r.days) },
            ]}
            rows={shown}
            empty="No schedules match this filter."
          />
        </Card>
      )}

      <Card>
        <CardBody className="text-xs text-slate-400">
          💡 Arrival predictions may differ from scheduled times due to live traffic conditions. The AI
          prediction engine uses history from arrival_history to refine estimates.
        </CardBody>
      </Card>
    </div>
  );
}