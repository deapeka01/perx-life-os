import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { StatTile } from "@/components/perx/StatTile";
import {
  corporateDemand,
  currentProvider,
  formatALL,
  providerServices,
} from "@/lib/mock-data";
import { Wallet, Calendar, Inbox, Building2, ArrowRight, LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/provider/")({
  head: () => ({ meta: [{ title: "Provider Studio · Perx" }] }),
  component: ProviderHome,
});

function ProviderHome() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${currentProvider.category} · Tirana`}
        title={currentProvider.name}
        subtitle="Your bookings, your demand signals, your AI copilots."
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
        <StatTile label="Monthly revenue" value={formatALL(currentProvider.monthlyRevenueALL)} icon={<Wallet className="size-4" />} delta="+22% MoM" tone="coral" />
        <StatTile label="Bookings" value={currentProvider.bookings} icon={<Calendar className="size-4" />} delta="+18 vs prev." />
        <StatTile label="Pending requests" value={currentProvider.pendingRequests} icon={<Inbox className="size-4" />} delta="Awaiting confirm" />
        <StatTile label="Corporate reach" value={`${currentProvider.corporateReach} co's`} icon={<Building2 className="size-4" />} delta="3 new this week" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                Corporate Demand Feed
              </p>
              <h2 className="font-display text-2xl font-extrabold text-navy">
                What companies are searching for
              </h2>
            </div>
            <Link to="/provider/demand" className="text-xs font-bold text-coral">
              Open feed <ArrowRight className="inline size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {corporateDemand.map((d) => {
              const colors = {
                coral: "bg-coral/10 text-coral",
                sky: "bg-sky/10 text-sky",
                emerald: "bg-emerald/10 text-emerald",
              }[d.color];
              return (
                <article
                  key={d.id}
                  className="flex items-center gap-5 rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className={`grid size-12 shrink-0 place-items-center rounded-2xl text-xl font-extrabold ${colors}`}>
                    {d.employees}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-extrabold text-navy">{d.segment}</p>
                    <p className="text-xs text-navy/55">{d.employees} employees actively searching</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-sm font-extrabold text-emerald">{d.trend}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                      30 day trend
                    </p>
                  </div>
                  <button className="hidden rounded-xl bg-navy px-4 py-2 text-xs font-extrabold text-white transition hover:bg-coral sm:inline-block">
                    Target offer
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-display text-2xl font-extrabold text-navy">Top services</h2>
          <div className="space-y-3">
            {providerServices.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold text-navy">{s.name}</p>
                  <p className="text-xs text-navy/55">{s.bookings} bookings</p>
                </div>
                <p className="shrink-0 font-display text-sm font-extrabold text-navy">
                  {formatALL(s.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-navy p-6 text-white shadow-lift">
            <Sparkles className="size-5 text-coral" />
            <h3 className="mt-3 font-display text-lg font-extrabold">AI Offer Builder</h3>
            <p className="mt-1 text-sm text-white/60">
              Describe a service. Perx writes the copy, suggests pricing, and bundles it.
            </p>
            <Link
              to="/provider/services"
              className="mt-4 inline-block rounded-xl bg-coral px-4 py-2 text-xs font-extrabold text-white shadow-coral"
            >
              Build an offer
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
