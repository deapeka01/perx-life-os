import type { LucideIcon } from "lucide-react";

export function GoalCard({
  eyebrow,
  label,
  progress,
  next,
  icon: Icon,
  tone = "coral",
}: {
  eyebrow: string;
  label: string;
  progress: number;
  next: string;
  icon: LucideIcon;
  tone?: "coral" | "sky";
}) {
  const toneClasses =
    tone === "coral"
      ? { bar: "bg-coral", chip: "bg-coral/10 text-coral", icon: "bg-coral text-white" }
      : { bar: "bg-sky", chip: "bg-sky/15 text-sky", icon: "bg-sky text-white" };

  return (
    <article className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-navy/15 hover:shadow-lift sm:p-6">
      <div className="flex items-start gap-4">
        <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${toneClasses.icon}`}>
          <Icon className="size-6" strokeWidth={2.2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-navy/55">{eyebrow}</p>
          <h3 className="mt-1 font-display text-lg font-extrabold text-navy sm:text-xl">{label}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 font-display text-sm font-extrabold tabular-nums ${toneClasses.chip}`}>
          {progress}%
        </span>
      </div>
      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-navy/5">
        <div
          className={`h-full rounded-full ${toneClasses.bar} transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-medium text-navy/70">
        <span className="font-extrabold text-navy">Next: </span>
        {next}
      </p>
    </article>
  );
}
