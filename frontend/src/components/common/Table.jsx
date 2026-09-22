import { cx } from "../../utils/format.js";

export default function Table({ columns, rows, keyFn = (r) => r.id, onRowClick, empty }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cx("px-4 py-3 font-semibold", c.className)}>
                {c.label}
              </th>
            ))}
            {onRowClick && <th className="w-8 px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (onRowClick ? 1 : 0)} className="px-4 py-10 text-center text-slate-400">
                {empty || "No records found."}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={keyFn(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cx("bg-white align-middle", onRowClick && "cursor-pointer transition-colors hover:bg-brand-50/50")}
            >
              {columns.map((c) => (
                <td key={c.key} className={cx("px-4 py-3 text-slate-700", c.cellClassName)}>
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </td>
              ))}
              {onRowClick && <td className="px-2 text-right text-slate-300">›</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}