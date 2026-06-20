import type { ReactNode } from "react";

export function StatTile({
  label,
  value,
  delta,
  icon,
  tone = "light",
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
  tone?: "light" | "navy" | "coral";
}) {
  const tones = {
    light: "bg-card border-border text-navy",
    navy: "bg-navy text-white border-white/10",
    coral: "bg-coral text-white border-coral/30 shadow-coral",
  };
  return (
    <div className={`rounded-3xl border p-6 shadow-soft ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            tone === "light" ? "text-navy/40" : "text-white/60"
          }`}
        >
          {label}
        </p>
        {icon && (
          <div
            className={`grid size-9 place-items-center rounded-xl ${
              tone === "light" ? "bg-navy/5 text-navy" : "bg-white/10 text-white"
            }`}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold tabular-nums">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-xs font-bold ${
            tone === "light" ? "text-emerald" : "text-white/70"
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
