import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardHeader } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Field, Input, Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { routeService } from "../../services/routeService.js";
import { ROUTE_STATUS } from "../../constants/index.js";
import { formatDate } from "../../utils/format.js";

const emptyForm = { routeName: "", source: "", destination: "", status: "ACTIVE" };

export default function RoutesPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setRoutes(await routeService.list());
  };

  useEffect(() => {
    load()
      .catch(() => toast.error("Could not load routes."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({ routeName: r.routeName, source: r.source, destination: r.destination, status: r.status });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, auditorId: user.id };
      if (editingId) {
        await routeService.update(editingId, payload);
        toast.success("Route updated.");
      } else {
        await routeService.create(payload);
        toast.success("Route created.");
      }
      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r) => {
    if (!confirm(`Delete route "${r.routeName}"?`)) return;
    await routeService.remove(r.id);
    toast.success("Route deleted.");
    await load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bus routes</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage the routes in your network.</p>
        </div>
        <Button onClick={openCreate}>+ Add route</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {routes.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold text-slate-800">{r.routeName}</span>
                <Badge value={r.status} />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>{r.source}</span>
                <span className="text-slate-300">──▶</span>
                <span>{r.destination}</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Added {formatDate(r.createdAt)}</div>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button onClick={() => openEdit(r)} className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50">Edit</button>
              <button onClick={() => remove(r)} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editingId ? "Edit route" : "Add new route"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editingId ? "Save changes" : "Add route"}</Button>
          </>
        }
      >
        <form id="route-form" onSubmit={save} className="space-y-4">
          <Field label="Route name">
            <Input value={form.routeName} onChange={(e) => setForm((f) => ({ ...f, routeName: e.target.value }))} placeholder="Green Line" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Source stop">
              <Input value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="Downtown Plaza" required />
            </Field>
            <Field label="Destination">
              <Input value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="City Park" required />
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              {Object.values(ROUTE_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}