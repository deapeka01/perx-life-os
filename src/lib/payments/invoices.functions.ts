import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLATFORM_BANK, type BankSnapshot } from "./bank";

const KindEnum = z.enum(["wallet_topup", "perk_claim", "provider_payout"]);

function makeRef(kind: z.infer<typeof KindEnum>) {
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  const prefix = kind === "wallet_topup" ? "WAL" : kind === "perk_claim" ? "PRK" : "PAY";
  return `${prefix}-${r}`;
}

export const createInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        kind: KindEnum,
        amount_all: z.number().int().positive().max(100_000_000),
        description: z.string().trim().min(2).max(500),
        // For wallet_topup / perk_claim: payee is the platform (no payee_user_id, use PLATFORM_BANK).
        // For provider_payout: caller is the payee; payer is the platform.
        bank_account_id: z.string().uuid().optional(),
        payer_label: z.string().max(200).optional(),
        payee_label: z.string().max(200).optional(),
        metadata: z.record(z.unknown()).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    let bank_snapshot: BankSnapshot;
    let payer_user_id: string | null = null;
    let payee_user_id: string | null = null;
    let payee_label = data.payee_label ?? "Perx Platform";

    if (data.kind === "provider_payout") {
      // Provider is the payee — fetch their bank account.
      const { data: bank, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("id", data.bank_account_id ?? "")
        .eq("owner_user_id", userId)
        .maybeSingle();
      if (error || !bank) throw new Error("Bank account not found");
      bank_snapshot = {
        beneficiary_name: bank.beneficiary_name,
        iban: bank.iban,
        swift: bank.swift,
        bank_name: bank.bank_name,
        currency: bank.currency,
      };
      payee_user_id = userId;
      payee_label = bank.beneficiary_name;
      // payer is platform — left as null user, label shown
    } else {
      // Platform receives. Caller is the payer.
      bank_snapshot = { ...PLATFORM_BANK };
      payer_user_id = userId;
      payee_label = "Perx Platform";
    }

    const { data: numRow, error: numErr } = await supabase.rpc("next_invoice_number");
    if (numErr || !numRow) throw new Error("Could not allocate invoice number");

    const { data: inserted, error: insErr } = await supabase
      .from("invoices")
      .insert({
        number: numRow as string,
        kind: data.kind,
        amount_all: data.amount_all,
        description: data.description,
        reference_code: makeRef(data.kind),
        payer_user_id,
        payer_label: data.payer_label ?? null,
        payee_user_id,
        payee_label,
        bank_snapshot: bank_snapshot as never,
        metadata: (data.metadata ?? {}) as never,
        due_date: new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10),
      })
      .select("*")
      .single();
    if (insErr || !inserted) throw new Error(insErr?.message ?? "Could not create invoice");
    return inserted;
  });

export const listMyInvoices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .or(`payer_user_id.eq.${userId},payee_user_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getInvoice = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: inv, error } = await supabase.from("invoices").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!inv) throw new Error("Invoice not found");
    return inv;
  });

export const updateInvoiceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["sent", "paid", "cancelled"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: { status: typeof data.status; sent_at?: string; paid_at?: string } = { status: data.status };
    if (data.status === "sent") patch.sent_at = new Date().toISOString();
    if (data.status === "paid") patch.paid_at = new Date().toISOString();
    const { data: row, error } = await supabase
      .from("invoices")
      .update(patch)
      .eq("id", data.id)
      .or(`payer_user_id.eq.${userId},payee_user_id.eq.${userId}`)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Not allowed");
    return row;
  });

export const saveBankAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        label: z.string().max(80).optional(),
        beneficiary_name: z.string().trim().min(2).max(120),
        iban: z.string().trim().min(8).max(64),
        swift: z.string().trim().max(20).optional(),
        bank_name: z.string().trim().min(2).max(120),
        currency: z.string().trim().length(3).default("ALL"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.id) {
      const { data: row, error } = await supabase
        .from("bank_accounts")
        .update({
          label: data.label,
          beneficiary_name: data.beneficiary_name,
          iban: data.iban,
          swift: data.swift,
          bank_name: data.bank_name,
          currency: data.currency,
        })
        .eq("id", data.id)
        .eq("owner_user_id", userId)
        .select("*")
        .maybeSingle();
      if (error || !row) throw new Error(error?.message ?? "Update failed");
      return row;
    }
    const { data: row, error } = await supabase
      .from("bank_accounts")
      .insert({ owner_user_id: userId, ...data, is_default: true })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listBankAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
