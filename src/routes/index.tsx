import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Sparkles, Store } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perx — AI-powered Employee Lifestyle OS" },
      {
        name: "description",
        content:
          "Perx turns company-funded budgets into meaningful life progress — for employees, companies, and providers.",
      },
    ],
  }),
  component: RolePicker,
});

function RolePicker() {
  const { t } = useI18n();

  const roles = [
    {
      to: "/employee",
      icon: Sparkles,
      label: "I'm an employee",
      desc: "Talk to your AI Lifestyle Concierge. Pursue goals. Discover meaningful experiences.",
      cta: "Enter your home",
      tone: "ai" as const,
    },
    {
      to: "/company",
      icon: Building2,
      label: "We're a company",
      desc: "Fund growth and wellbeing. Strategic AI insights, simple approvals.",
      cta: "Open HQ",
      tone: "navy" as const,
    },
    {
      to: "/provider",
      icon: Store,
      label: "I'm a provider",
      desc: "See real corporate demand. Build offers with AI. Reach engaged employees.",
      cta: "Open studio",
      tone: "card" as const,
    },
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.72 0.19 25 / 0.45), oklch(0.72 0.15 230 / 0.35), transparent)",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 md:px-8 md:py-7">
        <Link to="/" aria-label="Perx home" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-ai font-display text-xl font-extrabold text-white ring-ai">
            P
          </span>
          <span className="font-display text-lg font-extrabold leading-none text-navy">Perx</span>
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-6 md:px-8 md:pt-10">
        <section className="animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-coral/30 bg-coral/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-coral">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-coral" />
            AI Lifestyle Operating System
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-navy text-balance sm:text-6xl">
            Turn company budgets into{" "}
            <span className="text-gradient-ai">meaningful life progress.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy/75 sm:text-xl">
            Perx connects employees, companies and providers around one idea: growth and
            wellbeing, not perks. Tell Perx how you feel — it plans the rest.
          </p>

          <Link
            to="/employee/concierge"
            search={{ q: "I'm not sure what I need this week. Surprise me." }}
            className="group mt-7 inline-flex h-14 max-w-full items-center gap-3 rounded-2xl bg-navy pl-2 pr-5 text-white shadow-lift transition hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-ai ring-ai">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <span className="truncate font-display text-base font-extrabold sm:text-lg">
              Try the AI Concierge — "How are you feeling today?"
            </span>
            <ArrowRight className="ml-1 size-5 transition group-hover:translate-x-1" />
          </Link>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            {t("landing.choose")}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {roles.map((r, i) => {
              const Icon = r.icon;
              const toneClasses = {
                ai: "bg-gradient-ai text-white border-transparent ring-ai",
                navy: "bg-navy text-white border-navy",
                card: "bg-card text-navy border-border",
              }[r.tone];
              const ctaBg = {
                ai: "bg-white/15 text-white",
                navy: "bg-white/15 text-white",
                card: "bg-coral text-white",
              }[r.tone];
              const descColor = r.tone === "card" ? "text-navy/70" : "text-white/85";
              const iconBg = r.tone === "card" ? "bg-coral/10 text-coral" : "bg-white/15 text-white";
              return (
                <Link
                  key={r.to}
                  to={r.to}
                  className={`group flex min-h-[220px] flex-col justify-between rounded-3xl border-2 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift animate-slide-up ${toneClasses}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`grid size-14 place-items-center rounded-2xl ${iconBg}`}>
                    <Icon className="size-7" strokeWidth={2.2} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold">{r.label}</h3>
                    <p className={`mt-2 text-base ${descColor}`}>{r.desc}</p>
                    <span className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-sm font-extrabold ${ctaBg}`}>
                      {r.cta} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-16 border-t border-border pt-6 text-sm font-medium text-navy/60">
          Mock data only · No real transactions · Currency: Albanian Lek (ALL)
        </footer>
      </main>
    </div>
  );
}
