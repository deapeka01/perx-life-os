import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckSquare, Users, BarChart3 } from "lucide-react";
import { AgentChat } from "@/components/perx/AgentChat";
import {
  currentCompany,
  formatALL,
  pendingApprovals,
} from "@/lib/mock-data";

export const Route = createFileRoute("/company/")({
  head: () => ({ meta: [{ title: "Company HQ · Perx" }] }),
  component: CompanyHome,
});

function CompanyHome() {
  return (
    <div className="mx-auto h-[calc(100dvh-72px)] max-w-7xl px-5 pb-5 md:px-10">
      <AgentChat agent="company" rightRail={<SideRail />} />
    </div>
  );
}

function SideRail() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
          {currentCompany.name} · live KPIs
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Kpi label="Engagement" value={`${currentCompany.engagementScore}`} sub="+6 vs LM" />
          <Kpi label="Goal completion" value={`${currentCompany.goalCompletionPct}%`} sub="Above avg" />
          <Kpi label="Utilization" value={`${currentCompany.utilizationPct}%`} sub="of budget" />
          <Kpi label="People" value={`${currentCompany.employees}`} sub="+12 QoQ" />
        </div>
        <p className="mt-3 text-xs font-medium text-navy/55">
          Monthly budget · {formatALL(currentCompany.monthlyBudgetALL)}
        </p>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
            Pending approvals
          </p>
          <Link to="/company/approvals" className="text-xs font-extrabold text-coral">
            All <ArrowRight className="inline size-3" />
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {pendingApprovals.slice(0, 3).map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-semibold text-navy backdrop-blur"
            >
              <span className="truncate">{a.employee}</span>
              <span className="shrink-0 font-display text-xs font-extrabold tabular-nums">
                {formatALL(a.costALL)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <QuickTile to="/company/approvals" icon={CheckSquare} label="Approve" />
        <QuickTile to="/company/employees" icon={Users} label="People" />
        <QuickTile to="/company/analytics" icon={BarChart3} label="Insights" />
      </div>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-3 backdrop-blur">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-navy">{value}</p>
      <p className="text-[10px] font-bold text-emerald">{sub}</p>
    </div>
  );
}

function QuickTile({
  to,
  icon: Icon,
  label,
}: {
  to: "/company/approvals" | "/company/employees" | "/company/analytics";
  icon: typeof CheckSquare;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 rounded-2xl border border-white/60 bg-white/60 p-3 text-xs font-extrabold text-navy shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-coral/40"
    >
      <Icon className="size-4 text-coral" />
      {label}
    </Link>
  );
}
