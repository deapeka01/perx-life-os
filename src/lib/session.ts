// Mock session — invitation-code driven role assignment. No real auth.
import type { Role } from "@/lib/mock-data";

const KEY = "perx.session";

export type Session = {
  role: Role;
  email: string;
  name?: string;
  onboarded: boolean;
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function roleFromInvitationCode(code: string): Role | null {
  const c = code.trim().toUpperCase();
  if (c.startsWith("EMP")) return "employee";
  if (c.startsWith("CO")) return "company";
  if (c.startsWith("PRV")) return "provider";
  return null;
}

export function roleHomePath(role: Role): "/employee" | "/company" | "/provider" {
  return `/${role}` as const;
}
