import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AIOrb } from "@/components/perx/AIOrb";
import {
  roleFromInvitationCode,
  setSession,
} from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in · Perx" }] }),
  component: AuthPage,
});

type Mode = "login" | "signup";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();

    if (mode === "login") {
      // Mock login: email prefix decides role; default employee.
      const role = email.startsWith("co@")
        ? "company"
        : email.startsWith("prv@")
          ? "provider"
          : "employee";
      setSession({ role, email, onboarded: true });
      navigate({ to: `/${role}` });
      return;
    }

    const code = String(data.get("code") || "").trim();
    const role = roleFromInvitationCode(code);
    if (!role) {
      setError("Invalid invitation code. Try EMP-DEMO, CO-DEMO or PRV-DEMO.");
      return;
    }
    const name = `${data.get("name") || ""} ${data.get("surname") || ""}`.trim();
    setSession({ role, email, name, onboarded: false });
    navigate({ to: `/onboarding/${role}` });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(50% 40% at 80% 0%, oklch(0.72 0.19 25 / 0.3), transparent 70%), radial-gradient(50% 40% at 10% 100%, oklch(0.72 0.15 230 / 0.35), transparent 60%)",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 font-display text-base font-extrabold backdrop-blur">
            P
          </span>
          <span className="font-display text-sm font-extrabold">Perx</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-4 md:grid-cols-2 md:px-10">
        <section className="hidden text-balance md:block">
          <AIOrb size={120} />
          <h1 className="mt-6 font-display text-3xl font-extrabold leading-[1.05]">
            Step into your AI-powered workspace.
          </h1>
          <p className="mt-3 max-w-md text-white/70">
            Your invitation code knows your role. We'll set up the rest with a conversation —
            no forms, no menus.
          </p>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-white/70 backdrop-blur">
            <p className="font-extrabold uppercase tracking-[0.16em] text-white/90">
              Demo invitation codes
            </p>
            <ul className="mt-2 space-y-1 font-mono">
              <li><span className="text-coral">EMP-DEMO</span> · employee</li>
              <li><span className="text-coral">CO-DEMO</span> · company</li>
              <li><span className="text-coral">PRV-DEMO</span> · provider</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-white/15 bg-white/95 p-6 text-navy shadow-lift backdrop-blur sm:p-8">
          <div className="flex rounded-xl bg-navy/5 p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-extrabold transition ${
                  mode === m ? "bg-navy text-white shadow-soft" : "text-navy/60"
                }`}
              >
                {m === "login" ? "Login" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <Field name="name" label="Name" placeholder="Ardit" required />
                <Field name="surname" label="Surname" placeholder="Hoxha" required />
              </div>
            )}
            <Field
              name="email"
              label="Work email"
              type="email"
              placeholder="you@company.al"
              required
            />
            {mode === "signup" && (
              <Field
                name="code"
                label="Invitation code"
                placeholder="EMP-DEMO"
                required
                hint="Provided by your company."
              />
            )}
            <Field name="password" label="Password" type="password" placeholder="••••••••" required />

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 font-display text-base font-extrabold text-white shadow-lift transition hover:bg-navy/90"
            >
              {mode === "login" ? "Log in" : "Create account"}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
          </form>

          {mode === "login" && (
            <p className="mt-5 text-center text-sm text-navy/60">
              Pro tip: log in with any email — prefix{" "}
              <span className="font-mono font-bold text-navy">co@</span> for company,{" "}
              <span className="font-mono font-bold text-navy">prv@</span> for provider.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-widest text-navy/60">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="block w-full rounded-xl border-2 border-navy/10 bg-white px-4 py-3 text-base font-medium text-navy outline-none transition focus:border-coral"
      />
      {hint && <span className="mt-1 block text-xs text-navy/50">{hint}</span>}
    </label>
  );
}
