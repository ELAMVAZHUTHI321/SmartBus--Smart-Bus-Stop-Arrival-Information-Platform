import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { notificationService } from "../services/notificationService.js";
import { ROLES, ROLE_LABELS } from "../constants/index.js";
import { initials } from "../utils/format.js";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isPassenger = user?.role === ROLES.PASSENGER;

  useEffect(() => {
    if (!isPassenger || !user) return;
    let mounted = true;
    const load = async () => {
      try {
        const count = await notificationService.unreadCount(user.id);
        if (mounted) setUnread(count);
      } catch {
        /* ignore */
      }
    };
    load();
    const timer = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [isPassenger, user]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const go = (href) => {
    setMenuOpen(false);
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-6">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="hidden text-slate-400 sm:inline">Welcome back,</span>
        <span className="font-semibold text-slate-700">{user?.name?.split(" ")[0]}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isPassenger && (
          <button
            onClick={() => navigate("/search")}
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600 sm:flex"
          >
            🔍 Search buses, routes, stops
          </button>
        )}
        {isPassenger && (
          <button
            onClick={() => navigate("/notifications")}
            className="relative grid h-9 w-9 place-items-center rounded-lg text-lg text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100"
            aria-label="Account menu"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {initials(user?.name)}
            </span>
            <span className="hidden text-sm font-semibold text-slate-700 md:block">
              {ROLE_LABELS[user?.role]}
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
              <div className="p-1.5">
                {isPassenger && (
                  <button onClick={() => go("/profile")} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                    👤 My profile
                  </button>
                )}
                {isPassenger && (
                  <button onClick={() => go("/favorites")} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                    ⭐ Favorites
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  ⏻ Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}