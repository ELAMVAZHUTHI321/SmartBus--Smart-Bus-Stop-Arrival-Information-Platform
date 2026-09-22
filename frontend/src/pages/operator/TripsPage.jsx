import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardHeader, CardBody } from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Field, Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { tripService } from "../../services/tripService.js";
import { busService } from "../../services/busService.js";
import { routeService } from "../../services/routeService.js";
import { scheduleService } from "../../services/scheduleService.js";
import { TRIP_STATUS } from "../../constants/index.js";
import { formatTime } from "../../utils/format.js";

const emptyForm = { busId: "", routeId: "", scheduleId: "" };

export default function TripsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [t, b, r, sc] = await Promise.all([tripService.list(), busService.list(), routeService.list(), scheduleService.list()]);
    setTrips(t);
    setBuses(b);
    setRoutes(r);
    setSchedules(sc);
  };

  useEffect(() => {
    load()
      .catch(() => toast.error("Could not load trips."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal(true);
  };

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tripService.create({ ...form, tripDate: new Date().toISOString().slice(0, 10), auditorId: user.id });
      toast.success("Trip scheduled.");
      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (trip, status) => {
    await tripService.updateStatus(trip.id, status);
    toast.success(`Trip marked ${status.toLowerCase()}.`);
    await load();
  };

  const remove = async (trip) => {
    if (!confirm(`Delete trip #${trip.id.toUpperCase()}?`)) return;
    await tripService.remove(trip.id);
    toast.success("Trip deleted.");
    await load();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Trips</h1>
          <p className="mt-1 text-sm text-slate-500">Plan journeys and update their lifecycle status.</p>
        </div>
        <Button onClick={openCreate}>+ Schedule trip</Button>
      </div>

      <Card>
        <CardHeader title="All trips" subtitle={`${trips.length} journeys`} />
        <Table
          columns={[
            { key: "id", label: "Trip", render: (t) => <span className="font-mono text-xs">#{t.id.toUpperCase()}</span> },
            { key: "busNumber", label: "Bus" },
            { key: "routeName", label: "Route" },
            { key: "startTime", label: "Started", render: (t) => (t.startTime ? formatTime(t.startTime) : "—") },
            { key: "status", label: "Status", render: (t) => <Badge value={t.status} /> },
            {
              key: "_actions",
              label: "Actions",
              render: (t) => (
                <div className="flex flex-wrap gap-1">
                  {t.status === "SCHEDULED" && (
                    <button onClick={() => changeStatus(t, "ONGOING")} className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100">Start</button>
                  )}
                  {t.status === "ONGOING" && (
                    <button onClick={() => changeStatus(t, "COMPLETED")} className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Complete</button>
                  )}
                  {["SCHEDULED", "ONGOING"].includes(t.status) && (
                    <button onClick={() => changeStatus(t, "CANCELLED")} className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100">Cancel</button>
                  )}
                  <button onClick={() => remove(t)} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-red-600">Delete</button>
                </div>
              ),
            },
          ]}
          rows={trips}
          empty="No trips yet."
        />
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Schedule a new trip"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={create} loading={saving}>Schedule trip</Button>
          </>
        }
      >
        <form id="trip-form" onSubmit={create} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Route">
              <Select value={form.routeId} onChange={(e) => setForm((f) => ({ ...f, routeId: e.target.value }))}>
                <option value="">Select route…</option>
                {routes.map((r) => <option key={r.id} value={r.id}>{r.routeName}</option>)}
              </Select>
            </Field>
            <Field label="Bus">
              <Select value={form.busId} onChange={(e) => setForm((f) => ({ ...f, busId: e.target.value }))}>
                <option value="">Select bus…</option>
                {buses.map((b) => <option key={b.id} value={b.id}>{b.busNumber}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Based on schedule (optional)">
            <Select value={form.scheduleId} onChange={(e) => setForm((f) => ({ ...f, scheduleId: e.target.value }))}>
              <option value="">None</option>
              {schedules.map((s) => <option key={s.id} value={s.id}>{s.routeName} · {s.busNumber} · {s.departureTime}</option>)}
            </Select>
          </Field>
          <CardBody className="!px-0 !py-0">
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              ℹ️ The trip will be created for today with status <b>Scheduled</b>. Use Start once the bus departs.
            </p>
          </CardBody>
        </form>
      </Modal>
    </div>
  );
}