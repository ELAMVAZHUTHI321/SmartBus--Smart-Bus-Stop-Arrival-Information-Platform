import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-2xl">🚌</div>
          <div>
            <div className="text-lg font-bold">SmartBus</div>
            <div className="text-xs text-slate-400">Smart Bus Stop Arrival Platform</div>
          </div>
        </div>
        <div>
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Know exactly when your bus arrives.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Real-time arrival predictions, reliable schedules and delay alerts for every stop — for
            passengers, operators and platform administrators.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            {["🚍 Live predictions", "🗺️ Route maps", "⭐ Favorites", "🔔 Alerts"].map((t) => (
              <span key={t} className="rounded-full bg-slate-800 px-3 py-1.5 text-slate-200">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="text-xs text-slate-500">© {new Date().getFullYear()} SmartBus · React + Vite</div>
      </div>

      <main className="flex flex-1 items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md">
          {user && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You are already signed in.
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}