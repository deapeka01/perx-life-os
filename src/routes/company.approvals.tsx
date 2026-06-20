import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/perx/PageHeader";
import { formatALL, pendingApprovals } from "@/lib/mock-data";
import { Sparkles, Check, X } from "lucide-react";

export const Route = createFileRoute("/company/approvals")({
  head: () => ({ meta: [{ title: "Approvals · Perx" }] }),
  component: Approvals,
});

function Approvals() {
  const [list, setList] = useState(pendingApprovals);
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${list.length} pending`}
        title="Approval Center"
        subtitle="AI explains every request. One click to approve or reject."
      />
      <div className="mt-8 space-y-4">
        {list.map((a) => (
          <article
            key={a.id}
            className="grid gap-5 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div className="grid gap-5 lg:grid-cols-[1.2fr_1.2fr_1fr] lg:items-center">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  Employee
                </p>
                <p className="truncate font-display text-base font-extrabold text-navy">
                  {a.employee}
                </p>
                <p className="text-xs text-navy/55">{a.department}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  Request · {a.goal}
                </p>
                <p className="truncate font-display text-base font-extrabold text-navy">
                  {a.request}
                </p>
                <p className="text-xs text-navy/55">{formatALL(a.costALL)}</p>
              </div>
              <div className="min-w-0 rounded-xl bg-navy/5 p-3">
                <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-coral">
                  <Sparkles className="size-3" /> AI Note
                </p>
                <p className="mt-1 text-xs text-navy/80">{a.aiNote}</p>
              </div>
            </div>
            <div className="flex gap-2 lg:flex-col">
              <button
                onClick={() => setList((l) => l.filter((x) => x.id !== a.id))}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition hover:brightness-110 lg:flex-none"
              >
                <Check className="size-4" /> Approve
              </button>
              <button
                onClick={() => setList((l) => l.filter((x) => x.id !== a.id))}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-muted px-5 py-2.5 text-sm font-extrabold text-navy/60 transition hover:bg-navy/10 lg:flex-none"
              >
                <X className="size-4" /> Reject
              </button>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-border bg-muted/40 p-10 text-center">
            <p className="font-display text-xl font-extrabold text-navy">All clear ✨</p>
            <p className="mt-2 text-sm text-navy/55">No pending approvals right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
