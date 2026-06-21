import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/perx/PageHeader";
import { StatTile } from "@/components/perx/StatTile";
import { Sparkles, Loader2, Send, Instagram, Facebook, Linkedin } from "lucide-react";
import { listMyCampaigns, publishCampaign } from "@/lib/perx/sim.functions";
import { generateMarketingCampaign } from "@/lib/perx/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/provider/marketing")({
  head: () => ({ meta: [{ title: "AI Marketing · Perx" }] }),
  component: Marketing,
});

const channelIcon: Record<string, any> = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin };

function Marketing() {
  const listFn = useServerFn(listMyCampaigns);
  const genFn = useServerFn(generateMarketingCampaign);
  const pubFn = useServerFn(publishCampaign);
  const [rows, setRows] = useState<any[]>([]);
  const [theme, setTheme] = useState("Weekend Recharge — wellness packages for stressed Tirana tech teams");
  const [busy, setBusy] = useState(false);
  const [pubId, setPubId] = useState<string | null>(null);

  const load = () => listFn().then((r) => setRows(r as any[])).catch(() => {});
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const totalReach = rows.reduce((s, r) => s + (r.analytics?.reach ?? 0), 0);
  const avgEng = rows.length ? (rows.reduce((s, r) => s + (r.analytics?.engagement_rate ?? 0), 0) / rows.length).toFixed(1) : "—";
  const conversions = rows.reduce((s, r) => s + (r.analytics?.conversions ?? 0), 0);

  const generate = async () => {
    setBusy(true);
    try {
      await genFn({ data: { theme } });
      toast.success("Campaign generated across IG · FB · LinkedIn");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const publish = async (id: string) => {
    setPubId(id);
    try {
      await pubFn({ data: { id } });
      toast.success("Published via Publer (simulated)");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setPubId(null); }
  };

  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader eyebrow="AI copilots" title="Marketing Studio"
        subtitle="Generate cross-platform campaigns. Simulated Publer publishing returns realistic analytics." />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile label="Total reach" value={totalReach.toLocaleString()} delta={`${rows.length} posts`} tone="coral" />
        <StatTile label="Avg. engagement" value={`${avgEng}%`} delta="across channels" />
        <StatTile label="Conversions" value={conversions.toString()} delta="from corporate" />
      </div>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-coral">
          <Sparkles className="mr-1 inline size-3" /> Generate new campaign
        </p>
        <textarea value={theme} onChange={(e) => setTheme(e.target.value)}
          className="mt-3 w-full resize-none rounded-2xl border-2 border-border bg-white p-3 text-sm font-medium text-navy placeholder:text-navy/40 focus:border-coral focus:outline-none"
          rows={2} placeholder="Theme or angle…" />
        <button onClick={generate} disabled={busy}
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-ai px-5 py-2.5 text-sm font-extrabold text-white shadow-lift disabled:opacity-50">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Generate IG · FB · LinkedIn
        </button>
      </section>

      <section className="mt-8 space-y-3">
        <h3 className="font-display text-xl font-extrabold text-navy">Your campaigns</h3>
        {rows.map((c) => {
          const Icon = channelIcon[c.channel] ?? Send;
          return (
            <article key={c.id} className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:grid-cols-[auto_1fr_auto] sm:items-start">
              <div className="grid size-10 place-items-center rounded-xl bg-navy text-white">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy/50">{c.channel} · {c.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-navy/80">{c.content}</p>
                {c.analytics?.views ? (
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-bold text-navy/55">
                    <span>👁 {c.analytics.views.toLocaleString()} views</span>
                    <span>📈 {c.analytics.reach.toLocaleString()} reach</span>
                    <span>🖱 {c.analytics.clicks} clicks</span>
                    <span>✅ {c.analytics.conversions} conv.</span>
                    <span>💬 {c.analytics.engagement_rate}% engagement</span>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <span className={`rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-center ${
                  c.status === "published" ? "bg-emerald/10 text-emerald" : "bg-navy/5 text-navy/50"
                }`}>{c.status}</span>
                {c.status === "draft" && (
                  <button onClick={() => publish(c.id)} disabled={pubId === c.id}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-coral px-3 py-1.5 text-xs font-extrabold text-white shadow-coral disabled:opacity-50">
                    {pubId === c.id ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                    Publish
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {rows.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/40 p-8 text-center text-sm text-navy/55">
            No campaigns yet — generate your first one above.
          </div>
        )}
      </section>
    </div>
  );
}
