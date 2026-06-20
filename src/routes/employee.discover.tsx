import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/perx/PageHeader";
import { ExperienceCard } from "@/components/perx/ExperienceCard";
import { discoverFeed } from "@/lib/mock-data";

export const Route = createFileRoute("/employee/discover")({
  head: () => ({ meta: [{ title: "Discover · Perx" }] }),
  component: Discover,
});

const filters = ["All", "Wellness", "Growth", "Adventure", "Workspace", "Travel", "Food"];

function Discover() {
  return (
    <div className="px-5 pb-10 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow="For you · 24 picks today"
        title="Discover"
        subtitle="A feed of experiences hand-picked by Perx for your DNA, goals, and budget."
      />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition ${
              i === 0
                ? "bg-navy text-white"
                : "border border-border bg-card text-navy/60 hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {discoverFeed.map((d) => (
          <ExperienceCard
            key={d.id}
            title={d.title}
            provider={d.provider}
            category={d.category}
            priceALL={d.priceALL}
            matchScore={d.matchScore}
            accent={d.accent}
          />
        ))}
      </div>
    </div>
  );
}
