import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleTopBar } from "@/components/perx/RoleTopBar";

export const Route = createFileRoute("/company")({
  component: CompanyLayout,
});

function CompanyLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas text-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 30% at 90% 0%, oklch(0.62 0.18 240 / 0.10), transparent 70%), radial-gradient(40% 25% at 10% 0%, oklch(0.5 0.16 260 / 0.08), transparent 70%)",
        }}
      />
      <RoleTopBar agent="company" />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
