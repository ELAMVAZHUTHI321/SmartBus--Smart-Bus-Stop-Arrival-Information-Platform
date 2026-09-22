import { cx } from "../../utils/format.js";

export function EmptyState({ icon = "🗺️", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20 text-brand-600">
      <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
      </svg>
    </div>
  );
}

export function cx_(...args) {
  return cx(...args);
}