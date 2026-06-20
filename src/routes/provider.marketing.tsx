import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { StatTile } from "@/components/perx/StatTile";
import { providerCampaigns } from "@/lib/mock-data";
import { Sparkles, ImageIcon, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/provider/marketing")({
  head: () => ({ meta: [{ title: "AI Marketing · Perx" }] }),
  component: Marketing,
});

const ideas = [
  { icon: MessageSquare, title: "Caption · Instagram", body: "Stress melts in steam. Bamboo Spa just rolled out the Weekend Recharge — book before Friday and recover like a CEO. 🌿" },
  { icon: MessageSquare, title: "LinkedIn post", body: "We partnered with Perx to offer Albanian tech teams a science-backed recovery day. Lower cortisol, higher retention. DM us for the corporate rate." },
  { icon: ImageIcon, title: "Visual prompt", body: "Sunlight pouring into a stone steam room with eucalyptus, two robed figures sipping tea — soft cinematic editorial." },
];

function Marketing() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="AI copilots"
        title="Marketing Assistant"
        subtitle="Generate copy, visuals, and campaign ideas in seconds."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile label="Total reach" value="1,692" delta="+312 this week" tone="coral" />
        <StatTile label="Avg. engagement" value="18.5%" delta="2.4× industry" />
        <StatTile label="Conversions" value="74" delta="from corporate" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <h3 className="font-display text-xl font-extrabold text-navy">Live campaigns</h3>
          <div className="mt-5 space-y-3">
            {providerCampaigns.map((c) => (
              <article
                key={c.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold text-navy">
                    {c.title}
                  </p>
                  <p className="text-xs text-navy/50">{c.status === "live" ? "Currently running" : "Draft"}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy/40">
                    Reach
                  </p>
                  <p className="font-display text-sm font-extrabold text-navy">{c.reach.toLocaleString()}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy/40">
                    Engagement
                  </p>
                  <p className="font-display text-sm font-extrabold text-coral">{c.engagement}%</p>
                </div>
                <span
                  className={`inline-flex rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                    c.status === "live" ? "bg-emerald/10 text-emerald" : "bg-navy/5 text-navy/50"
                  }`}
                >
                  {c.status}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-navy p-6 text-white shadow-lift">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-coral" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-coral">
              AI-generated ideas
            </p>
          </div>
          <h3 className="mt-3 font-display text-xl font-extrabold">For Weekend Recharge</h3>
          <div className="mt-5 space-y-3">
            {ideas.map((i, idx) => {
              const Icon = i.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-sky" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky">
                      {i.title}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-white/80">{i.body}</p>
                </div>
              );
            })}
          </div>
          <button className="mt-5 w-full rounded-xl bg-coral py-2.5 text-sm font-extrabold text-white shadow-coral">
            Regenerate ideas
          </button>
        </section>
      </div>
    </div>
  );
}
