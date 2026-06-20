import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Sparkles, Store } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perx — Choose your experience" },
      {
        name: "description",
        content:
          "An AI-powered Employee Lifestyle Operating System for companies, employees and providers.",
      },
    ],
  }),
  component: RolePicker,
});

const roles = [
  {
    to: "/employee",
    icon: Sparkles,
    label: "Employee",
    name: "Mirëmëngjes, Ardit",
    desc: "Pursue goals, discover experiences, talk to your AI Lifestyle Concierge.",
    tone: "coral" as const,
    cta: "Enter as Ardit",
  },
  {
    to: "/company",
    icon: Building2,
    label: "Company",
    name: "DigitSapiens HQ",
    desc: "Fund growth and wellbeing. AI-driven approvals, insights and budget intelligence.",
    tone: "navy" as const,
    cta: "Enter HR cockpit",
  },
  {
    to: "/provider",
    icon: Store,
    label: "Provider",
    name: "Bamboo Spa",
    desc: "Reach qualified corporate customers. See demand. Build offers with AI.",
    tone: "sky" as const,
    cta: "Enter provider studio",
  },
];

function RolePicker() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 size-[420px] rounded-full bg-coral/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 size-[480px] rounded-full bg-sky/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-16 md:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-coral font-display text-xl font-bold text-white shadow-coral">
              P
            </div>
            <div>
              <p className="font-display text-lg font-extrabold text-navy">Perx</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                Employee Lifestyle OS
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-navy/50 md:inline-block">
            Hackathon MVP · Albania
          </span>
        </div>

        <section className="mt-16 max-w-3xl animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-coral">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-coral" /> Now in private beta
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-navy text-balance sm:text-6xl">
            One ecosystem.
            <br />
            <span className="text-coral">Three lives</span> made easier by AI.
          </h1>
          <p className="mt-5 max-w-xl text-base text-navy/60 sm:text-lg">
            Companies fund growth and wellbeing. Employees pursue goals and experiences. Providers
            gain qualified corporate customers. Perx is the intelligence layer between them.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {roles.map((r, i) => {
            const Icon = r.icon;
            const tones = {
              coral: "bg-coral text-white border-coral/30 shadow-coral",
              navy: "bg-navy text-white border-navy/40",
              sky: "bg-card text-navy border-border",
            };
            return (
              <Link
                key={r.to}
                to={r.to}
                className={`group relative flex flex-col gap-6 overflow-hidden rounded-[28px] border p-7 shadow-soft transition hover:-translate-y-2 hover:shadow-lift animate-slide-up ${tones[r.tone]}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`grid size-12 place-items-center rounded-2xl ${
                      r.tone === "sky" ? "bg-sky/10 text-sky" : "bg-white/10 text-white"
                    }`}
                  >
                    <Icon className="size-6" strokeWidth={2.2} />
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-widest ${
                      r.tone === "sky" ? "text-navy/40" : "text-white/60"
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold">{r.name}</h3>
                  <p
                    className={`mt-2 text-sm ${
                      r.tone === "sky" ? "text-navy/60" : "text-white/70"
                    }`}
                  >
                    {r.desc}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-display font-bold">{r.cta}</span>
                  <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </section>

        <footer className="mt-16 grid gap-6 border-t border-border pt-8 text-xs font-medium text-navy/40 sm:flex sm:items-center sm:justify-between">
          <p>Mock data only · No real transactions · Lek (ALL) currency</p>
          <div className="flex gap-4">
            <span>Spotify ✦ Airbnb ✦ Duolingo ✦ Headspace energy</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
