import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLES, ROLE_LABELS } from "../constants/index.js";
import { cx, initials } from "../utils/format.js";

const NAV = {
  [ROLES.PASSENGER]: [
    { to: "/", label: "Home", icon: "🏠", end: true },
    { to: "/search", label: "Search", icon: "🔍" },
    { to: "/favorites", label: "My Favorites", icon: "⭐" },
    { to: "/schedules", label: "Schedules", icon: "🕒" },
    { to: "/notifications", label: "Notifications", icon: "🔔" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ],
  [ROLES.OPERATOR]: [
    { to: "/operator", label: "Dashboard", icon: "📊", end: true },
    { to: "/operator/buses", label: "Buses", icon: "🚌" },
    { to: "/operator/routes", label: "Routes", icon: "🗺️" },
    { to: "/operator/stops", label: "Bus Stops", icon: "📍" },
    { to: "/operator/schedules", label: "Schedules", icon: "🕒" },
    { to: "/operator/trips", label: "Trips", icon: "🧭" },
    { to: "/operator/movement", label: "Bus Movement", icon: "📡" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/operators", label: "Operators", icon: "🏢" },
    { to: "/admin/buses", label: "Buses", icon: "🚌" },
    { to: "/admin/routes", label: "Routes", icon: "🗺️" },
    { to: "/admin/stops", label: "Bus Stops", icon: "📍" },
    { to: "/admin/schedules", label: "Schedules", icon: "🕒" },
    { to: "/admin/feedback", label: "Feedback", icon: "💬" },
    { to: "/admin/logs", label: "Audit Logs", icon: "🧾" },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const nav = user ? NAV[user.role] : [];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-200 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-xl">🚌</div>
          <div>
            <div className="text-base font-bold text-white">SmartBus</div>
            <div className="text-[11px] text-slate-400">Arrival Platform</div>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white lg:hidden" aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="rounded-xl bg-slate-800/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {initials(user?.name)}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{user?.name}</div>
                <div className="text-[11px] text-slate-400">{ROLE_LABELS[user?.role]}</div>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                )
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4 text-center text-[11px] text-slate-500">
          SmartBus © {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}