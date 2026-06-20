import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { StatTile } from "@/components/perx/StatTile";
import {
  companyInsights,
  currentCompany,
  formatALL,
  pendingApprovals,
} from "@/lib/mock-data";
import { Users, Wallet, TrendingUp, Target, Sparkles, ArrowRight, LogOut } from "lucide-react";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Company Overview · Perx" }] }),
  component: CompanyOverview,
});

function CompanyOverview() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${currentCompany.industry} · ${currentCompany.employees} people`}
        title={`${currentCompany.name} HQ`}
        subtitle="Fund growth. Approve smart. Watch engagement climb."
        actions={
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-extrabold text-navy/60 transition hover:bg-muted"
          >
            <LogOut className="size-3.5" /> Switch role
          </Link>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Active employees" value={currentCompany.employees} icon={<Users className="size-4" />} delta="+12 this quarter" />
        <StatTile label="Monthly budget" value={formatALL(currentCompany.monthlyBudgetALL)} icon={<Wallet className="size-4" />} delta={`${currentCompany.utilizationPct}% utilized`} />
        <StatTile label="Engagement" value={`${currentCompany.engagementScore}/100`} icon={<TrendingUp className="size-4" />} delta="+6 vs last month" tone="coral" />
        <StatTile label="Goal completion" value={`${currentCompany.goalCompletionPct}%`} icon={<Target className="size-4" />} delta="Above industry avg" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* AI Strategist */}
        <section className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                Powered by Perx AI
              </p>
              <h2 className="font-display text-2xl font-extrabold text-navy">
                Benefits Strategist
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-coral">
              <Sparkles className="size-3" /> 3 new insights
            </span>
          </div>
          <div className="space-y-4">
            {companyInsights.map((i) => (
              <article
                key={i.id}
                className="group flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy text-coral">
                  <Sparkles className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-extrabold text-navy">
                    {i.headline}
                  </p>
                  <p className="mt-1 text-sm text-navy/60">{i.action}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-md bg-emerald/10 px-2 py-1 text-[10px] font-extrabold text-emerald">
                      Predicted: {i.impact}
                    </span>
                    <button className="text-xs font-extrabold text-coral">
                      Apply recommendation →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pending approvals snapshot */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold text-navy">Pending</h2>
            <Link to="/company/approvals" className="text-xs font-bold text-coral">
              View all <ArrowRight className="inline size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingApprovals.slice(0, 3).map((a) => (
              <div key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-extrabold text-navy">
                      {a.employee}
                    </p>
                    <p className="truncate text-xs text-navy/55">{a.request}</p>
                  </div>
                  <p className="shrink-0 font-display text-sm font-extrabold text-navy">
                    {formatALL(a.costALL)}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-emerald py-2 text-xs font-extrabold text-white transition hover:brightness-110">
                    Approve
                  </button>
                  <button className="flex-1 rounded-lg bg-muted py-2 text-xs font-extrabold text-navy/60 hover:bg-navy/10">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
