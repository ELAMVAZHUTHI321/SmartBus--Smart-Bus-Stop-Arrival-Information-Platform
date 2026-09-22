import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { Field, Input } from "../../components/common/fields.jsx";
import Button from "../../components/common/Button.jsx";
import { DEMO_CREDENTIALS } from "../../constants/index.js";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email.trim(), form.password);
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      navigate(from === "/" ? (user.role === "PASSENGER" ? "/" : `/${user.role.toLowerCase()}`) : from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-3xl">🚌</div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Sign in to SmartBus</h2>
        <p className="mt-1 text-sm text-slate-500">Track buses and arrival times in real time.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
        )}
        <Button type="submit" loading={submitting} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        New to SmartBus?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Demo accounts
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_CREDENTIALS.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => setForm({ email: acc.email, password: acc.password })}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600"
            >
              {acc.label} · fill
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}