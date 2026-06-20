import { formatALL } from "@/lib/mock-data";

type Accent = "coral" | "sky" | "emerald";

const accentBg: Record<Accent, string> = {
  coral: "bg-coral/10 text-coral",
  sky: "bg-sky/10 text-sky",
  emerald: "bg-emerald/10 text-emerald",
};

const accentGrad: Record<Accent, string> = {
  coral: "from-coral/40 via-coral/10 to-transparent",
  sky: "from-sky/40 via-sky/10 to-transparent",
  emerald: "from-emerald/40 via-emerald/10 to-transparent",
};

export function ExperienceCard({
  title,
  provider,
  category,
  priceALL,
  matchScore,
  accent = "sky",
  badge,
}: {
  title: string;
  provider: string;
  category: string;
  priceALL: number;
  matchScore?: number;
  accent?: Accent;
  badge?: string;
}) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <div
        className={`relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${accentGrad[accent]} grid place-items-center`}
      >
        <span className="px-4 text-center font-display text-base font-extrabold text-navy/40">
          {provider}
        </span>
        {badge && (
          <span className={`absolute right-3 top-3 rounded-md px-2 py-1 text-[10px] font-extrabold italic ${accentBg[accent]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">{category}</p>
          <h5 className="truncate font-display text-base font-extrabold text-navy">{title}</h5>
        </div>
        {matchScore != null && (
          <div className="shrink-0 rounded-md bg-sky/10 px-2 py-1 text-[10px] font-extrabold italic text-sky">
            {matchScore}% Match
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-base font-bold text-navy">{formatALL(priceALL)}</p>
        <span className="text-sm font-bold text-coral transition group-hover:translate-x-1">
          Explore →
        </span>
      </div>
    </article>
  );
}
