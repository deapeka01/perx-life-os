import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleTopBar } from "@/components/perx/RoleTopBar";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayout,
});

function EmployeeLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas text-navy">
      <AmbientBg />
      <RoleTopBar agent="employee" />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function AmbientBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(50% 30% at 10% 0%, oklch(0.72 0.19 25 / 0.10), transparent 70%), radial-gradient(40% 25% at 90% 0%, oklch(0.72 0.15 230 / 0.10), transparent 70%)",
      }}
    />
  );
}
