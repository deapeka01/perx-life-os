import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Store, Package, Radar, Megaphone } from "lucide-react";
import { AppShell } from "@/components/perx/AppShell";

export const Route = createFileRoute("/provider")({
  component: ProviderLayout,
});

const nav = [
  { to: "/provider", label: "Studio", icon: Store },
  { to: "/provider/services", label: "Services", icon: Package },
  { to: "/provider/demand", label: "Demand", icon: Radar },
  { to: "/provider/marketing", label: "Marketing", icon: Megaphone },
];

function ProviderLayout() {
  return (
    <AppShell nav={nav} showMobileBottomNav>
      <Outlet />
    </AppShell>
  );
}
