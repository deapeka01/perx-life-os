// Bonsai — the visual signature of Perx.
// A drained bonsai loses its leaves, then is revived with a fresh canopy.
// The animation loops continuously to communicate renewal of energy & motivation.
import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
};

export function Bonsai({ size = 360, className = "" }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* soft ambient halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 45%, oklch(0.78 0.16 155 / 0.45), oklch(0.72 0.19 25 / 0.18) 60%, transparent 80%)",
          animation: "bonsai-halo 8s ease-in-out infinite",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        className="relative drop-shadow-[0_30px_50px_rgba(15,23,42,0.45)]"
      >
        <defs>
          <radialGradient id={`pot-${id}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="oklch(0.78 0.12 35)" />
            <stop offset="100%" stopColor="oklch(0.42 0.1 28)" />
          </radialGradient>
          <linearGradient id={`leaves-${id}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.82 0.18 145)" />
            <stop offset="55%" stopColor="oklch(0.7 0.18 155)" />
            <stop offset="100%" stopColor="oklch(0.5 0.16 160)" />
          </linearGradient>
          <linearGradient id={`leavesAccent-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.85 0.18 95)" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 25)" />
          </linearGradient>
          <linearGradient id={`trunk-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.36 0.06 50)" />
            <stop offset="100%" stopColor="oklch(0.24 0.05 40)" />
          </linearGradient>
        </defs>

        {/* Pot */}
        <g>
          <path
            d="M120 305 L280 305 L264 360 Q200 380 136 360 Z"
            fill={`url(#pot-${id})`}
          />
          <ellipse cx="200" cy="305" rx="80" ry="10" fill="oklch(0.28 0.06 40)" opacity="0.85" />
          <path
            d="M130 308 L270 308"
            stroke="oklch(0.95 0.04 80 / 0.45)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Soil */}
        <ellipse cx="200" cy="303" rx="72" ry="6" fill="oklch(0.22 0.04 40)" />

        {/* Trunk — gnarled bonsai */}
        <g>
          <path
            d="M205 305 C 198 270 210 245 195 215 C 178 188 205 165 195 140 C 188 120 205 100 218 92"
            stroke={`url(#trunk-${id})`}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* secondary branch */}
          <path
            d="M203 230 C 175 222 158 205 150 188"
            stroke={`url(#trunk-${id})`}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M198 175 C 222 168 240 158 252 144"
            stroke={`url(#trunk-${id})`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Canopy — lush. Drains (wilts), blows away, then revives. */}
        <g
          style={{
            transformOrigin: "200px 130px",
            animation: "bonsai-canopy 8s cubic-bezier(0.65, 0, 0.35, 1) infinite",
          }}
        >
          <Cluster cx={218} cy={92} r={42} fill={`url(#leaves-${id})`} />
          <Cluster cx={148} cy={180} r={36} fill={`url(#leaves-${id})`} />
          <Cluster cx={254} cy={138} r={38} fill={`url(#leaves-${id})`} />
          <Cluster cx={196} cy={146} r={30} fill={`url(#leavesAccent-${id})`} />
          <Cluster cx={228} cy={120} r={26} fill={`url(#leavesAccent-${id})`} />
        </g>

        {/* Falling petals — drift away when canopy wilts */}
        <g>
          {petals.map((p, i) => (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={i % 2 === 0 ? "oklch(0.72 0.19 25)" : "oklch(0.7 0.16 160)"}
              style={{
                transformOrigin: `${p.cx}px ${p.cy}px`,
                animation: `bonsai-petal-${i % 3} 8s ${p.delay}s ease-in-out infinite`,
                opacity: 0,
              }}
            />
          ))}
        </g>

        {/* Energy spark — coral pulse near the heart of the trunk */}
        <circle
          cx="205"
          cy="220"
          r="6"
          fill="oklch(0.72 0.19 25)"
          style={{ animation: "bonsai-spark 8s ease-in-out infinite", transformOrigin: "205px 220px" }}
        />
      </svg>

      <style>{`
        @keyframes bonsai-halo {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          45% { transform: scale(0.92); opacity: 0.35; }
          70% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes bonsai-canopy {
          0%   { transform: scale(1) translateY(0); filter: saturate(1) brightness(1); opacity: 1; }
          30%  { transform: scale(0.92) translateY(4px); filter: saturate(0.45) brightness(0.85); opacity: 0.85; }
          48%  { transform: scale(0.6) translateY(18px); filter: saturate(0.1) brightness(0.7); opacity: 0; }
          58%  { transform: scale(0.4) translateY(0); filter: saturate(1) brightness(1); opacity: 0; }
          78%  { transform: scale(0.85) translateY(0); filter: saturate(1) brightness(1.05); opacity: 1; }
          100% { transform: scale(1) translateY(0); filter: saturate(1) brightness(1); opacity: 1; }
        }
        @keyframes bonsai-spark {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          55%      { opacity: 1;   transform: scale(1.8); }
          70%      { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes bonsai-petal-0 {
          0%, 20%, 100% { opacity: 0; transform: translate(0,0) rotate(0); }
          35% { opacity: 0.9; }
          55% { opacity: 0; transform: translate(60px, 90px) rotate(120deg); }
        }
        @keyframes bonsai-petal-1 {
          0%, 22%, 100% { opacity: 0; transform: translate(0,0) rotate(0); }
          38% { opacity: 0.9; }
          58% { opacity: 0; transform: translate(-50px, 110px) rotate(-90deg); }
        }
        @keyframes bonsai-petal-2 {
          0%, 25%, 100% { opacity: 0; transform: translate(0,0) rotate(0); }
          40% { opacity: 0.9; }
          60% { opacity: 0; transform: translate(30px, 130px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

function Cluster({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <circle cx={cx - r * 0.55} cy={cy + r * 0.2} r={r * 0.75} fill={fill} />
      <circle cx={cx + r * 0.6} cy={cy + r * 0.1} r={r * 0.7} fill={fill} />
      <circle cx={cx + r * 0.1} cy={cy - r * 0.55} r={r * 0.7} fill={fill} />
    </g>
  );
}

const petals = [
  { cx: 210, cy: 130, r: 4, delay: 0 },
  { cx: 180, cy: 150, r: 3, delay: 0.2 },
  { cx: 240, cy: 120, r: 3.5, delay: 0.4 },
  { cx: 230, cy: 160, r: 3, delay: 0.1 },
  { cx: 200, cy: 110, r: 4, delay: 0.3 },
  { cx: 165, cy: 175, r: 3, delay: 0.5 },
];
