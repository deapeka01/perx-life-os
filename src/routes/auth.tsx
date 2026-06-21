import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Bonsai } from "@/components/perx/Bonsai";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in. Perx." }] }),
  component: AuthPage,
});

type Mode = "login" | "signup";

function AuthPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "").trim();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        navigate({ to: "/redeem" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/redeem" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/redeem",
    });
    if (result.error) setError(result.error.message ?? "Google sign-in failed.");
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <BackgroundMesh />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 font-display text-base font-extrabold backdrop-blur">
            P
          </span>
          <span className="font-display text-sm font-extrabold">Perx</span>
        </Link>
        <LanguageSwitcher compact dark />
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-5 pb-16 pt-4 md:grid-cols-2 md:px-10">
        <section className="hidden text-balance md:block">
          <Bonsai size={320} />
          <h1 className="mt-6 font-display text-3xl font-extrabold leading-[1.05]">
            {mode === "signup" ? t("auth.create") : t("auth.welcome")}
          </h1>
          <p className="mt-3 max-w-md text-white/75">{t("auth.tagline")}</p>
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
                {t(m === "login" ? "auth.toggle.login" : "auth.toggle.signup")}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-navy/10 bg-white py-3 text-sm font-extrabold text-navy transition hover:border-navy/30"
          >
            <GoogleIcon />
            {t("auth.continueGoogle")}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy/40">
            <span className="h-px flex-1 bg-navy/10" />
            {t("auth.or")}
            <span className="h-px flex-1 bg-navy/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field name="name" label={t("auth.name")} placeholder="Ardit Hoxha" required />
            )}
            <Field name="email" label={t("auth.email")} type="email" placeholder="you@company.al" required />
            <Field name="password" label={t("auth.password")} type="password" placeholder="••••••••" required minLength={8} />

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 font-display text-base font-extrabold text-white shadow-lift transition hover:bg-navy/90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {t(mode === "login" ? "auth.signin.cta" : "auth.signup.cta")}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-navy/60">
            {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-extrabold text-coral underline-offset-4 hover:underline"
            >
              {t(mode === "login" ? "auth.toggle.signup" : "auth.toggle.login")}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}

function Field({
  name, label, type = "text", placeholder, required, minLength,
}: {
  name: string; label: string; type?: string; placeholder?: string; required?: boolean; minLength?: number;
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
        minLength={minLength}
        placeholder={placeholder}
        className="block w-full rounded-xl border-2 border-navy/10 bg-white px-4 py-3 text-base font-medium text-navy outline-none transition focus:border-coral"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function BackgroundMesh() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 85% 0%, oklch(0.72 0.19 25 / 0.4), transparent 70%), radial-gradient(60% 50% at 5% 100%, oklch(0.72 0.15 230 / 0.45), transparent 60%), radial-gradient(40% 30% at 50% 50%, oklch(0.7 0.16 160 / 0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-[480px] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.19 25 / 0.5), transparent 70%)",
          animation: "auth-blob 20s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes auth-blob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,40px) scale(1.08); } }`}</style>
    </>
  );
}
