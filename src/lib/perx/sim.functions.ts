// Perx simulation server functions — wallets, requests, notifications, quests,
// offers, providers, demand, campaigns, reports. Uses RLS-scoped supabase from
// requireSupabaseAuth context. New tables aren't in generated types yet, so we
// cast to `any` at the from() boundary.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Sb = { from: (t: string) => any; rpc: (...a: any[]) => any };
const sb = (supabase: unknown) => supabase as unknown as Sb;

// ─────────────────────── WALLET ───────────────────────
export const getMyWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase)
      .from("wallets")
      .select("*")
      .eq("owner_user_id", context.userId)
      .maybeSingle();
    return data as null | {
      id: string; kind: "employee"|"company"|"provider";
      balance_all: number; monthly_allowance_all: number;
    };
  });

export const listMyTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const w = await sb(context.supabase).from("wallets")
      .select("id").eq("owner_user_id", context.userId).maybeSingle();
    if (!w.data) return [] as any[];
    const { data } = await sb(context.supabase).from("wallet_transactions")
      .select("*").eq("wallet_id", w.data.id)
      .order("created_at", { ascending: false }).limit(50);
    return (data ?? []) as any[];
  });

// ─────────────────────── NOTIFICATIONS ───────────────────────
export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase).from("notifications")
      .select("*").eq("user_id", context.userId)
      .order("created_at", { ascending: false }).limit(30);
    return (data ?? []) as any[];
  });

export const markAllNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await sb(context.supabase).from("notifications")
      .update({ read: true }).eq("user_id", context.userId).eq("read", false);
    return { ok: true };
  });

async function notify(supabase: unknown, user_id: string, kind: string, title: string, body?: string, metadata?: any) {
  await sb(supabase).from("notifications").insert({ user_id, kind, title, body, metadata: metadata ?? {} });
}

// ─────────────────────── OFFERS / PROVIDERS ───────────────────────
export const listActiveOffers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase).from("offers")
      .select("id,title,description,category,price_all,kind,image_url,provider_id,bookings,providers(name,category,logo_url)")
      .eq("status", "active").order("created_at", { ascending: false }).limit(50);
    return (data ?? []) as any[];
  });

export const getMyProvider = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase).from("providers")
      .select("*").eq("owner_user_id", context.userId).maybeSingle();
    return data as any | null;
  });

export const listDemandInsights = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase).from("demand_insights")
      .select("*").order("employees_interested", { ascending: false }).limit(20);
    return (data ?? []) as any[];
  });

// ─────────────────────── BENEFIT REQUESTS ───────────────────────
export const requestBenefit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    offer_id: z.string().uuid().optional(),
    title: z.string().min(2).max(200),
    amount_all: z.number().int().positive().max(10_000_000),
    employee_message: z.string().max(1000).optional(),
    ai_note: z.string().max(1000).optional(),
    provider_id: z.string().uuid().optional(),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const prof = await sb(supabase).from("profiles").select("company_id,full_name").eq("id", userId).maybeSingle();
    const { data: row, error } = await sb(supabase).from("benefit_requests").insert({
      employee_user_id: userId,
      company_id: prof.data?.company_id ?? null,
      offer_id: data.offer_id ?? null,
      provider_id: data.provider_id ?? null,
      title: data.title,
      amount_all: data.amount_all,
      employee_message: data.employee_message ?? null,
      ai_note: data.ai_note ?? null,
      status: "pending",
    }).select("*").single();
    if (error) throw new Error(error.message);

    // Notify company owner if exists
    if (prof.data?.company_id) {
      const co = await sb(supabase).from("companies").select("owner_user_id,name").eq("id", prof.data.company_id).maybeSingle();
      if (co.data?.owner_user_id) {
        await notify(supabase, co.data.owner_user_id, "approval_needed",
          "New benefit request",
          `${prof.data.full_name ?? "An employee"} requested ${data.title} (${data.amount_all.toLocaleString()} ALL).`,
          { request_id: row.id });
      }
    }
    return row;
  });

export const listMyRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase).from("benefit_requests")
      .select("*").eq("employee_user_id", context.userId)
      .order("created_at", { ascending: false }).limit(50);
    return (data ?? []) as any[];
  });

export const listCompanyApprovals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const cos = await sb(supabase).from("companies").select("id").eq("owner_user_id", userId);
    const ids = (cos.data ?? []).map((c: any) => c.id);
    if (!ids.length) return [] as any[];
    const { data } = await sb(supabase).from("benefit_requests")
      .select("*,employee:profiles!benefit_requests_employee_user_id_fkey(full_name,email)")
      .in("company_id", ids).order("created_at", { ascending: false }).limit(80);
    return (data ?? []) as any[];
  });

