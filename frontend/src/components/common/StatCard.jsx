import { cx } from "../../utils/format.js";

const accents = {
  emerald: "bg-emerald-100 text-emerald-600",
  brand: "bg-brand-100 text-brand-600",
  amber: "bg-amber-100 text-amber-600",
  violet: "bg-violet-100 text-violet-600",
  red: "bg-red-100 text-red-600",
};

export default function StatCard({ label, value, icon = "📊", accent = "brand", hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span className={cx("grid h-9 w-9 place-items-center rounded-xl text-lg", accents[accent])}>
          {icon}
        </span>
      </div>
      <div className="mt-2 text-3xl font-bold text-slate-800">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}