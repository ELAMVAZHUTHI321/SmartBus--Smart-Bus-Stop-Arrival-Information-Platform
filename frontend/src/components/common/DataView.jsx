import { useEffect, useMemo, useState } from "react";
import Card, { CardHeader, CardBody } from "./Card.jsx";
import Table from "./Table.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import { cx } from "../../utils/format.js";

export default function DataView({ title, subtitle, searchPlaceholder, fetchFn, columns, rows, onSearch }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchFn()
      .then((r) => mounted && setItems(r))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    if (onSearch) return onSearch(items, q);
    return items.filter((r) =>
      columns.some((c) => String(r[c.key] ?? c.default ?? "").toLowerCase().includes(q)),
    );
  }, [items, query, onSearch, columns]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="w-64">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={searchPlaceholder || "Filter…"}
            size="sm"
          />
        </div>
      </div>
      <Card>
        <CardHeader subtitle={`${filtered.length} records`} />
        <CardBody>
          <Table columns={columns} rows={filtered} empty={`No ${title.toLowerCase()} found.`} />
        </CardBody>
      </Card>
    </div>
  );
}