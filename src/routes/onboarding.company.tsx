import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AgentChat } from "@/components/perx/AgentChat";
import { saveOnboarding } from "@/lib/session";

export const Route = createFileRoute("/onboarding/company")({
  head: () => ({ meta: [{ title: "Set up your company. Perx." }] }),
  component: CompanyOnboarding,
});

function CompanyOnboarding() {
  const navigate = useNavigate();
  const finish = async () => {
    await saveOnboarding({ kind: "company", capturedAt: new Date().toISOString() });
    navigate({ to: "/company" });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(40% 30% at 80% 0%, oklch(0.62 0.18 240 / 0.4), transparent 70%), radial-gradient(40% 30% at 0% 100%, oklch(0.5 0.16 260 / 0.35), transparent 60%)",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 font-display text-base font-extrabold backdrop-blur">P</span>
          <span className="font-display text-sm font-extrabold">Company onboarding</span>
        </Link>
        <button
          onClick={finish}
          className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-navy shadow-lift transition hover:-translate-y-0.5"
        >
          Skip to HQ <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </button>
      </header>

      <main className="relative z-10 mx-auto h-[calc(100dvh-72px)] max-w-5xl px-5 pb-6 md:px-10">
        <AgentChat
          agent="onboarding-company"
          variant="card"
          initialQ="Start the onboarding. Introduce yourself and ask the first question."
        />
      </main>
    </div>
  );
}
