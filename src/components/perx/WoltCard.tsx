import { Star } from "lucide-react";
import { formatALL } from "@/lib/mock-data";

type Accent = "coral" | "sky" | "emerald";

const accentBg: Record<Accent, string> = {
  coral: "from-coral/35 via-coral/15 to-transparent",
  sky: "from-sky/35 via-sky/10 to-transparent",
  emerald: "from-emerald/35 via-emerald/10 to-transparent",
};

export function WoltCard({
  title,
  provider,
  category,
  priceALL,
  matchScore,
  accent = "sky",
  matchLabel = "match",
  className = "",
}: {
  title: string;
  provider: string;
  category: string;
  priceALL: number;
  matchScore?: number;
  accent?: Accent;
  matchLabel?: string;
  className?: string;
}) {
  return (
    <article
      className={`group flex h-full min-h-[260px] flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-navy/20 hover:shadow-lift ${className}`}
    >
      <div className={`relative aspect-[5/3] bg-gradient-to-br ${accentBg[accent]}`}>
        <span className="absolute inset-0 grid place-items-center px-4 text-center font-display text-lg font-extrabold text-navy/40">
          {provider}
        </span>
        {matchScore != null && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-extrabold text-white shadow-soft">
            <Star className="size-3 fill-coral text-coral" aria-hidden />
            {matchScore}% {matchLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-navy/60">{category}</p>
        <h5 className="mt-1 line-clamp-2 font-display text-lg font-extrabold leading-snug text-navy">
          {title}
        </h5>
        <p className="mt-auto pt-3 font-display text-base font-extrabold text-navy">
          {formatALL(priceALL)}
        </p>
      </div>
    </article>
  );
}