export const listProviderOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const provs = await sb(supabase).from("providers").select("id").eq("owner_user_id", userId);
    const ids = (provs.data ?? []).map((p: any) => p.id);
    if (!ids.length) return [] as any[];
    const { data } = await sb(supabase).from("benefit_requests")
      .select("*").in("provider_id", ids).order("created_at", { ascending: false }).limit(80);
    return (data ?? []) as any[];
  });

export const decideRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    id: z.string().uuid(),
    decision: z.enum(["approved", "rejected"]),
    note: z.string().max(500).optional(),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Load request and verify company ownership
    const req = await sb(supabase).from("benefit_requests").select("*").eq("id", data.id).single();
    if (req.error || !req.data) throw new Error("Request not found");
    const co = await sb(supabase).from("companies").select("owner_user_id,name,monthly_budget_all")
      .eq("id", req.data.company_id).maybeSingle();
    if (!co.data || co.data.owner_user_id !== userId) throw new Error("Not allowed");

    const { data: updated, error } = await sb(supabase).from("benefit_requests")
      .update({
        status: data.decision,
        decision_note: data.note ?? null,
        decided_by: userId,
        decided_at: new Date().toISOString(),
      }).eq("id", data.id).select("*").single();
    if (error) throw new Error(error.message);

    // Notify employee
    await notify(supabase, req.data.employee_user_id,
      data.decision === "approved" ? "request_approved" : "request_rejected",
      data.decision === "approved" ? `✅ ${req.data.title} approved` : `Request declined`,
      data.decision === "approved"
        ? `Your request was approved. Credits coming to your wallet now.`
        : (data.note ?? `Your request for ${req.data.title} was declined.`),
      { request_id: data.id });

    // If approved → credit employee wallet, log txn, also notify provider
    if (data.decision === "approved") {
      // Use admin to bypass RLS for cross-wallet writes
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const adminSb = sb(supabaseAdmin);

      // Employee wallet topup
      const ew = await adminSb.from("wallets").select("id,balance_all")
        .eq("owner_user_id", req.data.employee_user_id).eq("kind", "employee").maybeSingle();
      if (ew.data) {
        const newBal = ew.data.balance_all + req.data.amount_all;
        await adminSb.from("wallets").update({ balance_all: newBal }).eq("id", ew.data.id);
        await adminSb.from("wallet_transactions").insert({
          wallet_id: ew.data.id, kind: "allocation", amount_all: req.data.amount_all,
          balance_after: newBal,
          description: `Approved: ${req.data.title}`,
          related_request_id: req.data.id,
          metadata: { company: co.data.name },
        });
      }

      // Provider gets a new order notification + revenue
      if (req.data.provider_id) {
        const prov = await adminSb.from("providers").select("owner_user_id,name").eq("id", req.data.provider_id).maybeSingle();
        if (prov.data?.owner_user_id) {
          await notify(supabaseAdmin, prov.data.owner_user_id, "new_order",
            `New booking · ${req.data.title}`,
            `Funded by ${co.data.name}. ${req.data.amount_all.toLocaleString()} ALL inbound.`,
            { request_id: data.id });

          const pw = await adminSb.from("wallets").select("id,balance_all")
            .eq("owner_user_id", prov.data.owner_user_id).eq("kind", "provider").maybeSingle();
          if (pw.data) {
            const nb = pw.data.balance_all + req.data.amount_all;
            await adminSb.from("wallets").update({ balance_all: nb }).eq("id", pw.data.id);
            await adminSb.from("wallet_transactions").insert({
              wallet_id: pw.data.id, kind: "payout", amount_all: req.data.amount_all,
              balance_after: nb, description: `Order: ${req.data.title}`,
              related_request_id: req.data.id, metadata: { company: co.data.name },
            });
          }
          // Bump offer bookings
          if (req.data.offer_id) {
            const o = await adminSb.from("offers").select("bookings").eq("id", req.data.offer_id).maybeSingle();
            if (o.data) await adminSb.from("offers").update({ bookings: (o.data.bookings ?? 0) + 1 }).eq("id", req.data.offer_id);
          }
        }
      }

      // Mark fulfilled
      await adminSb.from("benefit_requests").update({
        status: "fulfilled", fulfilled_at: new Date().toISOString()
      }).eq("id", data.id);
    }

    return updated;
  });

