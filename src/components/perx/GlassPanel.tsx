import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "aside" | "article";
}) {
  return (
    <Tag
      className={`rounded-3xl border border-white/30 bg-white/60 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl ${className}`}
    >
      {children}
    </Tag>
  );
}
