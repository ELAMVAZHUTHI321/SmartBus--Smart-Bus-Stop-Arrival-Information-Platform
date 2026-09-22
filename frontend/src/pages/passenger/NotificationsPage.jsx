import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { EmptyState, PageLoader } from "../../components/common/States.jsx";
import { notificationService } from "../../services/notificationService.js";
import { formatDateTime } from "../../utils/format.js";

const icons = { INFO: "ℹ️", ALERT: "⚠️", REMINDER: "⏰", SYSTEM: "🛠️" };

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const list = await notificationService.listForUser(user.id);
    setItems(list);
  };

  useEffect(() => {
    let mounted = true;
    load()
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [user.id]);

  const markRead = async (id) => {
    await notificationService.markRead(id);
    setItems((list) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAll = async () => {
    await notificationService.markAllRead(user.id);
    setItems((list) => list.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">Arrival alerts, reminders and service updates.</p>
        </div>
        {items.some((n) => !n.isRead) && (
          <Button variant="secondary" size="sm" onClick={markAll}>
            Mark all as read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon="🔕" title="All caught up" description="You have no notifications right now." />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card
              key={n.id}
              className={`transition-opacity ${n.isRead ? "opacity-60" : "border-l-4 border-l-brand-500"}`}
            >
              <button
                onClick={() => !n.isRead && markRead(n.id)}
                className="block w-full px-5 py-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{icons[n.type] || "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{n.title}</span>
                      <Badge value={n.type} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                    <p className="mt-1.5 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}