// ─────────────────────── DIRECT CLAIM (debit employee wallet) ───────────────────────
export const claimOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    offer_id: z.string().uuid().optional(),
    provider_id: z.string().uuid().optional(),
    title: z.string().min(2).max(200),
    amount_all: z.number().int().positive().max(10_000_000),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = sb(supabaseAdmin);

    // 1) Check + debit employee wallet
    const ew = await admin.from("wallets").select("id,balance_all")
      .eq("owner_user_id", userId).eq("kind", "employee").maybeSingle();
    if (!ew.data) throw new Error("Wallet not found");
    if (ew.data.balance_all < data.amount_all) {
      throw new Error(`Insufficient balance. You have ${ew.data.balance_all.toLocaleString()} ALL.`);
    }
    const newBal = ew.data.balance_all - data.amount_all;
    await admin.from("wallets").update({ balance_all: newBal }).eq("id", ew.data.id);

    // 2) Log the request as fulfilled
    const prof = await admin.from("profiles").select("company_id,full_name").eq("id", userId).maybeSingle();
    const reqIns = await admin.from("benefit_requests").insert({
      employee_user_id: userId,
      company_id: prof.data?.company_id ?? null,
      offer_id: data.offer_id ?? null,
      provider_id: data.provider_id ?? null,
      title: data.title,
      amount_all: data.amount_all,
      status: "fulfilled",
      decided_at: new Date().toISOString(),
      fulfilled_at: new Date().toISOString(),
      ai_note: "Direct claim from wallet.",
    }).select("id").single();

    // 3) Log debit transaction
    await admin.from("wallet_transactions").insert({
      wallet_id: ew.data.id, kind: "spend", amount_all: -data.amount_all,
      balance_after: newBal,
      description: `Claimed: ${data.title}`,
      related_request_id: reqIns.data?.id ?? null,
    });

    // 4) Credit provider wallet & notify
    if (data.provider_id) {
      const prov = await admin.from("providers").select("owner_user_id,name").eq("id", data.provider_id).maybeSingle();
      if (prov.data?.owner_user_id) {
        const pw = await admin.from("wallets").select("id,balance_all")
          .eq("owner_user_id", prov.data.owner_user_id).eq("kind", "provider").maybeSingle();
        if (pw.data) {
          const nb = pw.data.balance_all + data.amount_all;
          await admin.from("wallets").update({ balance_all: nb }).eq("id", pw.data.id);
          await admin.from("wallet_transactions").insert({
            wallet_id: pw.data.id, kind: "payout", amount_all: data.amount_all,
            balance_after: nb, description: `Order: ${data.title}`,
            related_request_id: reqIns.data?.id ?? null,
          });
        }
        await notify(supabaseAdmin, prov.data.owner_user_id, "new_order",
          `New booking · ${data.title}`,
          `${prof.data?.full_name ?? "An employee"} claimed your perk. ${data.amount_all.toLocaleString()} ALL inbound.`,
          { request_id: reqIns.data?.id });
      }
      if (data.offer_id) {
        const o = await admin.from("offers").select("bookings").eq("id", data.offer_id).maybeSingle();
        if (o.data) await admin.from("offers").update({ bookings: (o.data.bookings ?? 0) + 1 }).eq("id", data.offer_id);
      }
    }

    // 5) Notify employee
    await notify(supabaseAdmin, userId, "perk_claimed",
      `🎟️ ${data.title} claimed`,
      `${data.amount_all.toLocaleString()} ALL debited. New balance: ${newBal.toLocaleString()} ALL.`,
      { request_id: reqIns.data?.id });

    return { ok: true, new_balance: newBal, request_id: reqIns.data?.id };
  });

// ─────────────────────── QUESTS ───────────────────────
export const listQuests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const q = await sb(supabase).from("quests").select("*").eq("active", true);
    const p = await sb(supabase).from("quest_progress").select("*").eq("user_id", userId);
    const byId = new Map<string, any>((p.data ?? []).map((x: any) => [x.quest_id, x]));
    return (q.data ?? []).map((quest: any) => ({
      ...quest,
      progress: byId.get(quest.id)?.progress ?? 0,
      completed: !!byId.get(quest.id)?.completed_at,
      claimed: !!byId.get(quest.id)?.claimed_at,
    }));
  });

