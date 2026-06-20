import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Home, Sparkles, Compass, Trophy, Users, User } from "lucide-react";
import { AppShell } from "@/components/perx/AppShell";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayout,
});

const nav = [
  { to: "/employee", label: "Home", icon: Home },
  { to: "/employee/concierge", label: "AI", icon: Sparkles },
  { to: "/employee/discover", label: "Discover", icon: Compass },
  { to: "/employee/quests", label: "Quests", icon: Trophy },
  { to: "/employee/team", label: "Team", icon: Users },
  { to: "/employee/profile", label: "Profile", icon: User },
];

function EmployeeLayout() {
  return (
    <AppShell nav={nav} showMobileBottomNav>
      <Outlet />
    </AppShell>
  );
}
