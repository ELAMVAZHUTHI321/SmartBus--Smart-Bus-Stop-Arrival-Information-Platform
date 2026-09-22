export function cx(...args) {
  return args.filter(Boolean).join(" ");
}

export function formatTime(datetime) {
  if (!datetime) return "—";
  const d = new Date(datetime);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatClock({ hour, minute }) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(datetime) {
  if (!datetime) return "—";
  return new Date(datetime).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(datetime) {
  if (!datetime) return "—";
  const d = new Date(datetime);
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} · ${formatTime(d)}`;
}

export function formatDistance(km) {
  if (km == null) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${Number(km).toFixed(1)} km`;
}

export function relativeMinutes(datetime) {
  if (!datetime) return null;
  const diff = Math.round((new Date(datetime) - Date.now()) / 60000);
  if (diff < 0) return "arrived";
  if (diff === 0) return "due now";
  return `in ${diff} min`;
}

export function confidenceLabel(score) {
  if (score == null) return "N/A";
  if (score >= 90) return "High";
  if (score >= 70) return "Moderate";
  return "Low";
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function weekdayLabel(days) {
  const map = {
    DAILY: "Every day",
    "MON-FRI": "Weekdays",
    WEEKEND: "Weekends",
  };
  return map[days] || days;
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}