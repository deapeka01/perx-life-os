import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyInvoices, listBankAccounts, saveBankAccount } from "@/lib/payments/invoices.functions";
import { InvoiceInstructions } from "@/components/perx/PayByBankDialog";
import { formatALL } from "@/lib/mock-data";
import { Banknote, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
  head: () => ({
    meta: [
      { title: "Billing & invoices · Perx" },
      { name: "description", content: "Review your invoices, pay by bank transfer, and manage payout accounts." },
    ],
  }),
});

function BillingPage() {
  const list = useServerFn(listMyInvoices);
  const banks = useServerFn(listBankAccounts);
  const invoicesQ = useQuery({ queryKey: ["invoices"], queryFn: () => list() });
  const banksQ = useQuery({ queryKey: ["bank-accounts"], queryFn: () => banks() });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bankOpen, setBankOpen] = useState(false);

  const invoices = invoicesQ.data ?? [];
  const selected = invoices.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/60 hover:text-coral">
          <ArrowLeft className="size-3.5" /> Back
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-navy">Billing & invoices</h1>
            <p className="mt-1 text-sm text-navy/60">Pay or get paid by bank transfer. All amounts in ALL.</p>
          </div>
          <Button onClick={() => setBankOpen(true)} variant="outline" className="gap-1.5">
            <Plus className="size-4" /> Add payout account
          </Button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-3xl border-2 border-border bg-card p-4 shadow-soft">
            <h2 className="px-2 pb-3 font-display text-sm font-extrabold uppercase tracking-wider text-navy/60">
              Your invoices
            </h2>
            {invoicesQ.isLoading && <p className="px-2 text-sm text-navy/55">Loading…</p>}
            {!invoicesQ.isLoading && invoices.length === 0 && (
              <p className="px-2 text-sm text-navy/55">No invoices yet. Generate one from your dashboard.</p>
            )}
            <ul className="space-y-2">
              {invoices.map((inv) => {
                const active = inv.id === selectedId;
                return (
                  <li key={inv.id}>
                    <button
                      onClick={() => setSelectedId(inv.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-3 py-3 text-left transition ${
                        active ? "border-coral bg-coral/5" : "border-border bg-white hover:border-coral/40"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-extrabold text-navy">
                          {inv.description}
                        </p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-navy/55">
                          {inv.number} · {labelKind(inv.kind)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-sm font-extrabold text-navy">{formatALL(inv.amount_all)}</p>
                        <p className="text-[10px] font-bold uppercase text-navy/50">{inv.status}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
            {selected ? (
              <>
                <div className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-coral">
                  <Banknote className="size-3.5" /> Invoice {selected.number}
                </div>
                <InvoiceInstructions invoice={selected} />
              </>
            ) : (
              <div className="grid h-full place-items-center py-16 text-center">
                <div>
                  <Banknote className="mx-auto size-10 text-navy/30" />
                  <p className="mt-3 font-display text-sm font-bold text-navy/60">
                    Select an invoice to view bank transfer details.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {banksQ.data && banksQ.data.length > 0 && (
          <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-navy/60">
              Your payout accounts
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {banksQ.data.map((b) => (
                <li key={b.id} className="rounded-2xl border-2 border-border bg-white p-3">
                  <p className="font-display text-sm font-extrabold text-navy">{b.beneficiary_name}</p>
                  <p className="text-xs text-navy/60">{b.bank_name}</p>
                  <p className="mt-1 break-all font-mono text-xs text-navy/80">{b.iban}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <AddBankDialog
        open={bankOpen}
        onOpenChange={setBankOpen}
        onSaved={() => {
          banksQ.refetch();
          setBankOpen(false);
        }}
      />
    </div>
  );
}

function labelKind(k: string) {
  if (k === "wallet_topup") return "Wallet top-up";
  if (k === "perk_claim") return "Perk payment";
  return "Payout";
}

function AddBankDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const save = useServerFn(saveBankAccount);
  const [form, setForm] = useState({ beneficiary_name: "", iban: "", swift: "", bank_name: "", currency: "ALL" });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await save({ data: form });
      toast.success("Payout account saved");
      onSaved();
      setForm({ beneficiary_name: "", iban: "", swift: "", bank_name: "", currency: "ALL" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold text-navy">Add payout account</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Beneficiary name" value={form.beneficiary_name} onChange={(v) => setForm({ ...form, beneficiary_name: v })} />
          <Field label="Bank name" value={form.bank_name} onChange={(v) => setForm({ ...form, bank_name: v })} />
          <Field label="IBAN" value={form.iban} onChange={(v) => setForm({ ...form, iban: v })} mono />
          <Field label="SWIFT / BIC (optional)" value={form.swift} onChange={(v) => setForm({ ...form, swift: v })} mono />
          <Field label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v.toUpperCase().slice(0, 3) })} mono />
          <Button onClick={submit} disabled={busy} className="w-full bg-coral text-white shadow-coral hover:bg-coral/90">
            Save account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase tracking-wider text-navy/60">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className={mono ? "font-mono" : ""} />
    </div>
  );
}
