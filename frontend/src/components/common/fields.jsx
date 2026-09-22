import { cx } from "../../utils/format.js";

const base =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-shadow";

const tones = {
  normal: "border-slate-300 focus:border-brand-500 focus:ring-brand-100",
  error: "border-red-400 focus:border-red-500 focus:ring-red-100",
};

export function Field({ label, error, hint, children, className }) {
  return (
    <label className={cx("block", className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

export function Input({ error, className, ...props }) {
  return <input className={cx(base, tones[error ? "error" : "normal"], className)} {...props} />;
}

export function Textarea({ error, className, ...props }) {
  return (
    <textarea className={cx(base, tones[error ? "error" : "normal"], "min-h-24 resize-y", className)} {...props} />
  );
}

export function Select({ error, className, children, ...props }) {
  return (
    <select className={cx(base, tones[error ? "error" : "normal"], "cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}