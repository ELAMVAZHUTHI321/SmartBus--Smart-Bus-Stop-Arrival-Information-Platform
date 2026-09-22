import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { cx } from "../utils/format.js";

const ToastContext = createContext(null);

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++counter;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
      push,
    }),
    [push],
  );

  const tones = {
    success: "border-emerald-400/60 bg-emerald-50 text-emerald-800",
    error: "border-red-400/60 bg-red-50 text-red-800",
    info: "border-brand-400/60 bg-brand-50 text-brand-800",
  };
  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cx(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg animate-[slidein_.2s_ease-out]",
              tones[t.type],
            )}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/70 text-xs">
              {icons[t.type]}
            </span>
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-1 text-xs opacity-50 hover:opacity-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}