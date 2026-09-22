import DataView from "../../components/common/DataView.jsx";
import Badge from "../../components/common/Badge.jsx";
import { routeService } from "../../services/routeService.js";
import { formatDate } from "../../utils/format.js";

export default function ViewRoutesPage() {
  return (
    <DataView
      title="Platform routes"
      subtitle="Every route registered across all operators."
      searchPlaceholder="Filter by route name or stop…"
      fetchFn={routeService.list}
      columns={[
        { key: "routeName", label: "Route", render: (r) => <span className="font-semibold text-slate-800">{r.routeName}</span> },
        { key: "source", label: "Source", render: (r) => { const from = r.stops?.[0]; return from?.stopName || r.source || "—"; } },
        { key: "destination", label: "Destination", render: (r) => { const to = r.stops?.[r.stops.length - 1]; return to?.stopName || r.destination || "—"; } },
        { key: "status", label: "Status", render: (r) => <Badge value={r.status} /> },
        { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
      ]}
    />
  );
}