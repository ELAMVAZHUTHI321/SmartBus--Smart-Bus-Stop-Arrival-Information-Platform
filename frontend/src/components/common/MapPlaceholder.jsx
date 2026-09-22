const marker = (filled) =>
  filled
    ? "h-3.5 w-3.5 rounded-full bg-brand-600 ring-4 ring-brand-600/20"
    : "h-3 w-3 rounded-full border-2 border-slate-300 bg-white";

export default function MapPlaceholder({ latitude, longitude, label }) {
  const tiles = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      tiles.push(<div key={`${r}-${c}`} className={marker(r === 2 && c === 3)} />);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-slate-50 to-brand-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-700">{label || "Location"}</div>
          <div className="text-xs text-slate-500">
            {typeof latitude === "number" ? latitude.toFixed(4) : latitude}°,{" "}
            {typeof longitude === "number" ? longitude.toFixed(4) : longitude}°
          </div>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 shadow-sm">
          Map preview
        </span>
      </div>
      <div className="grid grid-cols-6 gap-3 rounded-lg bg-white/70 p-3 shadow-inner">
        {tiles}
      </div>
    </div>
  );
}