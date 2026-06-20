import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleTopBar } from "@/components/perx/RoleTopBar";

export const Route = createFileRoute("/provider")({
  component: ProviderLayout,
});

function ProviderLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas text-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 30% at 90% 0%, oklch(0.7 0.16 160 / 0.10), transparent 70%), radial-gradient(40% 25% at 10% 0%, oklch(0.66 0.21 15 / 0.10), transparent 70%)",
        }}
      />
      <RoleTopBar agent="provider" />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
