import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardHeader } from "../../components/common/Card.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Field, Input } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { stopService } from "../../services/stopService.js";
import { formatDate } from "../../utils/format.js";

const emptyForm = { stopName: "", latitude: "", longitude: "", address: "" };

export default function StopsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setStops(await stopService.list());
  };

  useEffect(() => {
    load()
      .catch(() => toast.error("Could not load stops."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({ stopName: s.stopName, latitude: s.latitude, longitude: s.longitude, address: s.address || "" });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude), auditorId: user.id };
      if (editingId) {
        await stopService.update(editingId, payload);
        toast.success("Stop updated.");
      } else {
        await stopService.create(payload);
        toast.success("Stop added.");
      }
      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!confirm(`Delete stop "${s.stopName}"?`)) return;
    await stopService.remove(s.id);
    toast.success("Stop deleted.");
    await load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bus stops</h1>
          <p className="mt-1 text-sm text-slate-500">Add and maintain stops across the city.</p>
        </div>
        <Button onClick={openCreate}>+ Add stop</Button>
      </div>

      <Card>
        <CardHeader title="Stops" subtitle={`${stops.length} locations`} />
        <Table
          columns={[
            { key: "stopName", label: "Name", render: (s) => <span className="font-semibold text-slate-800">{s.stopName}</span> },
            { key: "latitude", label: "Latitude", render: (s) => s.latitude.toFixed(4) },
            { key: "longitude", label: "Longitude", render: (s) => s.longitude.toFixed(4) },
            { key: "address", label: "Address", render: (s) => s.address || "—" },
            { key: "_actions", label: "Actions", render: (s) => (
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(s)} className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50">Edit</button>
                  <button onClick={() => remove(s)} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              ) },
          ]}
          rows={stops}
          empty="No stops yet — add your first location."
        />
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editingId ? "Edit stop" : "Add new stop"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editingId ? "Save changes" : "Add stop"}</Button>
          </>
        }
      >
        <form id="stop-form" onSubmit={save} className="space-y-4">
          <Field label="Stop name">
            <Input value={form.stopName} onChange={(e) => setForm((f) => ({ ...f, stopName: e.target.value }))} placeholder="Central Station" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude">
              <Input type="number" step="any" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} placeholder="35.6895" required />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="any" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} placeholder="139.6917" required />
            </Field>
          </div>
          <Field label="Address" hint="Street name or notable landmark">
            <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="1 Chuo-dori, Central District" />
          </Field>
        </form>
      </Modal>
    </div>
  );
}