// Universal "Pay by bank transfer" dialog. Creates an invoice via server function
// and shows bank instructions with a Copy IBAN / Copy reference action. Used by
// employee perk claims, company wallet top-ups, and provider payout requests.
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Banknote, Loader2 } from "lucide-react";
import { createInvoice, updateInvoiceStatus } from "@/lib/payments/invoices.functions";
import { formatALL } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

type Kind = "wallet_topup" | "perk_claim" | "provider_payout";

export type PayByBankInitial = {
  kind: Kind;
  amountALL: number;
  description: string;
  // Provider payout: which of the provider's bank accounts to use.
  bankAccountId?: string;
  payerLabel?: string;
  payeeLabel?: string;
};

type Invoice = Awaited<ReturnType<ReturnType<typeof useServerFn<typeof createInvoice>>>>;

export function PayByBankDialog({
  open,
  onOpenChange,
  initial,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: PayByBankInitial | null;
  onPaid?: (inv: Invoice) => void;
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const create = useServerFn(createInvoice);
  const update = useServerFn(updateInvoiceStatus);

  // Reset on close
  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setInvoice(null);
      setAmount("");
    }
    onOpenChange(o);
  };

  if (!initial) return null;

  const editableAmount = initial.amountALL === 0; // 0 means "ask the user"
  const finalAmount = editableAmount ? Number(amount) : initial.amountALL;

  const submit = async () => {
    if (!finalAmount || finalAmount <= 0) {
      toast.error("Enter an amount in ALL");
      return;
    }
    setBusy(true);
    try {
      const inv = await create({
        data: {
          kind: initial.kind,
          amount_all: Math.round(finalAmount),
          description: initial.description,
          bank_account_id: initial.bankAccountId,
          payer_label: initial.payerLabel,
          payee_label: initial.payeeLabel,
        },
      });
      setInvoice(inv);
      toast.success(`Invoice ${inv.number} created`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create invoice");
    } finally {
      setBusy(false);
    }
  };

  const markSent = async () => {
    if (!invoice) return;
    setBusy(true);
    try {
      const next = await update({ data: { id: invoice.id, status: "sent" } });
      setInvoice(next);
      toast.success("Marked as sent — we'll confirm receipt within 1 business day.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy(false);
    }
  };

  const markPaid = async () => {
    if (!invoice) return;
    setBusy(true);
    try {
      const next = await update({ data: { id: invoice.id, status: "paid" } });
      setInvoice(next);
      toast.success("Payment confirmed");
      onPaid?.(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg border-white/50 bg-white/95 backdrop-blur-xl sm:rounded-3xl">
        <DialogHeader>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald">
            <Banknote className="size-3.5" /> Bank transfer
          </div>
          <DialogTitle className="font-display text-xl font-extrabold text-navy">
            {invoice ? `Invoice ${invoice.number}` : labelForKind(initial.kind)}
          </DialogTitle>
          <DialogDescription className="text-sm text-navy/65">
            {invoice
              ? "Use the details below to wire the funds from your bank app. We'll confirm receipt within 1 business day."
              : initial.description}
          </DialogDescription>
        </DialogHeader>

        {!invoice ? (
          <div className="space-y-4">
            {editableAmount && (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ALL)</Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 250000"
                />
              </div>
            )}
            <div className="rounded-xl border-2 border-border bg-canvas p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-navy/55">Total due</p>
              <p className="font-display text-2xl font-extrabold text-navy">
                {finalAmount ? formatALL(finalAmount) : "—"}
              </p>
            </div>
            <Button
              onClick={submit}
              disabled={busy || (editableAmount && !finalAmount)}
              className="w-full bg-coral font-display font-extrabold text-white shadow-coral hover:bg-coral/90"
            >
              {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Generate bank invoice
            </Button>
          </div>
        ) : (
          <InvoiceInstructions
            invoice={invoice}
            busy={busy}
            onMarkSent={invoice.status === "pending" ? markSent : undefined}
            onMarkPaid={
              invoice.status !== "paid" && invoice.kind === "provider_payout" ? markPaid : undefined
            }
            footer={
              <Link
                to="/billing"
                className="text-xs font-bold text-coral hover:underline"
                onClick={() => handleOpenChange(false)}
              >
                View all invoices →
              </Link>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function labelForKind(k: Kind) {
  if (k === "wallet_topup") return "Top up your company wallet";
  if (k === "perk_claim") return "Pay for this perk";
  return "Request payout";
}

export function InvoiceInstructions({
  invoice,
  busy,
  onMarkSent,
  onMarkPaid,
  footer,
}: {
  invoice: Invoice;
  busy?: boolean;
  onMarkSent?: () => void;
  onMarkPaid?: () => void;
  footer?: React.ReactNode;
}) {
  const bank = invoice.bank_snapshot as {
    beneficiary_name: string;
    iban: string;
    swift?: string | null;
    bank_name: string;
    currency: string;
    tax_id?: string;
    address?: string;
  };
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-border bg-canvas p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-navy/55">Amount</p>
          <StatusPill status={invoice.status} />
        </div>
        <p className="font-display text-2xl font-extrabold text-navy">{formatALL(invoice.amount_all)}</p>
        {invoice.due_date && (
          <p className="mt-1 text-xs text-navy/55">Due by {new Date(invoice.due_date).toLocaleDateString()}</p>
        )}
      </div>

      <dl className="grid gap-2 rounded-2xl border-2 border-border bg-card p-4 text-sm">
        <Row label="Beneficiary" value={bank.beneficiary_name} />
        <Row label="Bank" value={bank.bank_name} />
        <Row label="IBAN" value={bank.iban} copy />
        {bank.swift && <Row label="SWIFT / BIC" value={bank.swift} copy />}
        <Row
          label="Payment reference"
          value={invoice.reference_code}
          copy
          hint="Include this exactly in the transfer reference so we can match it."
        />
        {bank.tax_id && <Row label="Tax ID" value={bank.tax_id} />}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {footer}
        <div className="ml-auto flex gap-2">
          {onMarkSent && (
            <Button variant="outline" size="sm" onClick={onMarkSent} disabled={busy}>
              I've sent the transfer
            </Button>
          )}
          {onMarkPaid && (
            <Button size="sm" onClick={onMarkPaid} disabled={busy} className="bg-emerald text-white">
              Mark as received
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    sent: "bg-sky/20 text-sky-700",
    paid: "bg-emerald/20 text-emerald-700",
    cancelled: "bg-muted text-navy/60",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

function Row({ label, value, copy, hint }: { label: string; value: string; copy?: boolean; hint?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy/55">{label}</p>
        <p className="break-all font-mono text-sm font-semibold text-navy">{value}</p>
        {hint && <p className="mt-0.5 text-[11px] text-navy/55">{hint}</p>}
      </div>
      {copy && (
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-lg border border-border bg-white p-1.5 text-navy/60 transition hover:border-coral hover:text-coral"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
        </button>
      )}
    </div>
  );
}
