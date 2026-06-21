// Landing hero — a bonsai in the center, surrounded by four soft orbiting roles.
// The bonsai loops drained → revived, embodying Perx restoring energy and motivation.
import { Sprout, Leaf, Sun, Droplet } from "lucide-react";
import { Bonsai } from "@/components/perx/Bonsai";

export function LandingHero() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[620px]">
      {/* concentric breathing rings */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="hero-ring" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="oklch(0.7 0.16 160)" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(0.7 0.16 160)" stopOpacity="0.25" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="none" stroke="url(#hero-ring)" strokeWidth="1" />
        <circle
          cx="200" cy="200" r="150" fill="none"
          stroke="oklch(0.72 0.19 25 / 0.18)" strokeWidth="1" strokeDasharray="2 7"
          style={{ transformOrigin: "200px 200px", animation: "hero-spin 60s linear infinite" }}
        />
        <circle
          cx="200" cy="200" r="115" fill="none"
          stroke="oklch(0.72 0.15 230 / 0.15)" strokeWidth="1" strokeDasharray="1 6"
          style={{ transformOrigin: "200px 200px", animation: "hero-spin 90s linear infinite reverse" }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <Bonsai size={420} />
      </div>

      {/* surrounding role nodes — nature themed */}
      <Node label="Employee"  Icon={Sprout}  angle={-90} radius={46} tone="emerald" />
      <Node label="Company"   Icon={Sun}     angle={20}  radius={46} tone="amber" />
      <Node label="Provider"  Icon={Droplet} angle={140} radius={46} tone="sky" />
      <Node label="AI"        Icon={Leaf}    angle={230} radius={32} tone="coral" floating />

      <style>{`
        @keyframes hero-spin { to { transform: rotate(360deg); } }
        @keyframes hero-float {
          0%,100% { transform: translate(-50%,-50%) translateY(0); }
          50%     { transform: translate(-50%,-50%) translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

function Node({
  label, Icon, angle, radius, tone, floating,
}: {
  label: string;
  Icon: typeof Sprout;
  angle: number;
  radius: number;
  tone: "emerald" | "amber" | "sky" | "coral";
  floating?: boolean;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  const tones = {
    emerald: "bg-gradient-to-br from-[oklch(0.78_0.16_155)] to-[oklch(0.52_0.16_160)] text-white",
    amber:   "bg-gradient-to-br from-[oklch(0.86_0.18_90)]  to-[oklch(0.7_0.19_60)]   text-white",
    sky:     "bg-gradient-to-br from-[oklch(0.82_0.12_220)] to-[oklch(0.6_0.18_240)]  text-white",
    coral:   "bg-gradient-to-br from-[oklch(0.82_0.16_30)]  to-[oklch(0.6_0.21_18)]   text-white",
  }[tone];

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        animation: floating ? "hero-float 5s ease-in-out infinite" : undefined,
      }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div className={`grid size-16 place-items-center rounded-3xl shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] ring-2 ring-white/30 ${tones}`}>
          <Icon className="size-7" strokeWidth={2.2} />
        </div>
        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.15em] text-navy shadow-soft backdrop-blur">
          {label}
        </span>
      </div>
    </div>
  );
}
