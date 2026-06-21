import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/perx/PageHeader";
import { Sparkles, Send, Loader2, Heart, MapPin, Tag, X } from "lucide-react";
import { listActiveOffers, claimOffer, getMyWallet, toggleOfferLike } from "@/lib/perx/sim.functions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/discover")({
  head: () => ({ meta: [{ title: "Discover · Perx" }] }),
  component: Discover,
});

const fmt = (n: number) => `${n.toLocaleString()} ALL`;
const CATS = ["All", "Wellness", "Learning", "Adventure", "Dining", "Travel", "Workspace", "Workshop", "Lifestyle"];

function Discover() {
  const listFn = useServerFn(listActiveOffers);
  const claimFn = useServerFn(claimOffer);
  const walletFn = useServerFn(getMyWallet);
  const likeFn = useServerFn(toggleOfferLike);
  const [rows, setRows] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [cat, setCat] = useState("All");
  const [pending, setPending] = useState<string | null>(null);
  const [open, setOpen] = useState<any>(null);

  useEffect(() => {
    listFn().then((r) => setRows(r as any[])).catch(() => {});
    walletFn().then((w) => setWallet(w)).catch(() => {});
  }, [listFn, walletFn]);

  // Sort by likes desc to rank "best" offers
  const sorted = [...rows].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0));
  const filtered = cat === "All" ? sorted : sorted.filter((o) => o.category === cat);

  const updateRow = (id: string, patch: any) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const claim = async (o: any) => {
    setPending(o.id);
    try {
      const res = await claimFn({ data: {
        offer_id: o.id, provider_id: o.provider_id,
        title: o.title, amount_all: o.price_all,
      }}) as any;
      setWallet((w: any) => w ? { ...w, balance_all: res.new_balance } : w);
      toast.success(`Claimed! New balance: ${res.new_balance.toLocaleString()} ALL`);
      setOpen(null);
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setPending(null); }
  };

  const like = async (o: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // optimistic
    updateRow(o.id, { liked_by_me: !o.liked_by_me, like_count: (o.like_count ?? 0) + (o.liked_by_me ? -1 : 1) });
    if (open?.id === o.id) setOpen({ ...o, liked_by_me: !o.liked_by_me, like_count: (o.like_count ?? 0) + (o.liked_by_me ? -1 : 1) });
    try {
      const r = await likeFn({ data: { offer_id: o.id }}) as any;
      updateRow(o.id, { liked_by_me: r.liked, like_count: r.count });
      if (open?.id === o.id) setOpen((curr: any) => curr ? { ...curr, liked_by_me: r.liked, like_count: r.count } : curr);
    } catch (e: any) {
      toast.error("Couldn't update like");
      updateRow(o.id, { liked_by_me: o.liked_by_me, like_count: o.like_count });
    }
  };

  return (
    <div className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${filtered.length} picks${cat !== "All" ? ` · ${cat}` : ""}${wallet ? ` · Wallet ${wallet.balance_all.toLocaleString()} ALL` : ""}`}
        title="Discover"
        subtitle="Ranked by community love. Tap any perk for the full story, or claim instantly from your wallet."
      />

      <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-10 md:flex-wrap md:px-10">
        {CATS.map((f) => (
          <button key={f} onClick={() => setCat(f)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold transition ${
              cat === f ? "bg-navy text-white" : "border-2 border-border bg-card text-navy/70 hover:border-navy/20"
            }`}>{f}</button>
        ))}
      </div>

      <section className="mt-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o, idx) => (
            <article key={o.id}
              onClick={() => setOpen(o)}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-navy/15 hover:shadow-lift">
              <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-coral/20 via-sky/10 to-emerald/10">
                {o.image_url ? (
                  <img src={o.image_url} alt={o.title} className="absolute inset-0 size-full object-cover transition group-hover:scale-105" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-5xl font-display font-extrabold text-navy/30">
                    {o.providers?.name?.[0] ?? "P"}
                  </span>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-extrabold text-white">
                  <Sparkles className="size-3 text-coral" /> {o.category}
                </span>
                {idx < 3 && (o.like_count ?? 0) > 0 && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-coral px-2.5 py-1 text-xs font-extrabold text-white shadow-coral">
                    #{idx + 1} loved
                  </span>
                )}
                <button onClick={(e) => like(o, e)}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold text-navy shadow-soft backdrop-blur transition hover:scale-105">
                  <Heart className={`size-3.5 ${o.liked_by_me ? "fill-coral text-coral" : "text-navy/60"}`} />
                  {o.like_count ?? 0}
                </button>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy/55">
                  {o.providers?.name ?? "Provider"} · {o.kind}
                </p>
                <h3 className="mt-1 line-clamp-2 font-display text-lg font-extrabold leading-snug text-navy">{o.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-navy/65">{o.description ?? ""}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <p className="font-display text-base font-extrabold text-navy">{fmt(o.price_all)}</p>
                  <button onClick={(e) => { e.stopPropagation(); claim(o); }} disabled={pending === o.id || (wallet && wallet.balance_all < o.price_all)}
                    className="inline-flex items-center gap-1 rounded-xl bg-coral px-3 py-2 text-xs font-extrabold text-white shadow-coral transition hover:brightness-110 disabled:opacity-50">
                    {pending === o.id ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                    {wallet && wallet.balance_all < o.price_all ? "Low balance" : "Claim"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="mt-10 text-center text-sm text-navy/50">No offers in this category.</p>}
      </section>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {open && (
            <div className="flex max-h-[90vh] flex-col overflow-y-auto">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-coral/20 via-sky/10 to-emerald/10">
                {open.image_url ? (
                  <img src={open.image_url} alt={open.title} className="absolute inset-0 size-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-7xl font-display font-extrabold text-navy/30">
                    {open.providers?.name?.[0] ?? "P"}
                  </span>
                )}
                <button onClick={() => setOpen(null)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 text-navy shadow-soft backdrop-blur hover:scale-105">
                  <X className="size-4" />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-xs font-extrabold text-white">
                    <Sparkles className="size-3 text-coral" /> {open.category}
                  </span>
                  <button onClick={() => like(open)}
                    className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-navy shadow-soft backdrop-blur transition hover:scale-105">
                    <Heart className={`size-3.5 ${open.liked_by_me ? "fill-coral text-coral" : "text-navy/60"}`} />
                    {open.like_count ?? 0} likes
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/55">
                    {open.providers?.name ?? "Provider"} · {open.kind}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-navy">{open.title}</h2>
                  {open.providers?.city && (
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-navy/60">
                      <MapPin className="size-3.5" /> {open.providers.city}
                    </p>
                  )}
                </div>

                {open.description && (
                  <p className="text-sm leading-relaxed text-navy/75">{open.description}</p>
                )}

                {open.providers?.description && (
                  <div className="rounded-2xl border-2 border-border bg-card/40 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy/55">About {open.providers.name}</p>
                    <p className="mt-1 text-sm text-navy/75">{open.providers.description}</p>
                  </div>
                )}

                {Array.isArray(open.tags) && open.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {open.tags.map((t: string) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-2.5 py-1 text-xs font-bold text-navy/70">
                        <Tag className="size-3" /> {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border-2 border-border bg-card p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy/55">Bookings</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-navy">{open.bookings ?? 0}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-border bg-card p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy/55">Likes</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-navy">{open.like_count ?? 0}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-border bg-card p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy/55">Price</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-navy">{fmt(open.price_all)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-navy/55">
                    {wallet ? `Wallet: ${wallet.balance_all.toLocaleString()} ALL` : ""}
                  </p>
                  <button onClick={() => claim(open)} disabled={pending === open.id || (wallet && wallet.balance_all < open.price_all)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-coral px-5 py-2.5 text-sm font-extrabold text-white shadow-coral transition hover:brightness-110 disabled:opacity-50">
                    {pending === open.id ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {wallet && wallet.balance_all < open.price_all ? "Insufficient balance" : `Claim for ${fmt(open.price_all)}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
