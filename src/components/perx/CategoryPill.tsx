import type { LucideIcon } from "lucide-react";

export function CategoryPill({
  label,
  icon: Icon,
  tone = "navy",
}: {
  label: string;
  icon: LucideIcon;
  tone?: "navy" | "coral" | "sky" | "emerald";
}) {
  const tones = {
    navy: "bg-navy/5 text-navy",
    coral: "bg-coral/10 text-coral",
    sky: "bg-sky/15 text-sky",
    emerald: "bg-emerald/10 text-emerald",
  };
  return (
    <button
      type="button"
      className="group flex w-20 shrink-0 flex-col items-center gap-2 focus:outline-none"
    >
      <span
        className={`grid size-16 place-items-center rounded-2xl border-2 border-transparent transition group-hover:border-navy/20 group-focus-visible:border-coral ${tones[tone]}`}
      >
        <Icon className="size-7" strokeWidth={2.2} aria-hidden />
      </span>
      <span className="text-center text-xs font-bold leading-tight text-navy">{label}</span>
    </button>
  );
}
