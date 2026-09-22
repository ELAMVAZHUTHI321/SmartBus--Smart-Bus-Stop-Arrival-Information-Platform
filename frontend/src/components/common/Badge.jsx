import { cx } from "../../utils/format.js";

const tones = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-100 text-slate-600",
  blue: "bg-brand-100 text-brand-700",
  violet: "bg-violet-100 text-violet-700",
};

const statusMap = {
  ACTIVE: { label: "Active", tone: "emerald" },
  INACTIVE: { label: "Inactive", tone: "slate" },
  MAINTENANCE: { label: "Maintenance", tone: "amber" },
  ONGOING: { label: "Ongoing", tone: "blue" },
  SCHEDULED: { label: "Scheduled", tone: "violet" },
  COMPLETED: { label: "Completed", tone: "emerald" },
  CANCELLED: { label: "Cancelled", tone: "red" },
  PASSENGER: { label: "Passenger", tone: "blue" },
  OPERATOR: { label: "Operator", tone: "violet" },
  ADMIN: { label: "Admin", tone: "slate" },
  INFO: { label: "Info", tone: "blue" },
  ALERT: { label: "Alert", tone: "red" },
  REMINDER: { label: "Reminder", tone: "amber" },
  SYSTEM: { label: "System", tone: "slate" },
};

export default function Badge({ value, label, tone, className }) {
  const resolved = statusMap[value];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone || resolved?.tone || "slate"],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label || resolved?.label || value}
    </span>
  );
}