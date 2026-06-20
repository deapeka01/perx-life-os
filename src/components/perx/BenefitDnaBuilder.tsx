// Live Benefit DNA panel shown during employee onboarding chat.
// Traits "discover" themselves as the conversation progresses (heuristic-based:
// triggered by keyword matches in the user's messages — no extra model call).
import { useMemo } from "react";
import { AIOrb } from "@/components/perx/AIOrb";

type Trait = { id: string; trait: string; emoji: string; keywords: string[] };

const TRAITS: Trait[] = [
  { id: "explorer", trait: "Explorer", emoji: "🧭", keywords: ["travel", "explore", "adventure", "trip", "discover", "hike", "outdoor"] },
  { id: "learner", trait: "Learner", emoji: "📚", keywords: ["learn", "course", "skill", "study", "grow", "develop", "ai", "tech"] },
  { id: "leader", trait: "Leader", emoji: "🎯", keywords: ["lead", "team lead", "manage", "leadership", "mentor"] },
  { id: "wellness", trait: "Wellness Seeker", emoji: "🌿", keywords: ["wellness", "stress", "calm", "relax", "balance", "yoga", "spa", "sleep", "mental"] },
  { id: "athlete", trait: "Athlete", emoji: "🏃", keywords: ["fitness", "run", "sport", "gym", "exercise", "active", "workout"] },
  { id: "connector", trait: "Connector", emoji: "🤝", keywords: ["team", "friends", "social", "family", "people", "together", "community"] },
  { id: "creator", trait: "Creator", emoji: "🎨", keywords: ["creative", "art", "music", "design", "build", "craft"] },
  { id: "parent", trait: "Family-oriented", emoji: "👨‍👩‍👧", keywords: ["kid", "child", "family", "parent", "weekend with"] },
];

const ARCHETYPES: Record<string, { name: string; emoji: string }> = {
  explorer: { name: "The Explorer", emoji: "🧭" },
  learner: { name: "The Learner", emoji: "📚" },
  leader: { name: "The Leader", emoji: "🎯" },
  wellness: { name: "The Wellness Seeker", emoji: "🌿" },
  athlete: { name: "The Athlete", emoji: "🏃" },
  connector: { name: "The Connector", emoji: "🤝" },
  creator: { name: "The Creator", emoji: "🎨" },
  parent: { name: "The Family Anchor", emoji: "👨‍👩‍👧" },
};

export function BenefitDnaBuilder({ userText }: { userText: string }) {
  const scores = useMemo(() => {
    const txt = userText.toLowerCase();
    return TRAITS.map((t) => {
      const hits = t.keywords.reduce((n, k) => n + (txt.includes(k) ? 1 : 0), 0);
      const intensity = Math.min(100, hits * 32 + (hits > 0 ? 25 : 0));
      return { ...t, intensity };
    }).sort((a, b) => b.intensity - a.intensity);
  }, [userText]);

  const active = scores.filter((s) => s.intensity > 0).slice(0, 5);
  const top = active[0];
  const archetype = top ? ARCHETYPES[top.id] : null;

  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <AIOrb size={40} />
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
            Building your Benefit DNA
          </p>
          <p className="font-display text-base font-extrabold text-navy">
            {active.length === 0 ? "Listening…" : `${active.length} trait${active.length > 1 ? "s" : ""} forming`}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {active.length === 0 && (
          <p className="text-sm text-navy/55">
            As you chat, traits and an archetype will emerge here in real time.
          </p>
        )}
        {active.map((t) => (
          <div
            key={t.id}
            className="animate-slide-up rounded-2xl border border-white/60 bg-white/80 p-3 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-display text-sm font-extrabold text-navy">
                <span aria-hidden>{t.emoji}</span>
                {t.trait}
              </span>
              <span className="font-display text-xs font-extrabold tabular-nums text-coral">
                {t.intensity}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy/10">
              <div
                className="h-full rounded-full bg-gradient-ai transition-all duration-700"
                style={{ width: `${t.intensity}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {archetype && (
        <div className="mt-5 rounded-2xl bg-navy p-4 text-white shadow-lift">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-coral">
            Emerging archetype
          </p>
          <p className="mt-1 font-display text-xl font-extrabold">
            {archetype.emoji} {archetype.name}
          </p>
        </div>
      )}
    </div>
  );
}
