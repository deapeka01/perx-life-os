import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/perx/PageHeader";
import { listDemandInsights } from "@/lib/perx/sim.functions";

export const Route = createFileRoute("/provider/demand")({
  head: () => ({ meta: [{ title: "Demand Feed · Perx" }] }),
  component: Demand,
});

const tones = ["bg-coral", "bg-sky", "bg-emerald", "bg-navy"];

function Demand() {
  const listFn = useServerFn(listDemandInsights);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { listFn().then((r) => setRows(r as any[])).catch(() => {}); }, [listFn]);

  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader eyebrow="Real-time signals" title="Corporate Demand Feed"
        subtitle="What Albanian companies are searching for. Respond first." />

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((d, i) => (
          <article key={d.id} className={`rounded-3xl border p-6 text-white shadow-soft ${tones[i % 4]}`}>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">{d.category}</p>
            <p className="mt-1 text-sm font-bold text-white/85">{d.segment}</p>
            <p className="mt-3 font-display text-4xl font-extrabold">{d.employees_interested}</p>
            <p className="text-xs font-bold text-white/80">employees searching</p>
            <p className="mt-3 font-display text-sm font-extrabold">{d.trend} · 30d</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h3 className="font-display text-xl font-extrabold text-navy">AI recommendations</h3>
        <ul className="mt-5 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          {rows.map((d) => (
            <li key={d.id} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[1.4fr_2fr] sm:items-center sm:px-6">
              <p className="font-display text-sm font-extrabold text-navy">{d.headline ?? d.segment}</p>
              <p className="text-sm text-navy/70">→ {d.recommendation ?? "—"}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
