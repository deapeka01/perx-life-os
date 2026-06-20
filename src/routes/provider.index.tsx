import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Package, Radar, Megaphone } from "lucide-react";
import { AgentChat } from "@/components/perx/AgentChat";
import {
  corporateDemand,
  currentProvider,
  formatALL,
} from "@/lib/mock-data";

export const Route = createFileRoute("/provider/")({
  head: () => ({ meta: [{ title: "Provider Studio · Perx" }] }),
  component: ProviderHome,
});

function ProviderHome() {
  return (
    <div className="mx-auto h-[calc(100dvh-72px)] max-w-7xl px-5 pb-5 md:px-10">
      <AgentChat agent="provider" rightRail={<SideRail />} />
    </div>
  );
}

function SideRail() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
          {currentProvider.name} · this month
        </p>
        <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-navy">
          {formatALL(currentProvider.monthlyRevenueALL)}
        </p>
        <p className="text-xs font-bold text-emerald">+22% MoM</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <Stat label="Bookings" value={currentProvider.bookings} />
          <Stat label="Pending" value={currentProvider.pendingRequests} />
          <Stat label="Companies" value={currentProvider.corporateReach} />
        </div>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-coral">
            Corporate demand feed · live
          </p>
          <Link to="/provider/demand" className="text-xs font-extrabold text-coral">
            All <ArrowRight className="inline size-3" />
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {corporateDemand.slice(0, 4).map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/70 px-3 py-2 backdrop-blur"
            >
              <span
                className={`grid size-9 place-items-center rounded-lg text-sm font-extrabold ${
                  {
                    coral: "bg-coral/10 text-coral",
                    sky: "bg-sky/10 text-sky",
                    emerald: "bg-emerald/10 text-emerald",
                  }[d.color]
                }`}
              >
                {d.employees}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-navy">{d.segment}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald">
                  {d.trend} · 30d
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <QuickTile to="/provider/services" icon={Package} label="Offers" />
        <QuickTile to="/provider/demand" icon={Radar} label="Demand" />
        <QuickTile to="/provider/marketing" icon={Megaphone} label="Market" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-navy/5 px-2 py-2 text-center">
      <p className="font-display text-base font-extrabold tabular-nums text-navy">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">{label}</p>
    </div>
  );
}

function QuickTile({
  to,
  icon: Icon,
  label,
}: {
  to: "/provider/services" | "/provider/demand" | "/provider/marketing";
  icon: typeof Package;
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
