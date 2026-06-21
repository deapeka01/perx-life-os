// Minimal top bar used by every role surface. Replaces the old sidebar.
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AIOrb } from "@/components/perx/AIOrb";
import { AGENTS, type AgentId } from "@/lib/agents";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";
import { signOut } from "@/lib/session";

export function RoleTopBar({
  agent,
  rightExtras,
}: {
  agent: AgentId;
  rightExtras?: ReactNode;
}) {
  const meta = AGENTS[agent];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <AIOrb size={36} hue={meta.hue} spinning={false} />
          <div className="hidden sm:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
              {meta.role}
            </p>
            <p className="font-display text-sm font-extrabold text-navy">{meta.name}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {rightExtras}
          <Link
            to="/billing"
            className="hidden h-10 items-center gap-1.5 rounded-full border-2 border-border bg-white px-3 text-xs font-extrabold text-navy shadow-soft transition hover:border-coral hover:text-coral sm:inline-flex"
          >
            Billing
          </Link>
          <LanguageSwitcher compact />
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 items-center gap-2 rounded-full border-2 border-border bg-white px-3 text-sm font-extrabold text-navy shadow-soft transition hover:border-coral"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <span className="grid size-6 place-items-center rounded-full bg-gradient-ai text-[10px] font-extrabold text-white">
                Me
              </span>
              <ChevronDown className="size-3.5" />
            </button>
            {open && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-white p-1 shadow-lift"
                role="menu"
              >
                <button
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/" });
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-navy hover:bg-canvas"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
