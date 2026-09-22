import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardHeader, CardBody } from "../../components/common/Card.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import { Field, Input, Select } from "../../components/common/fields.jsx";
import MapPlaceholder from "../../components/common/MapPlaceholder.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { tripService } from "../../services/tripService.js";
import { relativeMinutes, formatDateTime } from "../../utils/format.js";

export default function BusMovementPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ latitude: "", longitude: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const t = await tripService.list();
        setTrips(t.filter((x) => x.status === "ONGOING"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedTripId) return;
    let mounted = true;
    (async () => {
      const locs = await tripService.locationsForTrip(selectedTripId);
      if (mounted) setLocations(locs.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)));
    })();
    return () => {
      mounted = false;
    };
  }, [selectedTripId]);

  const record = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tripService.recordLocation(selectedTripId, {
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      toast.success("Location recorded.");
      setForm({ latitude: "", longitude: "" });
      const locs = await tripService.locationsForTrip(selectedTripId);
      setLocations(locs.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bus movement</h1>
        <p className="mt-1 text-sm text-slate-500">Record live GPS locations during an ongoing trip.</p>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center text-sm text-slate-500">
          No ongoing trips to track right now. Start a trip in the <b>Trips</b> section first.
        </div>
      ) : (
        <>
          <Card>
            <CardHeader title="Select active trip" subtitle={`${trips.length} ongoing trips available`} />
            <CardBody>
              <div className="w-full max-w-md">
                <Field label="Active trip">
                  <Select value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
                    <option value="">Select a trip…</option>
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>{t.busNumber} · {t.routeName} · started {relativeMinutes(t.startTime)}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </CardBody>
          </Card>

          {selectedTripId && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader title="Record new location" subtitle="Enter the current latitude & longitude" />
                <CardBody>
                  <form onSubmit={record} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Latitude">
                        <Input type="number" step="any" min="-90" max="90" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} placeholder="35.6895" required />
                      </Field>
                      <Field label="Longitude">
                        <Input type="number" step="any" min="-180" max="180" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} placeholder="139.6917" required />
                      </Field>
                    </div>
                    <Button type="submit" loading={saving}>📡 Record location</Button>
                  </form>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Latest position" subtitle={locations.length ? `Last reported ${relativeMinutes(locations[0]?.recordedAt)}` : "No locations yet"} />
                <CardBody>
                  {locations.length > 0 ? (
                    <MapPlaceholder latitude={locations[0].latitude} longitude={locations[0].longitude} label={`${relativeMinutes(locations[0].recordedAt)} ago`} />
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-8 text-center text-xs text-slate-400">
                      Submit a location above to see it here.
                    </div>
                  )}
                </CardBody>
              </Card>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader title="Recent location history" subtitle={`${locations.length} recorded points`} />
                  <Table
                    columns={[
                      { key: "latitude", label: "Latitude", render: (l) => l.latitude.toFixed(4) },
                      { key: "longitude", label: "Longitude", render: (l) => l.longitude.toFixed(4) },
                      { key: "recordedAt", label: "Recorded", render: (l) => formatDateTime(l.recordedAt) },
                    ]}
                    rows={locations.slice(0, 20)}
                    empty="No locations recorded for this trip yet."
                  />
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}