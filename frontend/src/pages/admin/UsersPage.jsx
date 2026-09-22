import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Field, Input, Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { adminService } from "../../services/adminService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate } from "../../utils/format.js";
import { ROLE_LABELS } from "../../constants/index.js";

const roles = ["PASSENGER", "OPERATOR", "ADMIN"];

export default function UsersPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setUsers(await adminService.listUsers());
  };

  useEffect(() => {
    load()
      .then(() => setLoading(false))
      .catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (u) => {
    setEditing({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(editing.id, { ...editing, auditorId: user.id });
      toast.success("User updated.");
      setModal(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">All users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage every account on the SmartBus platform.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{users.length} accounts</span>
      </div>

      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="text-sm font-semibold text-slate-800">Users</div>
          <div className="text-xs text-slate-500">{users.length} accounts across all roles</div>
        </div>
        <Table
          columns={[
            { key: "name", label: "Name", render: (u) => <span className="font-semibold text-slate-800">{u.name}</span> },
            { key: "email", label: "Email", render: (u) => <span className="text-xs text-slate-500">{u.email}</span> },
            { key: "role", label: "Role", render: (u) => <Badge value={ROLE_LABELS[u.role] || u.role} tone={u.role === "ADMIN" ? "slate" : u.role === "OPERATOR" ? "violet" : "blue"} /> },
            { key: "status", label: "Status", render: (u) => (u.active ? <Badge value="ACTIVE" /> : <Badge value="INACTIVE" />) },
            { key: "createdAt", label: "Joined", render: (u) => formatDate(u.createdAt) },
            {
              key: "_actions",
              label: "Actions",
              render: (u) => (
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(u)} className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50">Edit</button>
                  <button
                    onClick={async () => {
                      await adminService.updateUser(u.id, { active: !u.active, auditorId: user.id }).catch((e) => toast.error(e.message));
                      toast.success(u.active ? "Account deactivated." : "Account activated.");
                      await load();
                    }}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ),
            },
          ]}
          rows={users}
          keyFn={(u) => u.id}
          empty="No users yet."
        />
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={`Edit ${editing?.name || "user"}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" form="user-form">Save changes</Button>
          </>
        }
      >
        <form id="user-form" onSubmit={save} className="space-y-4">
          <Field label="Full name">
            <Input value={editing?.name || ""} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={editing?.email || ""} onChange={(e) => setEditing((s) => ({ ...s, email: e.target.value }))} required />
          </Field>
          <Field label="Role">
            <Select value={editing?.role || ""} onChange={(e) => setEditing((s) => ({ ...s, role: e.target.value }))}>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}