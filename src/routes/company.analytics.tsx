import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { StatTile } from "@/components/perx/StatTile";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/company/analytics")({
  head: () => ({ meta: [{ title: "Insights · Perx" }] }),
  component: Analytics,
});

const trend = [42, 48, 55, 52, 64, 71, 68, 74, 82, 79, 85, 88];
const categories = [
  { name: "Wellness", pct: 42, color: "bg-coral" },
  { name: "Learning", pct: 27, color: "bg-sky" },
  { name: "Travel", pct: 14, color: "bg-emerald" },
  { name: "Workspace", pct: 10, color: "bg-navy" },
  { name: "Food", pct: 7, color: "bg-coral/60" },
];

function Analytics() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Last 12 months"
        title="Insights"
        subtitle="Where the budget flows and what your people love."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile label="Engagement trend" value="+38%" delta="vs. start of year" tone="coral" />
        <StatTile label="Avg. quests completed" value="2.4" delta="per employee / mo" />
        <StatTile label="Bundle adoption" value="71%" delta="of approved requests" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-extrabold text-navy">Engagement over time</h3>
            <span className="text-xs font-bold text-navy/50">12 months</span>
          </div>
          <div className="mt-8 flex h-56 items-end gap-2 sm:gap-3">
            {trend.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-coral to-coral/40 transition hover:brightness-110"
                style={{ height: `${v}%` }}
                title={`Month ${i + 1}: ${v}`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl font-extrabold text-navy">Budget by category</h3>
          <div className="mt-6 space-y-4">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex justify-between text-xs font-bold">
                  <span className="text-navy">{c.name}</span>
                  <span className="text-navy/55">{c.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-navy p-6 text-white shadow-lift sm:p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="size-5 text-coral" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-coral">
            AI prediction
          </p>
        </div>
        <h3 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
          If you shift 15% from gym memberships into wellness bundles, predicted engagement
          climbs <span className="text-coral">+8 points</span> in 60 days.
        </h3>
        <button className="mt-6 rounded-xl bg-coral px-5 py-2.5 text-sm font-extrabold text-white shadow-coral transition hover:-translate-y-0.5">
          Simulate this change
        </button>
      </div>
    </div>
  );
}
