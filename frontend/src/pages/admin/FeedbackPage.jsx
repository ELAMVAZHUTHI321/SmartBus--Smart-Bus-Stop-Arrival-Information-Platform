import DataView from "../../components/common/DataView.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminService } from "../../services/adminService.js";
import { formatDateTime } from "../../utils/format.js";

function Stars({ n }) {
  return (
    <span className="text-amber-500" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(Math.max(0, Math.min(5, Math.round(n || 0))))}
      <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - Math.round(n || 0)))}</span>
    </span>
  );
}

export default function FeedbackPage() {
  return (
    <DataView
      title="Passenger feedback"
      subtitle="Ratings and comments left by passengers."
      searchPlaceholder="Filter by passenger or comment…"
      fetchFn={adminService.feedback}
      onSearch={(items, q) =>
        items.filter((f) => [f.passengerName, f.comment].some((v) => String(v || "").toLowerCase().includes(q)))
      }
      columns={[
        { key: "passengerName", label: "Passenger", render: (f) => <span className="font-semibold text-slate-800">{f.passengerName || "—"}</span> },
        { key: "rating", label: "Rating", render: (f) => <Stars n={f.rating} /> },
        { key: "comment", label: "Comment", render: (f) => <span className="text-xs text-slate-600">{f.comment || "—"}</span> },
        { key: "tripLabel", label: "Trip", render: (f) => <span className="text-xs text-slate-400">{f.tripLabel || "—"}</span> },
        { key: "createdAt", label: "Submitted", render: (f) => formatDateTime(f.createdAt) },
      ]}
    />
  );
}

export function cx_(){};