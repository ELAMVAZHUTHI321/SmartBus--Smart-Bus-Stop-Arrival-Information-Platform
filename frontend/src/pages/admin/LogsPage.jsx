import DataView from "../../components/common/DataView.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminService } from "../../services/adminService.js";
import { formatDateTime } from "../../utils/format.js";

export default function LogsPage() {
  return (
    <DataView
      title="Audit logs"
      subtitle="Every action captured for platform accountability."
      searchPlaceholder="Filter by actor or action…"
      fetchFn={adminService.auditLogs}
      onSearch={(items, q) =>
        items.filter((l) => [l.actorName, l.action, l.entityType].some((v) => String(v || "").toLowerCase().includes(q)))
      }
      columns={[
        { key: "actorName", label: "Actor", render: (l) => <span className="font-semibold text-slate-800">{l.actorName || "System"}</span> },
        { key: "action", label: "Action", render: (l) => <Badge value={l.action} /> },
        { key: "entityType", label: "Entity", render: (l) => <span className="text-xs text-slate-500">{l.entityType || "—"}</span> },
        { key: "entityId", label: "Entity ID", render: (l) => <span className="text-xs tabular-nums text-slate-400">{l.entityId || "—"}</span> },
        { key: "createdAt", label: "When", render: (l) => formatDateTime(l.createdAt) },
      ]}
    />
  );
}