type Trait = { id: string; trait: string; intensity: number; emoji: string };

export function DnaStrip({ traits }: { traits: readonly Trait[] }) {
  return (
    <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-navy/55">
            Your Benefit DNA
          </p>
          <h3 className="mt-1 font-display text-xl font-extrabold text-navy">
            How Perx sees you
          </h3>
        </div>
        <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-coral">
          Evolving
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {traits.map((t) => (
          <li key={t.id} className="flex items-center gap-4">
            <span className="text-2xl leading-none" aria-hidden>
              {t.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-display text-base font-extrabold text-navy">{t.trait}</span>
                <span className="font-display text-xs font-extrabold tabular-nums text-navy/55">
                  {t.intensity}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-navy/5">
                <div
                  className="h-full rounded-full bg-gradient-ai transition-all duration-1000"
                  style={{ width: `${t.intensity}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
