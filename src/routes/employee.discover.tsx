import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { discoverFeed, formatALL, perxDrops } from "@/lib/mock-data";
import { Sparkles } from "lucide-react";
import { PerxDropCard } from "@/components/perx/PerxDropCard";

export const Route = createFileRoute("/employee/discover")({
  head: () => ({ meta: [{ title: "Discover · Perx" }] }),
  component: Discover,
});

const filters = ["All", "Wellness", "Growth", "Adventure", "Workspace", "Travel", "Food"];

function Discover() {
  const [hero, ...rest] = discoverFeed;

  return (
    <div className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="For you · 24 picks today"
        title="Discover"
        subtitle="A feed of experiences hand-picked by Perx for your DNA, goals, and budget — not a marketplace."
      />

      <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:flex-wrap md:px-10">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold transition ${
              i === 0
                ? "bg-navy text-white"
                : "border-2 border-border bg-card text-navy/70 hover:border-navy/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Hero pick */}
      <Link
        to="/employee/concierge"
        search={{ q: `Tell me more about ${hero.title}` }}
        className="group mt-8 block overflow-hidden rounded-3xl border-2 border-border bg-card shadow-lift transition hover:-translate-y-1"
      >
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          <div className={`relative aspect-[5/3] overflow-hidden bg-gradient-to-br ${
            hero.accent === "coral"
              ? "from-coral/40 via-coral/10 to-transparent"
              : hero.accent === "sky"
                ? "from-sky/40 via-sky/10 to-transparent"
                : "from-emerald/40 via-emerald/10 to-transparent"
          } md:aspect-auto`}>
            {hero.image ? (
              <img
                src={hero.image}
                alt={hero.title}
                width={1024}
                height={640}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center text-8xl" aria-hidden>
                {hero.emoji}
              </span>
            )}
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-xs font-extrabold text-white shadow-soft">
              <Sparkles className="size-3.5 text-coral" aria-hidden /> Top pick · {hero.matchScore}% match
            </span>
          </div>
          <div className="flex flex-col justify-between gap-5 p-6 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-navy/55">
                {hero.category} · {hero.provider}
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                {hero.title}
              </h3>
              <p className="mt-3 text-base font-medium text-navy/70">{hero.story}</p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <p className="font-display text-2xl font-extrabold text-navy">
                {formatALL(hero.priceALL)}
              </p>
              <span className="rounded-2xl bg-coral px-5 py-3 font-display text-sm font-extrabold text-white shadow-coral">
                Talk to Perx →
              </span>
            </div>
          </div>
        </div>
      </Link>

      <section className="mt-10">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-coral">
            Perx Drops · this week only
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold text-navy sm:text-2xl">
            Limited experiences
          </h2>
        </div>
        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:grid md:grid-cols-3 md:overflow-visible md:px-10">
          {perxDrops.map((d) => (
            <PerxDropCard key={d.id} {...d} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-extrabold text-navy sm:text-2xl">
          More for you
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((d) => (
            <article
              key={d.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-navy/15 hover:shadow-lift"
            >
              <div className={`relative aspect-[5/3] overflow-hidden bg-gradient-to-br ${
                d.accent === "coral"
                  ? "from-coral/30 via-coral/10 to-transparent"
                  : d.accent === "sky"
                    ? "from-sky/30 via-sky/10 to-transparent"
                    : "from-emerald/30 via-emerald/10 to-transparent"
              }`}>
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.title}
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-7xl" aria-hidden>
                    {d.emoji}
                  </span>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-extrabold text-white">
                  <Sparkles className="size-3 text-coral" aria-hidden /> {d.matchScore}% match
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy/55">
                  {d.category} · {d.provider}
                </p>
                <h3 className="mt-1 line-clamp-2 font-display text-lg font-extrabold leading-snug text-navy">
                  {d.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-navy/65">{d.story}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <p className="font-display text-base font-extrabold text-navy">
                    {formatALL(d.priceALL)}
                  </p>
                  <Link
                    to="/employee/concierge"
                    search={{ q: `Tell me more about ${d.title}` }}
                    className="text-sm font-extrabold text-coral transition group-hover:translate-x-1"
                  >
                    Ask Perx →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
