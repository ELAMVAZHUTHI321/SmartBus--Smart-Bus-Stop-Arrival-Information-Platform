import DataView from "../../components/common/DataView.jsx";
import Badge from "../../components/common/Badge.jsx";
import { stopService } from "../../services/stopService.js";
import { cx, formatDate } from "../../utils/format.js";

export default function ViewStopsPage() {
  return (
    <DataView
      title="Bus stops"
      subtitle="Every stop registered across the platform."
      searchPlaceholder="Filter by stop name, zone or address…"
      fetchFn={stopService.list}
      onSearch={(items, q) =>
        items.filter((s) => [s.stopName, s.zone, s.address, s.city].some((v) => String(v || "").toLowerCase().includes(q)))
      }
      columns={[
        { key: "stopName", label: "Stop", render: (s) => <span className="font-semibold text-slate-800">{s.stopName}</span> },
        { key: "zone", label: "Zone", render: (s) => <Badge value={s.zone || "UNK"} /> },
        { key: "address", label: "Address", render: (s) => <span className="text-xs text-slate-500">{s.address || "—"}</span> },
        { key: "city", label: "City", render: (s) => <span className="text-xs text-slate-500">{s.city || "—"}</span> },
        {
          key: "coords",
          label: "Coordinates",
          render: (s) => (
            <span className="tabular-nums text-xs text-slate-500">
              {s.latitude?.toFixed?.(4) ?? "—"}, {s.longitude?.toFixed?.(4) ?? "—"}
            </span>
          ),
        },
        { key: "createdAt", label: "Created", render: (s) => formatDate(s.createdAt) },
      ]}
    />
  );
}

export function cx_(){return cx;}