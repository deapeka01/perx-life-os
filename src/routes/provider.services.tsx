import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/perx/PageHeader";
import { formatALL, providerServices } from "@/lib/mock-data";
import { Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/provider/services")({
  head: () => ({ meta: [{ title: "Services · Perx" }] }),
  component: Services,
});

function Services() {
  const [desc, setDesc] = useState("");
  const [generated, setGenerated] = useState<null | { title: string; copy: string; price: string }>(null);

  const generate = () => {
    setGenerated({
      title: "Corporate Mindful Reset Day",
      copy:
        "A half-day reset for teams of 6–12: guided breathwork, hot stone massage, an organic lunch, and a closing yoga session. Designed to lower stress before product launches.",
      price: "55,000–75,000 ALL · per team",
    });
  };

  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="Catalog"
        title="Services & offers"
        subtitle="Individual services, packages, group experiences and subscriptions."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-extrabold text-white shadow-coral">
            <Plus className="size-4" /> New service
          </button>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-border bg-muted/40 px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-navy/50 sm:grid">
              <span>Name</span>
              <span>Price</span>
              <span>Bookings</span>
              <span>Status</span>
            </div>
            <ul className="divide-y divide-border">
              {providerServices.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center sm:px-6"
                >
                  <p className="font-display text-sm font-extrabold text-navy sm:col-span-1 col-span-2">
                    {s.name}
                  </p>
                  <p className="font-bold text-navy/70">{formatALL(s.price)}</p>
                  <p className="text-sm font-bold text-navy/60">{s.bookings} bookings</p>
                  <span
                    className={`inline-flex w-fit rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                      s.status === "active"
                        ? "bg-emerald/10 text-emerald"
                        : "bg-navy/5 text-navy/50"
                    }`}
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border-2 border-dashed border-coral/30 bg-coral/5 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-coral" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-coral">
              AI Offer Builder
            </p>
          </div>
          <h3 className="mt-3 font-display text-2xl font-extrabold text-navy">
            Describe it. Perx writes it.
          </h3>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. A half-day corporate spa package for stressed engineering teams…"
            rows={4}
            className="mt-4 w-full rounded-2xl border border-border bg-card p-4 text-sm text-navy placeholder:text-navy/40 focus:border-coral focus:outline-none"
          />
          <button
            onClick={generate}
            className="mt-3 w-full rounded-xl bg-navy py-3 font-display text-sm font-extrabold text-white transition hover:bg-coral"
          >
            Generate offer ✨
          </button>

          {generated && (
            <div className="mt-5 rounded-2xl bg-card p-5 shadow-soft animate-slide-up">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-coral">
                Suggested title
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-navy">{generated.title}</p>
              <p className="mt-3 text-[10px] font-extrabold uppercase tracking-widest text-coral">
                Marketing copy
              </p>
              <p className="mt-1 text-sm text-navy/70">{generated.copy}</p>
              <p className="mt-3 text-[10px] font-extrabold uppercase tracking-widest text-coral">
                Suggested pricing
              </p>
              <p className="mt-1 font-display text-base font-extrabold text-navy">
                {generated.price}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
