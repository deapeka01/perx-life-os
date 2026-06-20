import { useEffect, useState } from "react";

export function Countdown({ seconds, compact = false }: { seconds: number; compact?: boolean }) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const Pad = (n: number) => n.toString().padStart(2, "0");

  if (compact) {
    return (
      <span className="font-display font-bold tabular-nums text-coral">
        {Pad(h)}:{Pad(m)}:{Pad(sec)}
      </span>
    );
  }

  const Cell = ({ value, label }: { value: number; label: string }) => (
    <div className="min-w-[52px] rounded-lg border border-border bg-card px-3 py-2 text-center">
      <span className="block font-display text-base font-extrabold tabular-nums text-navy">{Pad(value)}</span>
      <span className="text-[8px] font-bold uppercase text-navy/40">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-2">
      <Cell value={h} label="Hrs" />
      <Cell value={m} label="Min" />
      <Cell value={sec} label="Sec" />
    </div>
  );
}
