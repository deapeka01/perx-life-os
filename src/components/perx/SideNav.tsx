import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export type SideNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export function SideNav({ items, brand = "P" }: { items: SideNavItem[]; brand?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center gap-8 border-r border-border bg-card py-8 md:flex">
      <Link
        to="/"
        className="flex size-11 items-center justify-center rounded-2xl bg-coral font-display text-xl font-bold text-white shadow-coral transition hover:scale-105"
        aria-label="Perx home"
      >
        {brand}
      </Link>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative flex size-11 items-center justify-center rounded-2xl transition ${
                active ? "bg-navy text-white" : "bg-muted text-navy/60 hover:bg-navy/10"
              }`}
              aria-label={item.label}
            >
              <Icon className="size-5" strokeWidth={2.2} />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-soft transition group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileBottomNav({ items }: { items: SideNavItem[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-card/95 backdrop-blur-lg md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 pb-2 pt-1.5">
        {items.slice(0, 5).map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-xs font-bold transition ${
                  active ? "bg-coral/10 text-coral" : "text-navy/70 hover:bg-muted"
                }`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-6" strokeWidth={active ? 2.6 : 2.2} aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
