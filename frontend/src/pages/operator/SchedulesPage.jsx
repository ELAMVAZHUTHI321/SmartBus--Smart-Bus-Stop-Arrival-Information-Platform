import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardHeader } from "../../components/common/Card.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Field, Input, Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { scheduleService } from "../../services/scheduleService.js";
import { busService } from "../../services/busService.js";
import { routeService } from "../../services/routeService.js";
import { DAY_OPTIONS } from "../../constants/index.js";
import { formatClock, weekdayLabel } from "../../utils/format.js";

const emptyForm = { routeId: "", busId: "", departureTime: "07:00", arrivalTime: "07:40", days: "DAILY" };

export default function SchedulesPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [s, r, b] = await Promise.all([scheduleService.list(), routeService.list(), busService.list()]);
    setSchedules(s);
    setRoutes(r);
    setBuses(b);
  };

  useEffect(() => {
    load()
      .catch(() => toast.error("Could not load schedules."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, routeId: routes[0]?.id || "" });
    setModal(true);
  };

  const openEdit = (sc) => {
    setEditingId(sc.id);
    setForm({ routeId: sc.routeId, busId: sc.busId, departureTime: sc.departureTime, arrivalTime: sc.arrivalTime, days: sc.days });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, auditorId: user.id };
      if (editingId) {
        await scheduleService.update(editingId, payload);
        toast.success("Schedule updated.");
      } else {
        await scheduleService.create(payload);
        toast.success("Schedule added.");
      }
      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (sc) => {
    if (!confirm("Delete this schedule entry?")) return;
    await scheduleService.remove(sc.id);
    toast.success("Schedule deleted.");
    await load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Schedules</h1>
          <p className="mt-1 text-sm text-slate-500">Configure departure and arrival times per bus and route.</p>
        </div>
        <Button onClick={openCreate}>+ Add schedule</Button>
      </div>

      <Card>
        <CardHeader title="Service timetable" subtitle={`${schedules.length} schedule entries`} />
        <Table
          columns={[
            { key: "routeName", label: "Route" },
            { key: "busNumber", label: "Bus" },
            { key: "departureTime", label: "Departure", render: (r) => formatClock({ hour: +r.departureTime.split(":")[0], minute: +r.departureTime.split(":")[1] }) },
            { key: "arrivalTime", label: "Arrival", render: (r) => formatClock({ hour: +r.arrivalTime.split(":")[0], minute: +r.arrivalTime.split(":")[1] }) },
            { key: "days", label: "Days", render: (r) => weekdayLabel(r.days) },
            { key: "_actions", label: "Actions", render: (sc) => (
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(sc)} className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50">Edit</button>
                  <button onClick={() => remove(sc)} className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              ) },
          ]}
          rows={schedules}
          empty="No schedules yet — add your first departure."
        />
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editingId ? "Edit schedule" : "Add new schedule"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editingId ? "Save changes" : "Add schedule"}</Button>
          </>
        }
      >
        <form id="schedule-form" onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Route">
              <Select value={form.routeId} onChange={(e) => setForm((f) => ({ ...f, routeId: e.target.value }))}>
                {routes.map((r) => <option key={r.id} value={r.id}>{r.routeName}</option>)}
              </Select>
            </Field>
            <Field label="Bus">
              <Select value={form.busId} onChange={(e) => setForm((f) => ({ ...f, busId: e.target.value }))}>
                {buses.map((b) => <option key={b.id} value={b.id}>{b.busNumber}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Departure time">
              <Input type="time" value={form.departureTime} onChange={(e) => setForm((f) => ({ ...f, departureTime: e.target.value }))} required />
            </Field>
            <Field label="Arrival time">
              <Input type="time" value={form.arrivalTime} onChange={(e) => setForm((f) => ({ ...f, arrivalTime: e.target.value }))} required />
            </Field>
          </div>
          <Field label="Days of week">
            <Select value={form.days} onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}>
              {DAY_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}