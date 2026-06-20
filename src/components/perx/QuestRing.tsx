export function QuestRing({
  percent,
  color = "coral",
  size = 64,
}: {
  percent: number;
  color?: "coral" | "sky" | "emerald";
  size?: number;
}) {
  const stroke = {
    coral: "stroke-coral",
    sky: "stroke-sky",
    emerald: "stroke-emerald",
  }[color];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="size-full -rotate-90">
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-navy/5" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className={`${stroke} transition-all duration-1000`}
          strokeWidth="4"
          strokeDasharray={`${percent} 100`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-xs font-extrabold text-navy">
        {percent}%
      </div>
    </div>
  );
}
