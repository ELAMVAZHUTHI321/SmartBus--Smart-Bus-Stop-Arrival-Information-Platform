import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cx } from "../../utils/format.js";

const tabs = [
  { key: "buses", label: "Buses" },
  { key: "routes", label: "Routes" },
  { key: "stops", label: "Stops" },
];

export default function SearchBar({ initial, size = "lg" }) {
  const [query, setQuery] = useState(initial ? initial.split(":")[1] ?? initial : "");
  const [active, setActive] = useState("routes");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}&t=${active}`);
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={cx(
          "flex items-center gap-2 rounded-2xl border border-slate-200 bg-white shadow-md",
          size === "lg" ? "p-2" : "p-1.5",
        )}
      >
        <span className={cx("pl-2 text-slate-400", size === "lg" ? "text-xl" : "text-base")}>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search buses, routes or stops…"
          className={cx(
            "flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none",
            size === "lg" ? "text-base" : "text-sm",
          )}
          aria-label="Search"
        />
        <button
          type="submit"
          className={cx(
            "shrink-0 rounded-xl bg-brand-600 font-semibold text-white hover:bg-brand-700",
            size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs",
          )}
        >
          Search
        </button>
      </div>
      {size === "lg" && (
        <div className="mt-3 flex gap-1 text-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={cx(
                "rounded-full px-4 py-1.5 font-medium transition-colors",
                active === t.key
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-brand-50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}