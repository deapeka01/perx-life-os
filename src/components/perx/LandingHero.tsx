// Immersive landing hero: animated gradient mesh + orbiting nodes showing
// Company ↔ AI ↔ Employee ↔ Provider connected through Perx.
import { Building2, Sparkles, Store, User } from "lucide-react";
import { AIOrb } from "@/components/perx/AIOrb";

export function LandingHero() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* mesh */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-3xl opacity-80"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, oklch(0.72 0.19 25 / 0.35), oklch(0.72 0.15 230 / 0.35), oklch(0.7 0.16 160 / 0.3), oklch(0.5 0.16 260 / 0.4), oklch(0.72 0.19 25 / 0.35))",
          animation: "perx-spin 30s linear infinite",
        }}
      />

      {/* rotating orbital lines */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        style={{ animation: "perx-spin 50s linear infinite reverse" }}
      >
        <defs>
          <linearGradient id="orbit-stroke" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 25)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.72 0.15 230)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="170" fill="none" stroke="url(#orbit-stroke)" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="url(#orbit-stroke)" strokeWidth="1" strokeDasharray="2 5" />
      </svg>

      {/* center: Perx AI orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <AIOrb size={160} />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid size-12 place-items-center rounded-full bg-white/90 font-display text-2xl font-extrabold text-navy shadow-lift backdrop-blur">
            P
          </span>
        </div>
      </div>

      {/* orbiting nodes */}
      <Node label="Employee" Icon={User} angle={-90} radius={42} accent="coral" />
      <Node label="Company" Icon={Building2} angle={30} radius={42} accent="sky" />
      <Node label="Provider" Icon={Store} angle={150} radius={42} accent="emerald" />
      <Node label="AI" Icon={Sparkles} angle={210} radius={29} accent="navy" floating />

      <style>{`@keyframes perx-spin { to { transform: rotate(360deg); } } @keyframes perx-float { 0%,100% { transform: translate(-50%,-50%) translateY(0); } 50% { transform: translate(-50%,-50%) translateY(-6px); } }`}</style>
    </div>
  );
}

function Node({
  label,
  Icon,
  angle,
  radius,
  accent,
  floating,
}: {
  label: string;
  Icon: typeof User;
  angle: number;
  radius: number; // % from center
  accent: "coral" | "sky" | "emerald" | "navy";
  floating?: boolean;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  const accents = {
    coral: "bg-coral text-white",
    sky: "bg-sky text-white",
    emerald: "bg-emerald text-white",
    navy: "bg-navy text-coral",
  }[accent];

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        animation: floating ? "perx-float 5s ease-in-out infinite" : undefined,
      }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div className={`grid size-14 place-items-center rounded-2xl shadow-lift ring-2 ring-white/70 ${accents}`}>
          <Icon className="size-6" strokeWidth={2.4} />
        </div>
        <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-navy shadow-soft backdrop-blur">
          {label}
        </span>
      </div>
    </div>
  );
}
