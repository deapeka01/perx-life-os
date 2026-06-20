import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { StatTile } from "@/components/perx/StatTile";
import { currentEmployee, formatALL } from "@/lib/mock-data";
import { Wallet, Target, Trophy, LogOut, Briefcase, Heart } from "lucide-react";
import { DnaStrip } from "@/components/perx/DnaStrip";

export const Route = createFileRoute("/employee/profile")({
  head: () => ({ meta: [{ title: "Profile · Perx" }] }),
  component: Profile,
});

function Profile() {
  const goals = [
    { id: "pro", label: currentEmployee.professionalGoal.label, progress: currentEmployee.professionalGoal.progress, kind: "Professional" },
    { id: "life", label: currentEmployee.lifestyleGoal.label, progress: currentEmployee.lifestyleGoal.progress, kind: "Lifestyle" },
  ];

  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Your story"
        title={`${currentEmployee.firstName} ${currentEmployee.lastName}`}
        subtitle={`${currentEmployee.department} · ${currentEmployee.company}`}
        actions={
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-extrabold text-navy/60 transition hover:bg-muted"
          >
            <LogOut className="size-3.5" /> Switch role
          </Link>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile label="Wallet" value={formatALL(currentEmployee.walletALL)} icon={<Wallet className="size-4" />} delta="+8,000 this month" />
        <StatTile label="Active goals" value={goals.length} icon={<Target className="size-4" />} delta="Both on track" />
        <StatTile label="Quests" value={currentEmployee.quests.length} icon={<Trophy className="size-4" />} delta="1 close to complete" />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-extrabold text-navy">Goals</h3>
          <div className="mt-5 space-y-6">
            {goals.map((g) => {
              const Icon = g.kind === "Professional" ? Briefcase : Heart;
              return (
                <div key={g.id}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 font-bold text-navy">
                      <Icon className="size-4 text-coral" /> {g.label}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-navy/50">
                        · {g.kind}
                      </span>
                    </span>
                    <span className="font-extrabold text-coral">{g.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-coral transition-all duration-1000"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DnaStrip traits={currentEmployee.dna} />
      </section>

      <section className="mt-10 rounded-3xl border-2 border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-extrabold text-navy">Recent activity</h3>
        <ul className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          {[
            { t: "Claimed Weekend Recharge bundle", w: "2 days ago" },
            { t: "Completed Mindfulness Streak day 4", w: "4 days ago" },
            { t: "Joined Theth Peak Expedition", w: "1 week ago" },
            { t: "Earned Wellness Pro badge", w: "2 weeks ago" },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-coral" />
              <div className="flex-1">
                <p className="font-bold text-navy">{a.t}</p>
                <p className="text-xs text-navy/55">{a.w}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
