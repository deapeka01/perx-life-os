import type { ReactNode } from "react";
import { SideNav, MobileBottomNav, type SideNavItem } from "./SideNav";

export function AppShell({
  nav,
  showMobileBottomNav = false,
  children,
}: {
  nav: SideNavItem[];
  showMobileBottomNav?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SideNav items={nav} />
      <main className={`md:pl-20 ${showMobileBottomNav ? "pb-24 md:pb-0" : ""}`}>
        {children}
      </main>
      {showMobileBottomNav && <MobileBottomNav items={nav} />}
    </div>
  );
}
