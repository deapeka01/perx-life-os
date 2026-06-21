import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { listMyNotifications, markAllNotificationsRead } from "@/lib/perx/sim.functions";

type Notif = { id: string; kind: string; title: string; body: string | null; read: boolean; created_at: string };

export function NotificationsBell() {
  const list = useServerFn(listMyNotifications);
  const markAll = useServerFn(markAllNotificationsRead);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Notif[]>([]);

  const load = () => {
    list().then((r) => setRows(r as Notif[])).catch(() => {});
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unread = rows.filter((r) => !r.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) {
            markAll().then(() => setRows((r) => r.map((x) => ({ ...x, read: true }))));
          }
        }}
        className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-white text-navy shadow-soft transition hover:border-coral hover:text-coral"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] font-extrabold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-display text-sm font-extrabold text-navy">Notifications</p>
            <button onClick={() => setRows([])} className="text-[10px] font-extrabold uppercase tracking-widest text-navy/40 hover:text-coral">
              Clear
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {rows.length === 0 && (
              <div className="grid place-items-center gap-2 px-4 py-10 text-center text-sm text-navy/50">
                <Check className="size-5 text-emerald" /> You're all caught up.
              </div>
            )}
            {rows.map((n) => (
              <div key={n.id} className={`border-b border-border/50 px-4 py-3 text-sm ${n.read ? "" : "bg-coral/5"}`}>
                <p className="font-extrabold text-navy">{n.title}</p>
                {n.body && <p className="mt-0.5 text-navy/70">{n.body}</p>}
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
