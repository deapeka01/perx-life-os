import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { QuestRing } from "@/components/perx/QuestRing";
import { currentEmployee } from "@/lib/mock-data";
import { Trophy, Award, Flame } from "lucide-react";

export const Route = createFileRoute("/employee/quests")({
  head: () => ({ meta: [{ title: "Life Quests · Perx" }] }),
  component: Quests,
});

const badges = [
  { id: "b1", name: "First Step", earned: true, icon: Trophy },
  { id: "b2", name: "Streak 7", earned: true, icon: Flame },
  { id: "b3", name: "Wellness Pro", earned: true, icon: Award },
  { id: "b4", name: "AI Apprentice", earned: false, icon: Trophy },
  { id: "b5", name: "Alpine Scholar", earned: false, icon: Award },
  { id: "b6", name: "Team Hero", earned: false, icon: Trophy },
];

function Quests() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Gamified growth"
        title="Life Quests"
        subtitle="Earn badges, unlock rewards, get recognized by your company."
      />

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {currentEmployee.quests.map((q) => (
          <div key={q.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-5">
              <QuestRing percent={q.progress} color={q.color} size={80} />
              <div className="min-w-0">
                <h3 className="truncate font-display text-lg font-extrabold text-navy">{q.title}</h3>
                <p className="text-sm text-navy/55">{q.desc}</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-xl bg-navy py-2.5 text-sm font-extrabold text-white transition hover:bg-coral">
              Continue quest
            </button>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h3 className="font-display text-xl font-extrabold text-navy">Badges</h3>
        <p className="mt-1 text-sm text-navy/55">3 of 12 earned · keep going.</p>
        <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                  b.earned
                    ? "border-coral/30 bg-coral/10 text-coral shadow-coral"
                    : "border-border bg-muted text-navy/30"
                }`}
              >
                <Icon className="size-7" strokeWidth={2.2} />
                <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wide">
                  {b.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
