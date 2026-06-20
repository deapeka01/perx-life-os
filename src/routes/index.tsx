import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin, Search, Sparkles, Store } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perx — Choose your experience" },
      {
        name: "description",
        content:
          "An AI-powered Employee Lifestyle Operating System for companies, employees and providers.",
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
      label: t("role.employee"),
      desc: t("role.employee.desc"),
      tone: "coral" as const,
    },
    {
      to: "/company",
      icon: Building2,
      label: t("role.company"),
      desc: t("role.company.desc"),
      tone: "navy" as const,
    },
    {
      to: "/provider",
      icon: Store,
      label: t("role.provider"),
      desc: t("role.provider.desc"),
      tone: "sky" as const,
    },
  ];

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Top bar — Wolt style: location left, language right */}
      <header className="sticky top-0 z-30 border-b border-border bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-coral font-display text-xl font-extrabold text-white shadow-coral">
              P
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-extrabold leading-none text-navy">Perx</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-navy/70">
                <MapPin className="size-3.5" aria-hidden /> {t("home.delivering")} {t("home.city")}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-8 md:pt-12">
        {/* Hero */}
        <section className="animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-coral/30 bg-coral/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-coral">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-coral" />
            {t("landing.tag")}
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-navy text-balance sm:text-6xl">
            {t("landing.title.1")}
            <br />
            <span className="text-coral">{t("landing.title.2")}</span> {t("landing.title.3")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy/80 sm:text-xl">
            {t("landing.subtitle")}
          </p>

          {/* Wolt-style big search */}
          <div className="mt-7 max-w-2xl">
            <Link
              to="/employee/concierge"
              className="group flex h-16 items-center gap-3 rounded-2xl border-2 border-navy/15 bg-card px-5 shadow-soft transition hover:border-coral hover:shadow-lift"
            >
              <Search className="size-6 text-navy" aria-hidden />
              <span className="flex-1 truncate text-base font-semibold text-navy/70 sm:text-lg">
                {t("landing.search.placeholder")}
              </span>
              <span className="hidden h-10 items-center justify-center rounded-xl bg-coral px-4 font-display text-sm font-extrabold text-white shadow-coral sm:inline-flex">
                {t("home.aiPick")}
              </span>
            </Link>
          </div>
        </section>

        {/* Role tiles */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            {t("landing.choose")}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {roles.map((r, i) => {
              const Icon = r.icon;
              const tones = {
                coral: "bg-coral text-white border-coral",
                navy: "bg-navy text-white border-navy",
                sky: "bg-card text-navy border-border",
              };
              return (
                <Link
                  key={r.to}
                  to={r.to}
                  className={`group flex min-h-[200px] flex-col justify-between rounded-3xl border-2 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift animate-slide-up ${tones[r.tone]}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid size-14 place-items-center rounded-2xl ${
                        r.tone === "sky" ? "bg-sky/15 text-sky" : "bg-white/15 text-white"
                      }`}
                    >
                      <Icon className="size-7" strokeWidth={2.2} aria-hidden />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold">{r.label}</h3>
                    <p
                      className={`mt-2 text-base ${
                        r.tone === "sky" ? "text-navy/75" : "text-white/85"
                      }`}
                    >
                      {r.desc}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 font-display text-base font-extrabold">
                      {t("role.enter")} <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-16 border-t border-border pt-6 text-sm font-medium text-navy/60">
          {t("landing.footer")}
        </footer>
      </main>
    </div>
  );
}
