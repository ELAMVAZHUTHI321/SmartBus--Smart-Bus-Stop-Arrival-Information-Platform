import DataView from "../../components/common/DataView.jsx";
import Badge from "../../components/common/Badge.jsx";
import { scheduleService } from "../../services/scheduleService.js";
import { formatTime } from "../../utils/format.js";

export default function ViewSchedulesPage() {
  return (
    <DataView
      title="Platform schedules"
      subtitle="Weekly schedules across every operator route."
      searchPlaceholder="Filter by route, bus or days…"
      fetchFn={scheduleService.list}
      onSearch={(items, q) =>
        items.filter((s) => [s.routeName, s.busName, s.days, s.routeId].some((v) => String(v || "").toLowerCase().includes(q)))
      }
      columns={[
        { key: "routeName", label: "Route", render: (s) => <span className="font-semibold text-slate-800">{s.routeName || "—"}</span> },
        { key: "busName", label: "Bus", render: (s) => <span className="text-xs text-slate-500">{s.busName || "—"}</span> },
        { key: "departureTime", label: "Departs", render: (s) => <span className="tabular-nums text-slate-700">{formatTime(s.departureTime)}</span> },
        { key: "arrivalTime", label: "Arrives", render: (s) => <span className="tabular-nums text-slate-700">{formatTime(s.arrivalTime)}</span> },
        { key: "days", label: "Days", render: (s) => <Badge value={s.days || "DAILY"} /> },
      ]}
    />
  );
}