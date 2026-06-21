import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Bonsai } from "@/components/perx/Bonsai";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { redeemInvitationCode, roleHomePath, cachedRole } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redeem")({
  head: () => ({ meta: [{ title: "Join your company. Perx." }] }),
  component: RedeemPage,
});

function RedeemPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // bounce to /auth if no session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled && !user) navigate({ to: "/auth" });
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const code = String(new FormData(e.currentTarget).get("code") || "");
    const result = await redeemInvitationCode(code);
    setLoading(false);
    if (!result.ok) {
      setError(t("redeem.error"));
      return;
    }
    navigate({ to: `/onboarding/${result.role}` });
  };

  const handleSkip = () => {
    const role = cachedRole() ?? "employee";
    navigate({ to: roleHomePath(role) });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, oklch(0.72 0.19 25 / 0.35), transparent 70%), radial-gradient(60% 50% at 10% 100%, oklch(0.72 0.15 230 / 0.4), transparent 60%)",
        }}
      />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-5 md:px-10">
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 font-display text-base font-extrabold backdrop-blur">P</span>
          <span className="font-display text-sm font-extrabold">Perx</span>
        </span>
        <LanguageSwitcher compact dark />
      </header>

      <main className="relative z-10 mx-auto grid max-w-4xl items-center gap-10 px-5 pb-16 pt-4 md:grid-cols-2 md:px-10">
        <div className="hidden md:block">
          <Bonsai size={300} />
        </div>
        <section className="rounded-3xl border border-white/15 bg-white/95 p-6 text-navy shadow-lift sm:p-8">
          <h1 className="font-display text-2xl font-extrabold">{t("redeem.title")}</h1>
          <p className="mt-2 text-navy/70">{t("redeem.subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              name="code"
              required
              autoFocus
              placeholder={t("redeem.placeholder")}
              className="block w-full rounded-xl border-2 border-navy/10 bg-white px-4 py-4 text-center font-mono text-lg font-extrabold uppercase tracking-[0.2em] text-navy outline-none transition focus:border-coral"
            />
            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 font-display text-base font-extrabold text-white shadow-lift transition hover:bg-navy/90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {t("redeem.cta")}
              <ArrowRight className="size-4" />
            </button>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-navy/45">
              {t("redeem.help")}
            </p>
            <button
              type="button"
              onClick={handleSkip}
              className="block w-full text-center text-sm font-bold text-navy/55 hover:text-navy"
            >
              {t("redeem.skip")}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
