import { formatTime, relativeMinutes, confidenceLabel } from "../../utils/format.js";

export function RouteBadge({ routeName, className }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-2 py-0.5 text-xs font-bold text-white ${className || ""}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
      {routeName}
    </span>
  );
}

export default function ArrivalCard({ prediction, onClick, onFavorite, isFavorite }) {
  const mins = relativeMinutes(prediction.predictedArrival);
  const arrived = mins === "arrived";
  const due = minutesValue(prediction.predictedArrival);

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">
          🚌
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">{prediction.busNumber}</span>
            <RouteBadge routeName={prediction.routeName} />
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            ETA {formatTime(prediction.predictedArrival)} · confidence {confidenceLabel(prediction.confidenceScore)}
            {prediction.confidenceScore != null && ` (${Math.round(prediction.confidenceScore)}%)`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className={`text-lg transition-transform hover:scale-125 ${isFavorite ? "" : "opacity-30 grayscale"}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            ⭐
          </button>
        )}
        <div className={`text-right ${arrived ? "text-slate-400" : "text-brand-600"}`}>
          <div className="text-xl font-extrabold tabular-nums">{arrived ? "Arrived" : due}</div>
          <div className="text-xs text-slate-400">{arrived ? "—" : mins}</div>
        </div>
      </div>
    </div>
  );
}

function minutesValue(datetime) {
  const diff = Math.round((new Date(datetime) - Date.now()) / 60000);
  return diff < 0 ? "" : `${diff}m`;
}