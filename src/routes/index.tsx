import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LandingHero } from "@/components/perx/LandingHero";
import { LanguageSwitcher } from "@/components/perx/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perx. AI-Powered Employee Lifestyle Operating System." },
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
  const { t } = useI18n();
  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      {/* flowing mesh background — no grid, soft and cinematic */}
      <FlowingBackground />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/10 font-display text-lg font-extrabold text-white backdrop-blur">
            P
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">Perx</span>
        </div>
        <LanguageSwitcher compact dark />
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-6 md:grid-cols-2 md:px-10 md:pt-10">
        <section className="order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-coral" />
            {t("landing.tag")}
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-balance sm:text-6xl md:text-7xl">
            PERX
          </h1>
          <p className="mt-3 font-display text-xl font-bold leading-tight text-white/95 sm:text-2xl">
            AI-Powered Employee Lifestyle Operating System
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t("landing.subtitle")}
          </p>

          <Link
            to="/auth"
            className="group mt-9 inline-flex h-14 items-center gap-3 rounded-2xl bg-white pl-6 pr-3 font-display text-base font-extrabold text-navy shadow-lift transition hover:-translate-y-0.5"
          >
            {t("landing.cta")}
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-ai text-white">
              <ArrowRight className="size-5" />
            </span>
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-white/65">
            <span>Company</span>
            <span aria-hidden>•</span>
            <span>AI</span>
            <span aria-hidden>•</span>
            <span>Employee</span>
            <span aria-hidden>•</span>
            <span>Provider</span>
          </div>
        </section>

        <section className="order-1 md:order-2">
          <LandingHero />
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-5 text-center text-xs font-medium text-white/55">
        {t("landing.footer")}
      </footer>
    </div>
  );
}

function FlowingBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 80% 8%, oklch(0.72 0.19 25 / 0.45), transparent 70%), radial-gradient(65% 55% at 8% 100%, oklch(0.72 0.15 230 / 0.55), transparent 65%), radial-gradient(50% 40% at 50% 45%, oklch(0.7 0.16 160 / 0.28), transparent 75%)",
        }}
      />
      {/* organic flowing blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 size-[640px] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.15 230 / 0.55), transparent 70%)",
          animation: "blob-drift-1 22s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[560px] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.19 25 / 0.5), transparent 70%)",
          animation: "blob-drift-2 28s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 size-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.16 160 / 0.45), transparent 70%)",
          animation: "blob-drift-3 32s ease-in-out infinite",
        }}
      />
      {/* faint film grain for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      <style>{`
        @keyframes blob-drift-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,-40px) scale(1.08); } }
        @keyframes blob-drift-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,60px) scale(1.05); } }
        @keyframes blob-drift-3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.1); } }
      `}</style>
    </>
  );
}
