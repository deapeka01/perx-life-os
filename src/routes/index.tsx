import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LandingHero } from "@/components/perx/LandingHero";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perx — AI-Powered Employee Lifestyle Operating System" },
      {
        name: "description",
        content:
          "Helping companies invest in people, helping employees grow, and helping providers reach the right audience.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      {/* ambient mesh background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, oklch(0.72 0.19 25 / 0.35), transparent 70%), radial-gradient(60% 50% at 10% 100%, oklch(0.72 0.15 230 / 0.4), transparent 60%), radial-gradient(40% 30% at 50% 50%, oklch(0.7 0.16 160 / 0.2), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/10 font-display text-lg font-extrabold text-white backdrop-blur">
            P
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">Perx</span>
        </div>
        <LanguageSwitcher compact />
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-6 md:grid-cols-2 md:px-10 md:pt-10">
        <section className="order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-coral" />
            AI-Native Operating System
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-balance sm:text-6xl md:text-7xl">
            PERX
          </h1>
          <p className="mt-3 font-display text-xl font-bold leading-tight text-white/90 sm:text-2xl">
            AI-Powered Employee Lifestyle Operating System
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Helping companies invest in people, helping employees grow, and helping providers
            reach the right audience — connected through one intelligent ecosystem.
          </p>

          <Link
            to="/auth"
            className="group mt-9 inline-flex h-14 items-center gap-3 rounded-2xl bg-white pl-6 pr-3 font-display text-base font-extrabold text-navy shadow-lift transition hover:-translate-y-0.5"
          >
            Enter Perx
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
              <ArrowRight className="size-5" />
            </span>
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.16em] text-white/55">
            <span>Company</span>
            <span aria-hidden>·</span>
            <span>AI</span>
            <span aria-hidden>·</span>
            <span>Employee</span>
            <span aria-hidden>·</span>
            <span>Provider</span>
          </div>
        </section>

        <section className="order-1 md:order-2">
          <LandingHero />
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-5 text-center text-xs font-medium text-white/40">
        Mock data only · No real transactions · Albanian Lek (ALL)
      </footer>
    </div>
  );
}
