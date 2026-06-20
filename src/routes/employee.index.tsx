import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Wallet, ArrowRight, Zap, Plus } from "lucide-react";
import {
  aiBundle,
  conciergeStarters,
  currentEmployee,
  discoverFeed,
  formatALL,
  perxDrop,
  teamAdventures,
} from "@/lib/mock-data";
import { Countdown } from "@/components/perx/Countdown";
import { QuestRing } from "@/components/perx/QuestRing";
import { ExperienceCard } from "@/components/perx/ExperienceCard";

export const Route = createFileRoute("/employee/")({
  head: () => ({
    meta: [
      { title: "Home · Perx" },
      { name: "description", content: "Your AI-personalized lifestyle home: goals, quests, drops, discoveries." },
    ],
  }),
  component: EmployeeHome,
});

function EmployeeHome() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      {/* Greeting + Wallet */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 animate-slide-up">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-navy text-balance sm:text-4xl">
            {currentEmployee.greeting}, {currentEmployee.firstName}.
          </h1>
          <p className="mt-1 text-sm font-medium text-navy/55">
            You've unlocked 3 rewards this week. Keep the streak.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:p-4">
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-wider text-navy/40 sm:text-[10px]">
              Wallet
            </p>
            <p className="font-display text-lg font-extrabold tabular-nums text-navy sm:text-2xl">
              {currentEmployee.walletALL.toLocaleString()} <span className="text-sky">ALL</span>
            </p>
          </div>
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald/10 text-emerald sm:size-10">
            <Wallet className="size-4 sm:size-5" />
          </div>
        </div>
      </header>

      {/* AI Concierge */}
      <section className="mt-8 animate-slide-up [animation-delay:80ms]">
        <Link
          to="/employee/concierge"
          className="group relative block rounded-2xl border-2 border-border bg-card px-5 py-5 shadow-soft transition hover:border-coral hover:shadow-lift sm:px-7 sm:py-6"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-coral sm:size-12">
              <Sparkles className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                AI Lifestyle Concierge
              </p>
              <p className="truncate text-base font-semibold text-navy/60 sm:text-lg">
                Ask anything · "I need a weekend escape"
              </p>
            </div>
            <ArrowRight className="size-5 shrink-0 text-coral transition group-hover:translate-x-1" />
          </div>
        </Link>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {conciergeStarters.map((s) => (
            <Link
              key={s}
              to="/employee/concierge"
              search={{ q: s }}
              className="shrink-0 whitespace-nowrap rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-bold text-navy/60 transition hover:bg-navy hover:text-white"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-8">
          {/* Featured bundle */}
          <article className="overflow-hidden rounded-[28px] bg-navy text-white shadow-lift animate-slide-up [animation-delay:160ms]">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-coral/40 via-coral/20 to-navy md:aspect-auto">
                <div className="absolute inset-0 grid place-items-center px-6 text-center">
                  <div>
                    <p className="font-display text-3xl font-extrabold leading-none text-white/90">
                      🌿
                    </p>
                    <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/60">
                      AI-curated bundle
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-sky">
                    <span className="size-1.5 rounded-full bg-sky" /> AI Selection · {aiBundle.matchScore}% match
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                    {aiBundle.title}
                  </h2>
                  <p className="mt-2 text-pretty text-sm text-white/60 sm:text-base">
                    {aiBundle.tagline}
                  </p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky">
                      Why it matches
                    </p>
                    <p className="mt-1 text-sm text-white/85">{aiBundle.reasoning}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Total bundle
                    </p>
                    <p className="font-display text-2xl font-extrabold sm:text-3xl">
                      {formatALL(aiBundle.totalALL)}
                    </p>
                  </div>
                  <button className="rounded-2xl bg-coral px-6 py-3 font-display text-base font-extrabold text-white shadow-coral transition hover:-translate-y-0.5 hover:bg-white hover:text-navy">
                    Claim Bundle
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Drops */}
          <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border-2 border-dashed border-coral/30 bg-coral/5 p-5 sm:flex-row sm:items-center sm:p-6 animate-slide-up [animation-delay:240ms]">
            <div className="flex items-center gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-coral text-white">
                <Zap className="size-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-base font-extrabold text-navy">
                  Perx Drop: {perxDrop.title}
                </h4>
                <p className="text-sm font-medium text-navy/60">{perxDrop.desc}</p>
              </div>
            </div>
            <Countdown seconds={perxDrop.endsInSeconds} />
          </div>

          {/* Discover */}
          <section className="animate-slide-up [animation-delay:320ms]">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  Personalized for you
                </p>
                <h3 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                  Discover
                </h3>
              </div>
              <Link to="/employee/discover" className="text-sm font-bold text-coral">
                View all →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {discoverFeed.slice(0, 4).map((d) => (
                <ExperienceCard
                  key={d.id}
                  title={d.title}
                  provider={d.provider}
                  category={d.category}
                  priceALL={d.priceALL}
                  matchScore={d.matchScore}
                  accent={d.accent}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:col-span-4 animate-slide-up [animation-delay:200ms]">
          {/* Benefit DNA */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div
              aria-hidden
              className="absolute -right-6 -top-6 size-32 rounded-full bg-sky/10"
            />
            <h3 className="relative font-display text-lg font-extrabold text-navy sm:text-xl">
              Benefit DNA
            </h3>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {currentEmployee.dna.map((tag, i) => {
                const colors = ["bg-navy", "bg-sky", "bg-coral"];
                return (
                  <span
                    key={tag}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold text-white ${colors[i % 3]}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <div className="relative mt-6 border-t border-border pt-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                Top strength
              </p>
              <p className="mt-2 text-sm font-medium text-navy/80">
                You prioritize skill growth and outdoor activities. We're tuning rewards to match.
              </p>
            </div>
          </div>

          {/* Quests */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-navy sm:text-xl">
                Active Quests
              </h3>
              <Link to="/employee/quests" className="text-xs font-bold text-coral">
                View all
              </Link>
            </div>
            <div className="space-y-6">
              {currentEmployee.quests.map((q) => (
                <div key={q.id} className="flex items-center gap-4">
                  <QuestRing percent={q.progress} color={q.color} />
                  <div className="min-w-0">
                    <h5 className="truncate font-display text-sm font-extrabold text-navy">
                      {q.title}
                    </h5>
                    <p className="text-xs text-navy/55">{q.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Adventures */}
          <div className="rounded-3xl bg-navy p-6 text-white shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold">Team Adventures</h3>
              <Link to="/employee/team" className="text-xs font-bold text-coral">
                See all
              </Link>
            </div>
            <div className="mb-5 flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`size-9 rounded-full border-2 border-navy ${
                    ["bg-stone-300", "bg-stone-400", "bg-stone-500", "bg-coral"][i]
                  } ${i === 3 ? "grid place-items-center text-[10px] font-extrabold text-white" : ""}`}
                >
                  {i === 3 && "+5"}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky">
                {teamAdventures[0].when}
              </p>
              <p className="mt-1 font-display text-sm font-extrabold">
                {teamAdventures[0].title}
              </p>
              <p className="mt-1 text-xs text-white/60">{teamAdventures[0].location}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile floating AI button */}
      <Link
        to="/employee/concierge"
        className="fixed bottom-24 right-5 z-30 grid size-14 place-items-center rounded-full bg-coral text-white shadow-coral transition hover:scale-110 md:hidden"
        aria-label="Open AI Concierge"
      >
        <Plus className="size-6" />
      </Link>
    </div>
  );
}
