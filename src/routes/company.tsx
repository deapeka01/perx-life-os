import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, CheckSquare, Users, BarChart3 } from "lucide-react";
import { AppShell } from "@/components/perx/AppShell";

export const Route = createFileRoute("/company")({
  component: CompanyLayout,
});

const nav = [
  { to: "/company", label: "Overview", icon: LayoutDashboard },
  { to: "/company/approvals", label: "Approvals", icon: CheckSquare },
  { to: "/company/employees", label: "People", icon: Users },
  { to: "/company/analytics", label: "Insights", icon: BarChart3 },
];

function CompanyLayout() {
  return (
    <AppShell nav={nav} showMobileBottomNav>
      <Outlet />
    </AppShell>
  );
}
