// Modal that surfaces a curated set of perk picks whenever the employee
// asks the concierge for bundles, suggestions, or things to discover.
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { discoverFeed, formatALL } from "@/lib/mock-data";
import { Sparkles, Check, Banknote } from "lucide-react";
import { useState } from "react";
import { PayByBankDialog, type PayByBankInitial } from "@/components/perx/PayByBankDialog";

type Pick = (typeof discoverFeed)[number];

const accentBg: Record<Pick["accent"], string> = {
  coral: "from-coral/40 via-coral/10 to-transparent",
  sky: "from-sky/40 via-sky/10 to-transparent",
  emerald: "from-emerald/40 via-emerald/10 to-transparent",
};

export function PerkPicksDialog({
  open,
  onOpenChange,
  query,
  picks,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  query: string;
  picks: Pick[];
}) {
  const [claimed, setClaimed] = useState<Set<string>>(new Set());
  const [payOpen, setPayOpen] = useState(false);
  const [payInitial, setPayInitial] = useState<PayByBankInitial | null>(null);

  const claim = (p: Pick) => {
    setPayInitial({
      kind: "perk_claim",
      amountALL: p.priceALL,
      description: `Perx perk · ${p.title} (${p.provider})`,
      payerLabel: "Employee",
      payeeLabel: "Perx Platform",
    });
    setPayOpen(true);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden border-white/50 bg-white/95 p-0 backdrop-blur-xl sm:rounded-3xl">
        <div className="border-b border-navy/5 bg-gradient-to-br from-coral/10 via-sky/10 to-emerald/10 px-6 py-5">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-coral">
              <Sparkles className="size-3.5" /> Perx picks for you
            </div>
            <DialogTitle className="font-display text-2xl font-extrabold text-navy">
              {query ? `Curated for "${query}"` : "Your curated picks"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-navy/65">
              Hand-picked by Perx based on your Benefit DNA, goals, and budget. Claim what fits — your concierge stays available in the chat.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {picks.map((p) => {
              const isClaimed = claimed.has(p.id);
              return (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-soft"
                >
                  <div className={`relative aspect-[5/3] overflow-hidden bg-gradient-to-br ${accentBg[p.accent]}`}>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        width={1024}
                        height={640}
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-7xl" aria-hidden>
                        {p.emoji}
                      </span>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-extrabold text-white shadow-soft">
                      <Sparkles className="size-3 text-coral" /> {p.matchScore}% match
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-navy/55">
                      {p.category} · {p.provider}
                    </p>
                    <h4 className="mt-1 font-display text-lg font-extrabold leading-snug text-navy">
                      {p.title}
                    </h4>
                    <p className="mt-1 text-sm text-navy/65">{p.story}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <p className="font-display text-base font-extrabold text-navy">
                        {formatALL(p.priceALL)}
                      </p>
                      <button
                        onClick={() => claim(p)}
                        disabled={isClaimed}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-display text-sm font-extrabold transition ${
                          isClaimed
                            ? "bg-emerald/20 text-emerald"
                            : "bg-coral text-white shadow-coral hover:-translate-y-0.5"
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <Check className="size-4" /> Claimed
                          </>
                        ) : (
                          <>Claim perk →</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Lightweight intent detector — fires the picks modal for discovery-style asks.
const TRIGGERS = [
  "bundle",
  "suggest",
  "suggestion",
  "discover",
  "recommend",
  "perk",
  "perks",
  "experience",
  "experiences",
  "show me",
  "find me",
  "find a",
  "options",
  "ideas",
  "surprise",
  "weekend",
  "plan",
];

export function shouldOpenPicks(text: string): boolean {
  const t = text.toLowerCase();
  return TRIGGERS.some((k) => t.includes(k));
}

export function pickFor(text: string): Pick[] {
  const t = text.toLowerCase();
  const scored = discoverFeed
    .map((p) => {
      let score = p.matchScore;
      if (t.includes(p.category.toLowerCase())) score += 30;
      if (t.includes(p.provider.toLowerCase())) score += 20;
      if (t.includes("wellness") && /spa|yoga|wellness|recovery/i.test(p.title + p.story)) score += 15;
      if (t.includes("learn") && /ai|course|lab|workshop|class/i.test(p.title + p.story + p.category)) score += 15;
      if (t.includes("adventure") && /hike|trip|paraglid|riviera|theth/i.test(p.title + p.story)) score += 15;
      if (t.includes("weekend") && /trip|brunch|riviera|spa/i.test(p.title + p.story)) score += 10;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.p);
  return scored;
}
