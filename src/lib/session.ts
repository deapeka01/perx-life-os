// Session helpers backed by Lovable Cloud (Supabase auth + profiles).
import type { Role } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";

const ROLE_KEY = "perx.role"; // last-known role cache, for fast UI routing

export type Session = {
  userId: string;
  role: Role;
  email: string;
  name?: string;
  companyId?: string | null;
  onboarded: boolean;
};

export function cacheRole(role: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROLE_KEY, role);
}
export function cachedRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(ROLE_KEY);
  return v === "employee" || v === "company" || v === "provider" ? v : null;
}

export async function getSession(): Promise<Session | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_id, onboarded")
    .eq("id", user.id)
    .maybeSingle();
  const { data: rolesRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  const role = (rolesRow?.role as Role) ?? "employee";
  cacheRole(role);
  return {
    userId: user.id,
    role,
    email: user.email ?? "",
    name: profile?.full_name ?? undefined,
    companyId: profile?.company_id ?? null,
    onboarded: profile?.onboarded ?? false,
  };
}

export async function signOut() {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") window.localStorage.removeItem(ROLE_KEY);
}

export function roleHomePath(role: Role): "/employee" | "/company" | "/provider" {
  return `/${role}` as const;
}

/** Redeem an invitation code via secure server-side RPC. */
export async function redeemInvitationCode(code: string): Promise<
  { ok: true; role: Role } | { ok: false; error: string }
> {
  const normalized = code.trim().toUpperCase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { data, error } = await supabase.rpc("redeem_invitation_code", { _code: normalized });
  if (error) return { ok: false, error: error.message };
  const result = data as { ok: boolean; role?: Role; error?: string } | null;
  if (!result?.ok) return { ok: false, error: result?.error ?? "Invalid or expired code." };

  const role = result.role as Role;
  cacheRole(role);
  return { ok: true, role };
}


/** Persist onboarding payload to the database (upsert per user). */
export async function saveOnboarding(payload: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = payload as any;
  const { data: existing } = await supabase
    .from("onboarding_responses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing?.id) {
    await supabase.from("onboarding_responses").update({ payload: json }).eq("id", existing.id);
  } else {
    await supabase.from("onboarding_responses").insert({ user_id: user.id, payload: json });
  }
  await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
}
