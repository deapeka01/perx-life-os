import type { ReactNode } from "react";

export function PerxCard({
  children,
  className = "",
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "navy" | "coral";
}) {
  const tones = {
    light: "bg-card border-border text-navy",
    navy: "bg-navy text-white border-white/10",
    coral: "bg-coral text-white border-coral/30 shadow-coral",
  };
  return (
    <div className={`rounded-3xl border p-6 shadow-soft ${tones[tone]} ${className}`}>{children}</div>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-navy/40">
      {children}
    </p>
  );
}
