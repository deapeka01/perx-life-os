import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Users, Sparkles, Compass, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AgentChat } from "@/components/perx/AgentChat";
import { getMyWallet, getMyDna } from "@/lib/perx/sim.functions";

export const Route = createFileRoute("/employee/")({
  head: () => ({ meta: [{ title: "Home · Perx" }] }),
  component: EmployeeHome,
});

function EmployeeHome() {
  return (
    <div className="mx-auto h-[calc(100dvh-72px)] max-w-7xl px-5 pb-5 md:px-10">
      <AgentChat agent="employee" rightRail={<SideRail />} />
    </div>
  );
}

function SideRail() {
  const wFn = useServerFn(getMyWallet);
  const dFn = useServerFn(getMyDna);
  const [wallet, setWallet] = useState<{ balance_all: number; monthly_allowance_all: number } | null>(null);
  const [dna, setDna] = useState<any | null>(null);

  useEffect(() => {
    wFn().then((w) => setWallet(w as any)).catch(() => {});
    dFn().then((d) => setDna(d)).catch(() => {});
  }, [wFn, dFn]);

  const bal = wallet?.balance_all ?? 0;
  const allow = wallet?.monthly_allowance_all || 50000;
  const pct = Math.min(100, Math.round((bal / Math.max(allow, 1)) * 100));

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">Your wallet</p>
        <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-navy">
          {bal.toLocaleString()} <span className="text-base text-navy/55">ALL</span>
        </p>
        <p className="mt-1 text-xs font-semibold text-navy/55">of {allow.toLocaleString()} monthly</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy/10">
          <div className="h-full rounded-full bg-gradient-ai" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">Your Benefit DNA</p>
        {dna ? (
          <>
            <p className="mt-1 font-display text-base font-extrabold text-navy">
              {dna.archetypes?.[0]?.emoji ?? "✨"} {dna.primary_archetype}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(dna.archetypes ?? []).slice(0, 5).map((d: any, i: number) => (
                <span key={i} className="rounded-full bg-navy/5 px-2.5 py-1 text-xs font-bold text-navy/70">
                  {d.emoji} {d.trait}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-navy/55">Finish onboarding to unlock your DNA profile.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickTile to="/employee/quests" icon={Trophy} label="Quests" />
        <QuickTile to="/employee/team" icon={Users} label="Team" />
        <QuickTile to="/employee/discover" icon={Compass} label="Discover" />
        <QuickTile to="/employee/profile" icon={Wallet} label="Profile" />
      </div>

      <p className="px-1 text-xs font-medium text-navy/45">
        <Sparkles className="mr-1 inline size-3 text-coral" />
        Everything else lives in conversation. Just ask.
      </p>
    </div>
  );
}

function QuickTile({ to, icon: Icon, label }: {
  to: "/employee/quests" | "/employee/team" | "/employee/discover" | "/employee/profile";
  icon: typeof Trophy; label: string;
}) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-2xl border border-white/50 bg-white/60 p-3 text-sm font-extrabold text-navy shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-coral/40">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
        <Icon className="size-4" />
      </span>
      {label}
    </Link>
  );
}
