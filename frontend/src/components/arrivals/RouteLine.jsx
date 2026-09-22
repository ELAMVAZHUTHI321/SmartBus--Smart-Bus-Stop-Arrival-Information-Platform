import { formatDistance } from "../../utils/format.js";

export default function RouteLine({ stops, activeStopId, onStopClick }) {
  return (
    <ol className="relative pl-6">
      <span className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200" />
      {stops.map((rs, i) => {
        const active = rs.stopId === activeStopId;
        const isLast = i === stops.length - 1;
        return (
          <li key={rs.id || rs.stopId} className="relative pb-5 last:pb-0">
            <span
              className={`absolute -left-[22px] top-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white ${
                active ? "bg-brand-600 ring-4 ring-brand-200" : "bg-slate-400"
              }`}
            >
              {i + 1}
            </span>
            <button
              onClick={() => onStopClick?.(rs.stop)}
              className={`block w-full rounded-xl px-3 py-2 text-left transition-colors ${
                active ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${active ? "text-brand-700" : "text-slate-700"}`}>
                  {rs.stop?.stopName || "Unknown stop"}
                </span>
                {!isLast && (
                  <span className="shrink-0 text-xs text-slate-400">{formatDistance(rs.distanceKm)}</span>
                )}
              </div>
              {rs.stop?.address && (
                <span className="mt-0.5 block text-xs text-slate-400">{rs.stop.address}</span>
              )}
            </button>
            {!isLast && (
              <span className="ml-3 mt-0.5 block text-[10px] font-medium uppercase tracking-wide text-slate-300">
                next stop →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}