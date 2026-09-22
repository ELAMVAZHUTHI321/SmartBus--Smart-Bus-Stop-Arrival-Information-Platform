import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Table from "../../components/common/Table.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Field, Input, Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { adminService } from "../../services/adminService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";

const statusTone = (s) =>
  s === "ACTIVE" ? "emerald" : s === "SUSPENDED" ? "amber" : s === "INACTIVE" ? "slate" : "blue";

const emptyForm = { name: "", email: "", password: "", contactNumber: "" };

export default function OperatorsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setOperators(await adminService.listOperators());
  };

  useEffect(() => {
    load()
      .catch((e) => toast.error(e.message))
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.createOperator({ ...form, auditorId: user?.id });
      toast.success("Operator account created.");
      setModal(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transport operators</h1>
          <p className="mt-1 text-sm text-slate-500">Track every operator, their bus fleet and service area.</p>
        </div>
        <Button onClick={() => setModal(true)}>+ Invite operator</Button>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-slate-800">All operators</div>
            <div className="text-xs text-slate-500">{operators.length} organizations</div>
          </div>
        </div>
        <Table
          empty="No operators registered yet. Invite your first transport operator to get started."
          columns={[
            {
              key: "organizationName",
              label: "Organization",
              render: (o) => (
                <Link to={`/admin/operators/${o.id}`} className="font-semibold text-brand-600 hover:text-brand-700">
                  {o.organizationName || "—"}
                </Link>
              ),
            },
            {
              key: "user",
              label: "Contact user",
              render: (o) =>
                o.user ? (
                  <span className="flex flex-col">
                    <span className="font-medium text-slate-700">{o.user.name}</span>
                    <span className="text-xs text-slate-400">{o.user.email}</span>
                  </span>
                ) : (
                  "—"
                ),
            },
            { key: "busCount", label: "Buses", render: (o) => <Badge value={`${o.busCount} 🚌`} /> },
            { key: "routeCount", label: "Routes", render: (o) => <Badge value={`${o.routeCount} 🗺️`} /> },
            {
              key: "status",
              label: "Status",
              render: (o) => <Badge value={o.status || (o.user?.active ? "ACTIVE" : "INACTIVE")} tone={statusTone(o.status || (o.user?.active ? "ACTIVE" : "INACTIVE"))} />,
            },
            { key: "contactNumber", label: "Contact number", render: (o) => o.contactNumber || "—" },
          ]}
          rows={operators}
        />
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Invite a new transport operator"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="operator-form" loading={saving}>
              Create operator
            </Button>
          </>
        }
      >
        <form id="operator-form" onSubmit={save} className="space-y-4">
          <Field label="Organization name">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Metro City Transit"
              required
            />
          </Field>
          <Field label="Contact number">
            <Input
              value={form.contactNumber}
              onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))}
              placeholder="+1 555 0102"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="metro@smartbus.com"
                required
              />
            </Field>
            <Field label="Temporary password">
              <Input
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="password"
                type="password"
                required
                minLength={6}
              />
            </Field>
          </div>
        </form>
      </Modal>
    </div>
  );
}