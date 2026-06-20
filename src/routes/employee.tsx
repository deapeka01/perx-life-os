import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Home, Search, Compass, Trophy, User } from "lucide-react";
import { AppShell } from "@/components/perx/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayout,
});

function EmployeeLayout() {
  const { t } = useI18n();
  const nav = [
    { to: "/employee", label: t("nav.home"), icon: Home },
    { to: "/employee/concierge", label: t("nav.search"), icon: Search },
    { to: "/employee/discover", label: t("nav.discover"), icon: Compass },
    { to: "/employee/quests", label: t("nav.quests"), icon: Trophy },
    { to: "/employee/profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <AppShell nav={nav} showMobileBottomNav>
      <Outlet />
    </AppShell>
  );
}