export const advanceQuest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ quest_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const quest = await sb(supabase).from("quests").select("*").eq("id", data.quest_id).single();
    if (!quest.data) throw new Error("Quest not found");
    const existing = await sb(supabase).from("quest_progress").select("*")
      .eq("user_id", userId).eq("quest_id", data.quest_id).maybeSingle();

    const target = quest.data.target_progress ?? 1;
    const next = Math.min((existing.data?.progress ?? 0) + 1, target);
    const completed = next >= target;
    const patch: any = { progress: next };
    if (completed && !existing.data?.completed_at) patch.completed_at = new Date().toISOString();

    let row;
    if (existing.data) {
      const r = await sb(supabase).from("quest_progress").update(patch).eq("id", existing.data.id).select("*").single();
      row = r.data;
    } else {
      const r = await sb(supabase).from("quest_progress").insert({
        user_id: userId, quest_id: data.quest_id, ...patch,
      }).select("*").single();
      row = r.data;
    }

    if (completed && !existing.data?.claimed_at && quest.data.reward_all > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const adminSb = sb(supabaseAdmin);
      const w = await adminSb.from("wallets").select("id,balance_all").eq("owner_user_id", userId).eq("kind", "employee").maybeSingle();
      if (w.data) {
        const nb = w.data.balance_all + quest.data.reward_all;
        await adminSb.from("wallets").update({ balance_all: nb }).eq("id", w.data.id);
        await adminSb.from("wallet_transactions").insert({
          wallet_id: w.data.id, kind: "reward", amount_all: quest.data.reward_all,
          balance_after: nb, description: `Quest reward: ${quest.data.title}`,
          metadata: { quest_id: quest.data.id },
        });
      }
      await sb(supabase).from("quest_progress").update({ claimed_at: new Date().toISOString() }).eq("id", row.id);
      await notify(supabase, userId, "quest_completed", `🏆 ${quest.data.title} completed!`,
        `${quest.data.reward_all.toLocaleString()} ALL added to your wallet.`);
    }
    return { ...row, completed };
  });

// ─────────────────────── BENEFIT DNA ───────────────────────
export const getMyDna = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await sb(context.supabase).from("benefit_dna").select("*").eq("user_id", context.userId).maybeSingle();
    return data as any | null;
  });

// ─────────────────────── MARKETING CAMPAIGNS ───────────────────────
export const listMyCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const provs = await sb(supabase).from("providers").select("id").eq("owner_user_id", userId);
    const ids = (provs.data ?? []).map((p: any) => p.id);
    if (!ids.length) return [] as any[];
    const { data } = await sb(supabase).from("marketing_campaigns").select("*").in("provider_id", ids)
      .order("created_at", { ascending: false }).limit(40);
    return (data ?? []) as any[];
  });

export const publishCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // Simulate Publer publish + analytics
    const analytics = {
      views: 800 + Math.floor(Math.random() * 5000),
      reach: 500 + Math.floor(Math.random() * 3000),
      clicks: 30 + Math.floor(Math.random() * 400),
      conversions: 2 + Math.floor(Math.random() * 30),
      engagement_rate: +(8 + Math.random() * 18).toFixed(1),
    };
    const { data: row, error } = await sb(supabase).from("marketing_campaigns")
      .update({ status: "published", scheduled_for: new Date().toISOString(), analytics })
      .eq("id", data.id).select("*").single();
    if (error) throw new Error(error.message);
    return row;
  });

// ─────────────────────── STRATEGY REPORTS ───────────────────────
export const listStrategyReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const cos = await sb(supabase).from("companies").select("id").eq("owner_user_id", userId);
    const ids = (cos.data ?? []).map((c: any) => c.id);
    if (!ids.length) return [] as any[];
    const { data } = await sb(supabase).from("strategy_reports").select("*")
      .in("company_id", ids).order("generated_at", { ascending: false }).limit(20);
    return (data ?? []) as any[];
  });

// ─────────────────────── SEED FOR CURRENT USER ───────────────────────
/** Bootstraps a freshly-signed-up demo user: attach to first company if none,
 *  ensure a wallet exists, seed a starter notification + demo Benefit DNA if missing. */
export const bootstrapDemoUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = sb(supabaseAdmin);

    // role lookup
    const role = await admin.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
    const r = role.data?.role as string | undefined;

    // attach employee to first verified company if none yet
    if (r === "employee") {
      const prof = await admin.from("profiles").select("company_id").eq("id", userId).maybeSingle();
      if (!prof.data?.company_id) {
        const co = await admin.from("companies").select("id").eq("verification_status", "verified").limit(1).maybeSingle();
        if (co.data) await admin.from("profiles").update({ company_id: co.data.id }).eq("id", userId);
      }
    }
    // attach company role to first unowned company
    if (r === "company") {
      const owned = await admin.from("companies").select("id").eq("owner_user_id", userId).limit(1);
      if (!owned.data?.length) {
        const free = await admin.from("companies").select("id").is("owner_user_id", null).limit(1).maybeSingle();
        if (free.data) await admin.from("companies").update({ owner_user_id: userId }).eq("id", free.data.id);
      }
    }
    // provision provider profile if missing
    if (r === "provider") {
      const owned = await admin.from("providers").select("id").eq("owner_user_id", userId).limit(1);
      if (!owned.data?.length) {
        // attach to first unowned demo provider, else create blank
        const free = await admin.from("providers").select("id").is("owner_user_id", null).limit(1).maybeSingle();
        if (free.data) await admin.from("providers").update({ owner_user_id: userId }).eq("id", free.data.id);
        else await admin.from("providers").insert({
          owner_user_id: userId, name: "My Studio", category: "Wellness",
          description: "Set this up in Provider Studio.",
        });
      }
    }

    return { ok: true };
  });
