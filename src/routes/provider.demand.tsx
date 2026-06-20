import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { corporateDemand } from "@/lib/mock-data";

export const Route = createFileRoute("/provider/demand")({
  head: () => ({ meta: [{ title: "Demand Feed · Perx" }] }),
  component: Demand,
});

const recentSignals = [
  { co: "Vodafone Albania", segment: "Wellness experiences", employees: 28, time: "12m ago" },
  { co: "TeamSystem", segment: "AI / Tech courses", employees: 14, time: "1h ago" },
  { co: "DigitSapiens", segment: "Team activities", employees: 9, time: "3h ago" },
  { co: "Balfin Group", segment: "Weekend escapes", employees: 22, time: "Yesterday" },
];

function Demand() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Real-time signals"
        title="Corporate Demand Feed"
        subtitle="See what Albanian companies are searching for — and respond first."
      />

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {corporateDemand.map((d) => {
          const tone = {
            coral: "bg-coral text-white border-coral/30 shadow-coral",
            sky: "bg-sky text-white border-sky/30",
            emerald: "bg-emerald text-white border-emerald/30",
          }[d.color];
          return (
            <article key={d.id} className={`rounded-3xl border p-6 shadow-soft ${tone}`}>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                {d.segment}
              </p>
              <p className="mt-3 font-display text-4xl font-extrabold">{d.employees}</p>
              <p className="text-xs font-bold text-white/80">employees searching</p>
              <p className="mt-4 font-display text-sm font-extrabold">{d.trend} · 30d</p>
              <button className="mt-5 w-full rounded-xl bg-white/15 py-2 text-xs font-extrabold text-white transition hover:bg-white hover:text-navy">
                Build targeted offer
              </button>
            </article>
          );
        })}
      </section>

      <section className="mt-10">
        <h3 className="font-display text-xl font-extrabold text-navy">Live company signals</h3>
        <ul className="mt-5 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          {recentSignals.map((s, i) => (
            <li
              key={i}
              className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 sm:grid-cols-[1.4fr_1.4fr_0.6fr_auto] sm:px-6"
            >
              <p className="font-display text-sm font-extrabold text-navy">{s.co}</p>
              <p className="hidden text-sm text-navy/60 sm:block">{s.segment}</p>
              <p className="hidden text-sm font-extrabold text-coral sm:block">
                {s.employees} ppl
              </p>
              <p className="text-xs font-medium text-navy/40">{s.time}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
