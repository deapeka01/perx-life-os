import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Sparkles,
  Wallet,
  Heart,
  UtensilsCrossed,
  Dumbbell,
  GraduationCap,
  Plane,
  CalendarDays,
  Briefcase,
  Users,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  aiBundle,
  conciergeStarters,
  currentEmployee,
  discoverFeed,
  formatALL,
  perxDrop,
  teamAdventures,
} from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";
import { CategoryPill } from "@/components/perx/CategoryPill";
import { WoltCard } from "@/components/perx/WoltCard";
import { Countdown } from "@/components/perx/Countdown";

export const Route = createFileRoute("/employee/")({
  head: () => ({
    meta: [
      { title: "Home · Perx" },
      {
        name: "description",
        content: "Your AI-personalized lifestyle home — Wolt-style discovery for work-life perks.",
      },
    ],
  }),
  component: EmployeeHome,
});

function EmployeeHome() {
  const { t } = useI18n();

  const categories = [
    { key: "cat.wellness", icon: Heart, tone: "coral" as const },
    { key: "cat.food", icon: UtensilsCrossed, tone: "coral" as const },
    { key: "cat.fitness", icon: Dumbbell, tone: "emerald" as const },
    { key: "cat.learning", icon: GraduationCap, tone: "sky" as const },
    { key: "cat.travel", icon: Plane, tone: "sky" as const },
    { key: "cat.events", icon: CalendarDays, tone: "coral" as const },
    { key: "cat.workspace", icon: Briefcase, tone: "navy" as const },
    { key: "cat.family", icon: Users, tone: "emerald" as const },
  ];

  return (
    <div className="pb-12">
      {/* ─── Sticky Wolt-style top: location + language ─── */}
      <header className="sticky top-0 z-30 border-b border-border bg-canvas/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-5 py-3 md:px-10">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-navy/60">
              {t("home.delivering")}
            </p>
            <p className="flex items-center gap-1.5 font-display text-lg font-extrabold text-navy">
              <MapPin className="size-4 text-coral" aria-hidden />
              {t("home.city")}
            </p>
          </div>
          <LanguageSwitcher compact />
        </div>

        {/* Wolt-style prominent search bar */}
        <div className="px-5 pb-4 md:px-10">
          <Link
            to="/employee/concierge"
            aria-label={t("home.search.hint")}
            className="group flex h-14 items-center gap-3 rounded-2xl border-2 border-navy/15 bg-card px-4 shadow-soft transition hover:border-coral hover:shadow-lift"
          >
            <Search className="size-6 text-navy" aria-hidden />
            <span className="flex-1 truncate text-base font-semibold text-navy/70">
              {t("home.search.placeholder")}
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral text-white shadow-coral">
              <Sparkles className="size-5" aria-hidden />
            </span>
          </Link>
        </div>
      </header>

      <div className="px-5 pt-6 md:px-10">
        {/* Greeting + Wallet */}
        <section className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 animate-slide-up">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy text-balance sm:text-3xl">
              {t("home.hello")}, {currentEmployee.firstName} 👋
            </h1>
            <p className="mt-1 text-base font-medium text-navy/75">
              {t("home.wallet.sub")} · {formatALL(currentEmployee.monthlyAllowanceALL)}
            </p>
          </div>
          <Link
            to="/employee/profile"
            className="flex shrink-0 items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-2.5 shadow-soft transition hover:border-coral"
            aria-label={t("home.wallet")}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-emerald/15 text-emerald">
              <Wallet className="size-5" aria-hidden />
            </span>
            <span className="text-right">
              <span className="block text-xs font-bold uppercase tracking-wider text-navy/60">
                {t("home.wallet")}
              </span>
              <span className="block font-display text-base font-extrabold tabular-nums text-navy">
                {currentEmployee.walletALL.toLocaleString()} ALL
              </span>
            </span>
          </Link>
        </section>

        {/* Categories — horizontal scroll, Wolt-style icons */}
        <section className="mt-8 animate-slide-up [animation-delay:80ms]">
          <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
            {t("home.categories")}
          </h2>
          <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10">
            {categories.map((c) => (
              <CategoryPill key={c.key} label={t(c.key)} icon={c.icon} tone={c.tone} />
            ))}
          </div>
        </section>

        {/* Featured AI bundle — large Wolt-style hero card */}
        <section className="mt-10 animate-slide-up [animation-delay:160ms]">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
              {t("home.featured")}
            </h2>
          </div>
          <article className="overflow-hidden rounded-3xl bg-navy text-white shadow-lift">
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="relative aspect-[5/3] bg-gradient-to-br from-coral/45 via-coral/20 to-navy md:aspect-auto">
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-navy shadow-soft">
                  <Sparkles className="size-3.5 text-coral" aria-hidden />
                  {t("home.aiPick")} · {aiBundle.matchScore}% {t("home.match")}
                </div>
                <span className="absolute inset-0 grid place-items-center text-6xl">🌿</span>
              </div>
              <div className="flex flex-col gap-5 p-6 sm:p-7">
                <div>
                  <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                    {aiBundle.title}
                  </h3>
                  <p className="mt-2 text-base text-white/85">{aiBundle.tagline}</p>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                      {t("home.wallet.sub").split(" ")[0]}
                    </p>
                    <p className="font-display text-2xl font-extrabold sm:text-3xl">
                      {formatALL(aiBundle.totalALL)}
                    </p>
                  </div>
                  <button className="h-12 rounded-2xl bg-coral px-5 font-display text-base font-extrabold text-white shadow-coral transition hover:bg-white hover:text-navy">
                    {t("home.claim")}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Limited drops */}
        <section className="mt-8 animate-slide-up [animation-delay:200ms]">
          <div className="flex flex-col items-stretch justify-between gap-4 rounded-3xl border-2 border-coral/30 bg-coral/5 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral text-white">
                <Clock className="size-6" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-coral">
                  {t("home.drops")}
                </p>
                <h4 className="font-display text-lg font-extrabold text-navy">{perxDrop.title}</h4>
                <p className="text-sm font-medium text-navy/75">{perxDrop.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-navy/70">
                {t("home.drops.endsIn")}
              </span>
              <Countdown seconds={perxDrop.endsInSeconds} />
            </div>
          </div>
        </section>

        {/* Discover near you — horizontal scroll */}
        <section className="mt-10 animate-slide-up [animation-delay:240ms]">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
              {t("home.discover")}
            </h2>
            <Link
              to="/employee/discover"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-coral hover:underline"
            >
              {t("home.viewAll")} <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10">
            {discoverFeed.map((d) => (
              <div key={d.id} className="w-[280px] shrink-0 sm:w-[300px]">
                <WoltCard
                  title={d.title}
                  provider={d.provider}
                  category={d.category}
                  priceALL={d.priceALL}
                  matchScore={d.matchScore}
                  accent={d.accent}
                  matchLabel={t("home.match")}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Try asking — concierge starters */}
        <section className="mt-10 animate-slide-up [animation-delay:280ms]">
          <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
            {t("home.starters")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {conciergeStarters.map((s) => (
              <Link
                key={s}
                to="/employee/concierge"
                search={{ q: s }}
                className="inline-flex h-11 items-center rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-navy transition hover:border-coral hover:bg-coral hover:text-white"
              >
                {s}
              </Link>
            ))}
          </div>
        </section>

        {/* Team adventures */}
        <section className="mt-10 animate-slide-up [animation-delay:320ms]">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
              {t("home.team")}
            </h2>
            <Link
              to="/employee/team"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-coral hover:underline"
            >
              {t("home.viewAll")} <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teamAdventures.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4 shadow-soft transition hover:border-navy/20"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/60">
                    {a.when}
                  </p>
                  <h5 className="truncate font-display text-base font-extrabold text-navy">
                    {a.title}
                  </h5>
                  <p className="text-sm font-medium text-navy/75">{a.location}</p>
                </div>
                <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-extrabold text-emerald">
                  {a.going}/{a.capacity}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
