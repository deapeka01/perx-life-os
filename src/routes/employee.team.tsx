import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { teamAdventures } from "@/lib/mock-data";
import { Users, MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/employee/team")({
  head: () => ({ meta: [{ title: "Team Adventures · Perx" }] }),
  component: TeamAdventures,
});

function TeamAdventures() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Better together"
        title="Team Adventures"
        subtitle="Group experiences with your colleagues — join, vote, plan."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teamAdventures.map((t) => (
          <article
            key={t.id}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-coral/30 via-sky/20 to-transparent">
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                width={1024}
                height={640}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="space-y-3 p-5">
              <h3 className="font-display text-lg font-extrabold text-navy">{t.title}</h3>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-navy/55">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" /> {t.when}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> {t.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" /> {t.going}/{t.capacity}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(t.going, 4) }).map((_, i) => (
                    <div
                      key={i}
                      className={`size-7 rounded-full border-2 border-card ${
                        ["bg-stone-300", "bg-stone-400", "bg-coral", "bg-sky"][i % 4]
                      }`}
                    />
                  ))}
                </div>
                <button className="rounded-xl bg-navy px-4 py-2 text-xs font-extrabold text-white transition hover:bg-coral">
                  Join
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
