import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Wallet,
  Briefcase,
  Heart,
  ChevronRight,
  Trophy,
} from "lucide-react";
import {
  currentEmployee,
  discoverFeed,
  feelingChips,
  formatALL,
  perxDrops,
  teamAdventures,
} from "@/lib/mock-data";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";
import { FeelingChip } from "@/components/perx/FeelingChip";
import { GoalCard } from "@/components/perx/GoalCard";
import { DnaStrip } from "@/components/perx/DnaStrip";
import { PerxDropCard } from "@/components/perx/PerxDropCard";
import { QuestRing } from "@/components/perx/QuestRing";

export const Route = createFileRoute("/employee/")({
  head: () => ({
    meta: [
      { title: "Home · Perx" },
      {
        name: "description",
        content:
          "Your AI Lifestyle Concierge — turn company-funded budgets into meaningful life progress.",
      },
    ],
  }),
  component: EmployeeHome,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function EmployeeHome() {
  const hello = greeting();
  const topPicks = discoverFeed.slice(0, 4);

  return (
    <div className="pb-14">
      {/* Top utility bar — minimal, calm */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-canvas/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-5 py-3 md:px-10">
          <Link to="/" aria-label="Perx home" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-ai font-display text-base font-extrabold text-white ring-ai">
              P
            </span>
            <span className="hidden font-display text-base font-extrabold text-navy sm:block">
              Perx
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/employee/profile"
              aria-label="Wallet"
              className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-1.5 shadow-soft transition hover:border-coral"
            >
              <span className="grid size-7 place-items-center rounded-full bg-emerald/15 text-emerald">
                <Wallet className="size-3.5" aria-hidden />
              </span>
              <span className="font-display text-sm font-extrabold tabular-nums text-navy">
                {currentEmployee.walletALL.toLocaleString()} ALL
              </span>
            </Link>
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>

      <div className="px-5 pt-8 md:px-10 md:pt-12">
        {/* ─── HERO: How are you feeling? ─── */}
        <section className="animate-slide-up">
          <p className="text-sm font-extrabold uppercase tracking-widest text-navy/55">
            {hello}, {currentEmployee.firstName}.
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-navy text-balance sm:text-5xl">
            How are you <span className="text-gradient-ai">feeling</span> today?
          </h1>
          <p className="mt-3 max-w-xl text-base font-medium text-navy/70 sm:text-lg">
            Tell Perx in one tap — your AI Lifestyle Concierge picks the next small thing to make this week better.
          </p>

          {/* Feeling chips */}
          <div className="-mx-5 mt-6 flex gap-2.5 overflow-x-auto px-5 pb-2 md:-mx-10 md:flex-wrap md:overflow-visible md:px-10">
            {feelingChips.map((c) => (
              <FeelingChip key={c.id} emoji={c.emoji} label={c.label} prompt={c.prompt} />
            ))}
          </div>

          {/* Direct chat entry */}
          <Link
            to="/employee/concierge"
            className="group mt-5 flex max-w-2xl items-center gap-3 rounded-2xl border-2 border-navy/15 bg-card px-4 py-3.5 shadow-soft transition hover:border-coral hover:shadow-lift"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <span className="flex-1 truncate text-base font-semibold text-navy/70">
              …or just type. "I have 10,000 ALL, plan something good."
            </span>
            <ChevronRight className="size-5 text-navy/40 transition group-hover:translate-x-1 group-hover:text-coral" />
          </Link>
        </section>

        {/* ─── GOALS ─── */}
        <section className="mt-12 animate-slide-up [animation-delay:80ms]">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-navy/55">
              What you're working toward
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">
              Your goals this season
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <GoalCard
              eyebrow="Professional"
              label={currentEmployee.professionalGoal.label}
              progress={currentEmployee.professionalGoal.progress}
              next={currentEmployee.professionalGoal.next}
              icon={Briefcase}
              tone="sky"
            />
            <GoalCard
              eyebrow="Lifestyle"
              label={currentEmployee.lifestyleGoal.label}
              progress={currentEmployee.lifestyleGoal.progress}
              next={currentEmployee.lifestyleGoal.next}
              icon={Heart}
              tone="coral"
            />
          </div>
        </section>

        {/* ─── DNA + QUESTS row ─── */}
        <section className="mt-10 grid animate-slide-up gap-5 lg:grid-cols-[1fr_1.1fr] [animation-delay:140ms]">
          <DnaStrip traits={currentEmployee.dna} />

          <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/55">
                  Active quests
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold text-navy">
                  Keep your streak going
                </h3>
              </div>
              <Link
                to="/employee/quests"
                className="inline-flex items-center gap-1 text-sm font-extrabold text-coral hover:underline"
              >
                All <ChevronRight className="size-4" />
              </Link>
            </div>
            <ul className="mt-5 space-y-3">
              {currentEmployee.quests.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center gap-4 rounded-2xl border-2 border-border bg-canvas/60 p-3 transition hover:border-navy/15"
                >
                  <QuestRing percent={q.progress} color={q.color} size={56} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-extrabold text-navy">{q.title}</p>
                    <p className="truncate text-sm font-medium text-navy/65">{q.desc}</p>
                  </div>
                  <Trophy className="size-5 shrink-0 text-coral/70" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── PERX DROPS ─── */}
        <section className="mt-12 animate-slide-up [animation-delay:200ms]">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-coral">
              Perx Drops · this week only
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">
              Limited experiences
            </h2>
          </div>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:grid md:grid-cols-3 md:overflow-visible md:px-10">
            {perxDrops.map((d) => (
              <PerxDropCard key={d.id} {...d} />
            ))}
          </div>
        </section>

        {/* ─── DISCOVER PREVIEW ─── */}
        <section className="mt-12 animate-slide-up [animation-delay:260ms]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-navy/55">
                Curated for your Benefit DNA
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Discover
              </h2>
            </div>
            <Link
              to="/employee/discover"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-coral hover:underline"
            >
              See all <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topPicks.map((p) => (
              <article
                key={p.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-navy/15 hover:shadow-lift"
              >
                <div
                  className={`relative aspect-[5/4] bg-gradient-to-br ${
                    p.accent === "coral"
                      ? "from-coral/30 via-coral/10 to-transparent"
                      : p.accent === "sky"
                        ? "from-sky/30 via-sky/10 to-transparent"
                        : "from-emerald/30 via-emerald/10 to-transparent"
                  }`}
                >
                  <span className="absolute inset-0 grid place-items-center text-6xl" aria-hidden>
                    {p.emoji}
                  </span>
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-extrabold text-white shadow-soft">
                    <Sparkles className="size-3 text-coral" aria-hidden /> {p.matchScore}% match
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/55">
                    {p.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-display text-base font-extrabold leading-snug text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-navy/65">{p.story}</p>
                  <p className="mt-auto pt-3 font-display text-base font-extrabold text-navy">
                    {formatALL(p.priceALL)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── TEAM ADVENTURES ─── */}
        <section className="mt-12 animate-slide-up [animation-delay:320ms]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-navy/55">
                Better together
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Team adventures
              </h2>
            </div>
            <Link
              to="/employee/team"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-coral hover:underline"
            >
              All <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teamAdventures.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4 shadow-soft transition hover:border-navy/15"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/55">
                    {a.when}
                  </p>
                  <p className="truncate font-display text-base font-extrabold text-navy">
                    {a.title}
                  </p>
                  <p className="text-sm font-medium text-navy/65">{a.location}</p>
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
