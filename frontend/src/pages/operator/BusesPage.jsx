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
import { busService } from "../../services/busService.js";
import { BUS_STATUS, BUS_TYPES } from "../../constants/index.js";
import { formatDate } from "../../utils/format.js";

const emptyForm = { busNumber: "", busType: "City Express", capacity: "", status: "ACTIVE" };

export default function BusesPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const list = await busService.list();
    setBuses(list);
  };

  useEffect(() => {
    load()
      .catch(() => toast.error("Could not load buses."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (bus) => {
    setEditingId(bus.id);
    setForm({ busNumber: bus.busNumber, busType: bus.busType || "", capacity: bus.capacity ?? "", status: bus.status });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, capacity: form.capacity ? Number(form.capacity) : null, auditorId: user.id };
      if (editingId) {
        await busService.update(editingId, payload);
        toast.success("Bus updated.");
      } else {
        await busService.create(payload);
        toast.success("Bus added.");
      }
      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (bus) => {
    if (!confirm(`Delete bus ${bus.busNumber}? This cannot be undone.`)) return;
    await busService.remove(bus.id);
    toast.success("Bus deleted.");
    await load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage your buses</h1>
          <p className="mt-1 text-sm text-slate-500">Add, update and track vehicles in your fleet.</p>
        </div>
        <Button onClick={openCreate}>+ Add bus</Button>
      </div>

      <Card>
        <CardHeader title="Fleet" subtitle={`${buses.length} vehicles`} />
        <Table
          columns={[
            { key: "busNumber", label: "Number", render: (b) => <span className="font-bold text-slate-800">{b.busNumber}</span> },
            { key: "busType", label: "Type" },
            { key: "capacity", label: "Capacity", render: (b) => b.capacity ?? "—" },
            { key: "status", label: "Status", render: (b) => <Badge value={b.status} /> },
            { key: "createdAt", label: "Added", render: (b) => formatDate(b.createdAt) },
            {
              key: "_actions",
              label: "Actions",
              render: (b) => (
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(b)} className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50">Edit</button>
                  <button onClick={() => remove(b)} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              ),
            },
          ]}
          rows={buses}
          empty="No buses yet — add your first vehicle."
        />
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editingId ? "Edit bus" : "Add new bus"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editingId ? "Save changes" : "Add bus"}</Button>
          </>
        }
      >
        <form id="bus-form" onSubmit={save} className="space-y-4">
          <Field label="Bus number" hint="Unique vehicle identifier">
            <Input value={form.busNumber} onChange={(e) => setForm((f) => ({ ...f, busNumber: e.target.value }))} placeholder="MC-101" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bus type">
              <Select value={form.busType} onChange={(e) => setForm((f) => ({ ...f, busType: e.target.value }))}>
                {BUS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Capacity">
              <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} placeholder="45" />
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              {Object.values(BUS_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}