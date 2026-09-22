import { useEffect, useState } from "react";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { Field, Input, Select } from "../../components/common/fields.jsx";
import { PageLoader } from "../../components/common/States.jsx";
import { adminService } from "../../services/adminService.js";
import { notificationService } from "../../services/notificationService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDateTime } from "../../utils/format.js";

const emptyNotice = { title: "", message: "", type: "SYSTEM" };

export default function AdminDashboardPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notice, setNotice] = useState(emptyNotice);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([adminService.stats(), adminService.auditLogs()])
      .then(([s, l]) => mounted && (setStats(s), setLogs(l.slice(0, 5))))
      .catch((e) => mounted && toast.error(e.message));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendNotice = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await notificationService.broadcast({ ...notice, auditorId: user.id });
      toast.success("Notification broadcast to all users.");
      setNotice(emptyNotice);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  if (!stats) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of every account, vehicle and service on SmartBus.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Users" value={stats.users} hint={`${stats.passengers} passengers`} icon="U" />
        <StatCard label="Operators" value={stats.operators} hint={`${stats.admins} admins`} icon="O" />
        <StatCard label="Buses" value={stats.buses} hint={`${stats.activeBuses} active`} icon="B" />
        <StatCard label="Routes" value={stats.routes} hint={`${stats.activeRoutes} active`} icon="R" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-sm font-semibold text-slate-800">Broadcast notification</div>
            <div className="text-xs text-slate-500">Send an alert to every registered user.</div>
          </div>
          <form onSubmit={sendNotice} className="space-y-4 p-5">
            <Field label="Title">
              <Input value={notice.title} onChange={(e) => setNotice((n) => ({ ...n, title: e.target.value }))} placeholder="Service update" required />
            </Field>
            <Field label="Message">
              <Input value={notice.message} onChange={(e) => setNotice((n) => ({ ...n, message: e.target.value }))} placeholder="Airport Express runs every 15 min tonight." required />
            </Field>
            <Field label="Type">
              <Select value={notice.type} onChange={(e) => setNotice((n) => ({ ...n, type: e.target.value }))}>
                {["SYSTEM", "INFO", "ALERT", "REMINDER"].map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Button type="submit" loading={sending}>Send to everyone</Button>
          </form>
        </Card>

        <Card>
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-sm font-semibold text-slate-800">Recent audit activity</div>
            <div className="text-xs text-slate-500">Latest platform actions.</div>
          </div>
          <ul className="divide-y divide-slate-100">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-700">{l.actorName}</span>{" "}
                  <span className="text-slate-500">{l.action}</span>{" "}
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">{l.entityType}</span>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{formatDateTime(l.createdAt)}</span>
              </li>
            ))}
            {logs.length === 0 && <li className="px-5 py-6 text-center text-sm text-slate-400">No activity yet.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}