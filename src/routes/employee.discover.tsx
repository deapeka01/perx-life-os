import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/perx/PageHeader";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { listActiveOffers, claimOffer, getMyWallet } from "@/lib/perx/sim.functions";
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
  const [rows, setRows] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [cat, setCat] = useState("All");
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    listFn().then((r) => setRows(r as any[])).catch(() => {});
    walletFn().then((w) => setWallet(w)).catch(() => {});
  }, [listFn, walletFn]);

  const filtered = cat === "All" ? rows : rows.filter((o) => o.category === cat);

  const claim = async (o: any) => {
    setPending(o.id);
    try {
      const res = await claimFn({ data: {
        offer_id: o.id, provider_id: o.provider_id,
        title: o.title, amount_all: o.price_all,
      }}) as any;
      setWallet((w: any) => w ? { ...w, balance_all: res.new_balance } : w);
      toast.success(`Claimed! New balance: ${res.new_balance.toLocaleString()} ALL`);
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setPending(null); }
  };

  return (
    <div className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-12">
      <PageHeader
        eyebrow={`${filtered.length} picks${cat !== "All" ? ` · ${cat}` : ""}${wallet ? ` · Wallet ${wallet.balance_all.toLocaleString()} ALL` : ""}`}
        title="Discover"
        subtitle="Tap Claim to spend directly from your wallet. Funds transfer to the provider instantly."
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
          {filtered.map((o) => (
            <article key={o.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-navy/15 hover:shadow-lift">
              <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-coral/20 via-sky/10 to-emerald/10">
                {o.image_url ? (
                  <img src={o.image_url} alt={o.title} className="absolute inset-0 size-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-5xl font-display font-extrabold text-navy/30">
                    {o.providers?.name?.[0] ?? "P"}
                  </span>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-extrabold text-white">
                  <Sparkles className="size-3 text-coral" /> {o.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy/55">
                  {o.providers?.name ?? "Provider"} · {o.kind}
                </p>
                <h3 className="mt-1 line-clamp-2 font-display text-lg font-extrabold leading-snug text-navy">{o.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-navy/65">{o.description ?? ""}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <p className="font-display text-base font-extrabold text-navy">{fmt(o.price_all)}</p>
                  <button onClick={() => claim(o)} disabled={pending === o.id || (wallet && wallet.balance_all < o.price_all)}
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
    </div>
  );
}
