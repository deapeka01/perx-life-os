import { Clock } from "lucide-react";
import { Countdown } from "./Countdown";

type Accent = "coral" | "sky" | "emerald";

const tones: Record<Accent, { wrap: string; pill: string; bar: string }> = {
  coral: {
    wrap: "border-coral/30 bg-gradient-to-br from-coral/15 via-coral/5 to-transparent",
    pill: "bg-coral text-white",
    bar: "text-coral",
  },
  sky: {
    wrap: "border-sky/30 bg-gradient-to-br from-sky/15 via-sky/5 to-transparent",
    pill: "bg-sky text-white",
    bar: "text-sky",
  },
  emerald: {
    wrap: "border-emerald/30 bg-gradient-to-br from-emerald/15 via-emerald/5 to-transparent",
    pill: "bg-emerald text-white",
    bar: "text-emerald",
  },
};

export function PerxDropCard({
  title,
  desc,
  emoji,
  image,
  endsInSeconds,
  spotsLeft,
  accent = "coral",
}: {
  title: string;
  desc: string;
  emoji: string;
  image?: string;
  endsInSeconds: number;
  spotsLeft: number;
  accent?: Accent;
}) {
  const t = tones[accent];
  return (
    <article
      className={`flex h-full min-w-[280px] flex-col overflow-hidden rounded-3xl border-2 shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:min-w-0 ${t.wrap}`}
    >
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={1024}
            height={640}
            className="absolute inset-0 size-full object-cover"
          />
          <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider shadow-soft ${t.pill}`}>
            Drop · {spotsLeft} left
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {!image && (
            <div className="flex items-start justify-between gap-3">
              <span className="text-4xl leading-none" aria-hidden>
                {emoji}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${t.pill}`}>
                Drop · {spotsLeft} left
              </span>
            </div>
          )}
          <h3 className={`font-display text-xl font-extrabold text-navy ${image ? "" : "mt-4"}`}>{title}</h3>
          <p className="mt-1 text-sm font-medium text-navy/70">{desc}</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-dashed border-navy/10 pt-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider ${t.bar}`}>
            <Clock className="size-3.5" aria-hidden /> Ends in
          </span>
          <Countdown seconds={endsInSeconds} compact />
        </div>
      </div>
    </article>
  );
}
