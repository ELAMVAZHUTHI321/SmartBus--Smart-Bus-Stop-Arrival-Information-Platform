import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Card, { CardHeader, CardBody } from "../../components/common/Card.jsx";
import { Field, Input } from "../../components/common/fields.jsx";
import Button from "../../components/common/Button.jsx";
import { authService } from "../../services/authService.js";
import { ROLE_LABELS } from "../../constants/index.js";
import { formatDate, initials } from "../../utils/format.js";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "" });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateProfile(user.id, {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      });
      setUser({ ...user, ...updated });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 300));
    toast.success("Password updated (mock).");
    setPwd({ current: "", next: "" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-xl font-bold text-white">
          {initials(user?.name)}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">{ROLE_LABELS[user?.role]} · member since {formatDate(user?.createdAt)}</p>
        </div>
      </div>

      <Card>
        <CardHeader title="Personal information" subtitle="Update your profile details" />
        <CardBody>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required />
              </Field>
              <Field label="Email">
                <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} required />
              </Field>
            </div>
            <Field label="Phone">
              <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="+1 555 0100" />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={saving}>Save changes</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Password" subtitle="Change your account password" />
        <CardBody>
          <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-2">
            <Field label="Current password">
              <Input type="password" value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} required />
            </Field>
            <Field label="New password">
              <Input type="password" value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} minLength={6} required />
            </Field>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="secondary">Update password</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}