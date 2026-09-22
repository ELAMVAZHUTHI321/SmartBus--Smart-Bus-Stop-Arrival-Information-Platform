import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";
import { Field, Input } from "../../components/common/fields.jsx";
import Button from "../../components/common/Button.jsx";
import { ROLES } from "../../constants/index.js";
import { authService } from "../../services/authService.js";
import { cx } from "../../utils/format.js";

export default function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(ROLES.PASSENGER);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organizationName: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
        phone: form.phone.trim() || null,
        organizationName: form.organizationName.trim() || null,
      });
      const { token, user: u } = result;
      localStorage.setItem("sb_token", token);
      localStorage.setItem("sb_user", JSON.stringify(u));
      toast.success("Account created — welcome to SmartBus!");
      navigate(role === ROLES.OPERATOR ? "/operator" : "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-3xl">🚌</div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Create your account</h2>
        <p className="mt-1 text-sm text-slate-500">Choose how you'll use SmartBus.</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2">
        {[
          { key: ROLES.PASSENGER, label: "🚆 Passenger", desc: "Track buses & arrivals" },
          { key: ROLES.OPERATOR, label: "🚌 Operator", desc: "Manage buses & routes" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRole(opt.key)}
            className={cx(
              "rounded-xl border-2 p-3 text-left transition-colors",
              role === opt.key
                ? "border-brand-500 bg-brand-50"
                : "border-slate-200 bg-white hover:border-slate-300",
            )}
          >
            <div className="text-sm font-semibold text-slate-800">{opt.label}</div>
            <div className="text-xs text-slate-500">{opt.desc}</div>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <Input value={form.name} onChange={set("name")} placeholder="Jordan Doe" required />
        </Field>
        {role === ROLES.OPERATOR && (
          <Field label="Organization name">
            <Input
              value={form.organizationName}
              onChange={set("organizationName")}
              placeholder="e.g. City Transit Co."
            />
          </Field>
        )}
        <Field label="Email">
          <Input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
        </Field>
        <Field label="Password" hint="At least 6 characters">
          <Input
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </Field>
        <Field label="Phone (optional)">
          <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 0100" />
        </Field>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
        )}
        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}