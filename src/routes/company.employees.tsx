import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { companyEmployees } from "@/lib/mock-data";

export const Route = createFileRoute("/company/employees")({
  head: () => ({ meta: [{ title: "People · Perx" }] }),
  component: People,
});

function People() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${companyEmployees.length} of 184 shown`}
        title="People"
        subtitle="Benefit DNA, goal progress, and engagement at a glance."
      />
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="hidden grid-cols-[2fr_1fr_1.2fr_0.8fr_1fr] gap-4 border-b border-border bg-muted/40 px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-navy/50 lg:grid">
          <span>Employee</span>
          <span>Department</span>
          <span>Benefit DNA</span>
          <span>Goals</span>
          <span>Completion</span>
        </div>
        <ul className="divide-y divide-border">
          {companyEmployees.map((e) => (
            <li
              key={e.name}
              className="grid grid-cols-[1fr_auto] gap-3 px-5 py-4 sm:px-6 lg:grid-cols-[2fr_1fr_1.2fr_0.8fr_1fr] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-sm font-extrabold text-white">
                  {e.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold text-navy">
                    {e.name}
                  </p>
                  <p className="text-xs text-navy/50 lg:hidden">
                    {e.dept} · {e.dna}
                  </p>
                </div>
              </div>
              <span className="hidden text-sm font-bold text-navy/60 lg:inline">{e.dept}</span>
              <span className="hidden lg:inline">
                <span className="rounded-md bg-coral/10 px-2 py-1 text-[10px] font-extrabold text-coral">
                  {e.dna}
                </span>
              </span>
              <span className="hidden text-sm font-bold text-navy/60 lg:inline">{e.goals}</span>
              <div className="flex items-center gap-3">
                <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-muted lg:block">
                  <div
                    className="h-full rounded-full bg-coral"
                    style={{ width: `${e.completion}%` }}
                  />
                </div>
                <span className="font-display text-sm font-extrabold text-navy">
                  {e.completion}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
