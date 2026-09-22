import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card, { CardBody, CardHeader } from "../../components/common/Card.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { busService } from "../../services/busService.js";
import { routeService } from "../../services/routeService.js";
import { stopService } from "../../services/stopService.js";
import { scheduleService } from "../../services/scheduleService.js";
import { tripService } from "../../services/tripService.js";
import { formatTime, formatDate } from "../../utils/format.js";

export default function OperatorDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [buses, routes, stops, schedules, trips] = await Promise.all([
        busService.list(),
        routeService.list(),
        stopService.list(),
        scheduleService.list(),
        tripService.list(),
      ]);
      if (!mounted) return;
      setData({ buses, routes, stops, schedules, trips });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!data) return <PageLoader />;

  const ongoing = data.trips.filter((t) => t.status === "ONGOING");
  const today = data.trips.filter((t) => t.tripDate === new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operator dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your fleet, network, schedules and trips.</p>
        </div>
        <Link to="/operator/movement" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
          📡 Record bus movement
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Buses" value={data.buses.length} icon="🚌" accent="brand" hint={`${data.buses.filter((b) => b.status === "ACTIVE").length} active`} />
        <StatCard label="Routes" value={data.routes.length} icon="🗺️" accent="violet" hint={`${data.routes.filter((r) => r.status === "ACTIVE").length} active`} />
        <StatCard label="Stops" value={data.stops.length} icon="📍" accent="emerald" />
        <StatCard label="Schedules" value={data.schedules.length} icon="🕒" accent="amber" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Ongoing trips" subtitle={`${ongoing.length} buses on the road now`} />
          <CardBody>
            <ul className="divide-y divide-slate-100">
              {ongoing.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">{t.busNumber}</span>
                    <span className="ml-2 text-slate-400">{t.routeName}</span>
                  </div>
                  <span className="text-xs text-slate-400">started {formatDate(t.startTime)} {formatTime(t.startTime)}</span>
                </li>
              ))}
              {ongoing.length === 0 && <li className="py-4 text-center text-sm text-slate-400">No trips ongoing.</li>}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Today’s activity" subtitle={`${today.length} trips today`} />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-brand-50 p-4">
                <div className="text-2xl font-bold text-brand-700">{today.length}</div>
                <div className="text-xs font-medium uppercase tracking-wide text-brand-500">Trips today</div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="text-2xl font-bold text-emerald-700">{ongoing.length}</div>
                <div className="text-xs font-medium uppercase tracking-wide text-emerald-600">Ongoing</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent trips" subtitle="Latest status of every trip" />
        <Table
          columns={[
            { key: "id", label: "Trip", render: (t) => <span className="font-mono text-xs">#{t.id.toUpperCase()}</span> },
            { key: "busNumber", label: "Bus" },
            { key: "routeName", label: "Route" },
            { key: "tripDate", label: "Date", render: (t) => formatDate(t.tripDate) },
            { key: "status", label: "Status", render: (t) => <Badge value={t.status} /> },
            { key: "startTime", label: "Started", render: (t) => (t.startTime ? formatTime(t.startTime) : "—") },
          ]}
          rows={data.trips}
        />
      </Card>
    </div>
  );
}