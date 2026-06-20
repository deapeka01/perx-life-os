// Animated multi-ring AI orb — the visual signature of every Perx agent.
import { useId } from "react";

type Props = {
  size?: number;
  hue?: { from: string; via: string; to: string };
  spinning?: boolean;
  className?: string;
};

export function AIOrb({
  size = 80,
  hue = {
    from: "oklch(0.72 0.19 25)",
    via: "oklch(0.72 0.15 230)",
    to: "oklch(0.21 0.05 265)",
  },
  spinning = true,
  className = "",
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${hue.from}, ${hue.via} 50%, transparent 75%)`,
        }}
      />
      {/* core sphere */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative drop-shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <radialGradient id={`core-${id}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={hue.from} stopOpacity="1" />
            <stop offset="55%" stopColor={hue.via} stopOpacity="0.95" />
            <stop offset="100%" stopColor={hue.to} stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hue.from} stopOpacity="0.9" />
            <stop offset="100%" stopColor={hue.via} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="34" fill={`url(#core-${id})`} />
        {/* highlight */}
        <ellipse cx="38" cy="34" rx="13" ry="8" fill="white" opacity="0.35" />
        {/* orbital rings */}
        <g
          style={{
            transformOrigin: "50px 50px",
            animation: spinning ? "perx-orbit 18s linear infinite" : undefined,
          }}
        >
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="14"
            fill="none"
            stroke={`url(#ring-${id})`}
            strokeWidth="1.2"
            opacity="0.7"
          />
          <circle cx="96" cy="50" r="2.4" fill={hue.from} />
        </g>
        <g
          style={{
            transformOrigin: "50px 50px",
            animation: spinning ? "perx-orbit 28s linear infinite reverse" : undefined,
          }}
        >
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="14"
            transform="rotate(60 50 50)"
            fill="none"
            stroke={`url(#ring-${id})`}
            strokeWidth="1"
            opacity="0.55"
          />
          <circle cx="94" cy="50" r="2" fill={hue.via} transform="rotate(60 50 50)" />
        </g>
      </svg>
      <style>{`@keyframes perx-orbit { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
