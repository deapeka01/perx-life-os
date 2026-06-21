import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/perx/PageHeader";
import { QuestRing } from "@/components/perx/QuestRing";
import { listQuests, advanceQuest } from "@/lib/perx/sim.functions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/quests")({
  head: () => ({ meta: [{ title: "Life Quests · Perx" }] }),
  component: Quests,
});

const colorCycle = ["coral", "sky", "emerald"] as const;

function Quests() {
  const listFn = useServerFn(listQuests);
  const advFn = useServerFn(advanceQuest);
  const [rows, setRows] = useState<any[]>([]);
  const [working, setWorking] = useState<string | null>(null);

  const load = () => listFn().then((r) => setRows(r as any[])).catch(() => {});
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const advance = async (id: string) => {
    setWorking(id);
    try {
      const r = await advFn({ data: { quest_id: id } }) as any;
      if (r.completed) toast.success("Quest completed! Reward credited.");
      else toast.success("Progress logged.");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setWorking(null); }
  };

  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Gamified growth"
        title="Life Quests"
        subtitle="Make progress, earn ALL credits straight to your wallet."
      />

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((q, i) => {
          const pct = q.target_progress > 0 ? Math.round((q.progress / q.target_progress) * 100) : 0;
          return (
            <div key={q.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-5">
                <QuestRing percent={pct} color={colorCycle[i % 3]} size={80} />
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-extrabold text-navy">
                    {q.badge_emoji} {q.title}
                  </h3>
                  <p className="text-sm text-navy/55">{q.description}</p>
                  <p className="mt-1 text-xs font-extrabold text-coral">
                    Reward: {q.reward_all.toLocaleString()} ALL
                  </p>
                </div>
              </div>
              <button onClick={() => advance(q.id)} disabled={q.claimed || working === q.id}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-2.5 text-sm font-extrabold text-white transition hover:bg-coral disabled:opacity-40">
                {working === q.id && <Loader2 className="size-4 animate-spin" />}
                {q.claimed ? "Reward claimed ✓" : q.completed ? "Claim reward" : `Log step (${q.progress}/${q.target_progress})`}
              </button>
            </div>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-navy/50">Loading quests…</p>}
      </section>
    </div>
  );
}
