import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/perx/PageHeader";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import { listCompanyApprovals, decideRequest } from "@/lib/perx/sim.functions";
import { generateStrategyReport } from "@/lib/perx/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/company/approvals")({
  head: () => ({ meta: [{ title: "Approvals · Perx" }] }),
  component: Approvals,
});

const fmt = (n: number) => `${n.toLocaleString()} ALL`;

function Approvals() {
  const listFn = useServerFn(listCompanyApprovals);
  const decideFn = useServerFn(decideRequest);
  const reportFn = useServerFn(generateStrategyReport);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [decidingId, setDeciding] = useState<string | null>(null);
  const [genReport, setGenReport] = useState(false);

  const load = () => {
    setLoading(true);
    listFn().then((r) => setRows(r as any[])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const decide = async (id: string, decision: "approved" | "rejected") => {
    setDeciding(id);
    try {
      await decideFn({ data: { id, decision } });
      toast.success(decision === "approved" ? "Approved & funded" : "Rejected");
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally { setDeciding(null); }
  };

  const generate = async () => {
    setGenReport(true);
    try {
      const r = await reportFn();
      toast.success(`Report generated: ${(r as any)?.title ?? "Monthly insights"}`);
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setGenReport(false); }
  };

  const pending = rows.filter((r) => r.status === "pending");

  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${pending.length} pending`}
        title="Approval Center"
        subtitle="AI explains every request. One click to approve or reject."
        actions={
          <button onClick={generate} disabled={genReport}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-extrabold text-white shadow-soft hover:bg-coral disabled:opacity-50">
            {genReport ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate strategy report
          </button>
        }
      />
      {loading && <p className="mt-8 text-sm text-navy/50">Loading…</p>}
      <div className="mt-8 space-y-4">
        {rows.map((a) => (
          <article key={a.id} className="grid gap-5 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_1.2fr_1fr] lg:items-center">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Employee</p>
                <p className="truncate font-display text-base font-extrabold text-navy">
                  {a.employee?.full_name ?? a.employee?.email ?? "—"}
                </p>
                <p className="text-xs text-navy/55">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Request</p>
                <p className="truncate font-display text-base font-extrabold text-navy">{a.title}</p>
                <p className="text-xs text-navy/55">{fmt(a.amount_all)}</p>
              </div>
              <div className="min-w-0 rounded-xl bg-navy/5 p-3">
                <p className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-coral">
                  <Sparkles className="size-3" /> {a.status === "pending" ? "AI Note" : a.status}
                </p>
                <p className="mt-1 text-xs text-navy/80">{a.ai_note ?? a.employee_message ?? a.decision_note ?? "—"}</p>
              </div>
            </div>
            <div className="flex gap-2 lg:flex-col">
              {a.status === "pending" ? (
                <>
                  <button onClick={() => decide(a.id, "approved")} disabled={decidingId === a.id}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald px-5 py-2.5 text-sm font-extrabold text-white shadow-soft transition hover:brightness-110 disabled:opacity-50 lg:flex-none">
                    <Check className="size-4" /> Approve
                  </button>
                  <button onClick={() => decide(a.id, "rejected")} disabled={decidingId === a.id}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-muted px-5 py-2.5 text-sm font-extrabold text-navy/60 transition hover:bg-navy/10 disabled:opacity-50 lg:flex-none">
                    <X className="size-4" /> Reject
                  </button>
                </>
              ) : (
                <span className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-extrabold uppercase tracking-widest ${
                  a.status === "fulfilled" || a.status === "approved" ? "bg-emerald/10 text-emerald" : "bg-navy/10 text-navy/50"
                }`}>{a.status}</span>
              )}
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-border bg-muted/40 p-10 text-center">
            <p className="font-display text-xl font-extrabold text-navy">All clear ✨</p>
            <p className="mt-2 text-sm text-navy/55">No requests yet. Invite your team to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
