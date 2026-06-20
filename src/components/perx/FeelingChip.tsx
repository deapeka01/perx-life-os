import { Link } from "@tanstack/react-router";

export function FeelingChip({
  emoji,
  label,
  prompt,
}: {
  emoji: string;
  label: string;
  prompt: string;
}) {
  return (
    <Link
      to="/employee/concierge"
      search={{ q: prompt }}
      className="group flex h-14 shrink-0 items-center gap-3 rounded-full border-2 border-border bg-card pl-4 pr-5 shadow-soft transition hover:-translate-y-0.5 hover:border-coral hover:bg-coral hover:text-white hover:shadow-coral"
    >
      <span className="text-2xl leading-none transition group-hover:scale-110">{emoji}</span>
      <span className="font-display text-base font-extrabold tracking-tight text-navy group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}
