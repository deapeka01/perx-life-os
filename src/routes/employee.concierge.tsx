import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Sparkles, Send } from "lucide-react";
import { aiBundle, conciergeStarters, formatALL } from "@/lib/mock-data";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/employee/concierge")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "AI Concierge · Perx" }] }),
  component: Concierge,
});

type Msg = { role: "user" | "ai"; text: string; bundle?: typeof aiBundle };

function Concierge() {
  const { q } = Route.useSearch();
  const initial: Msg[] = q
    ? [
        { role: "user", text: q },
        {
          role: "ai",
          text: `I hear you. Based on your Benefit DNA and a free Saturday, here's a Weekend Recharge bundle that should help.`,
          bundle: aiBundle,
        },
      ]
    : [
        {
          role: "ai",
          text: `Hey Ardit 👋 I'm your Perx Concierge. Tell me how you feel, what you want to learn, or how to spend your credits — I'll handle the rest.`,
        },
      ];

  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "ai",
        text: "Here's an AI-curated package matched to your goals and budget:",
        bundle: aiBundle,
      },
    ]);
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col px-5 pb-32 pt-8 sm:px-8 md:px-10 md:pb-10 md:pt-12">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">AI Concierge</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          What's on your mind?
        </h1>
      </header>

      <div className="mt-8 flex-1 space-y-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-slide-up ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && (
              <div className="mr-3 mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-navy text-coral">
                <Sparkles className="size-4" />
              </div>
            )}
            <div className="max-w-[80%] space-y-3">
              <div
                className={`rounded-2xl px-5 py-3 text-sm font-medium shadow-soft ${
                  m.role === "user"
                    ? "bg-coral text-white"
                    : "bg-card text-navy border border-border"
                }`}
              >
                {m.text}
              </div>
              {m.bundle && (
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
                  <div className="bg-navy p-5 text-white">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky">
                      AI Bundle · {m.bundle.matchScore}% match
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-extrabold">{m.bundle.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{m.bundle.tagline}</p>
                  </div>
                  <div className="space-y-2 p-5">
                    {m.bundle.items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between rounded-xl bg-muted px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-navy">{it.name}</p>
                          <p className="text-xs text-navy/50">{it.provider}</p>
                        </div>
                        <p className="shrink-0 font-display text-sm font-extrabold text-navy">
                          {formatALL(it.priceALL)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border p-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                        Total
                      </p>
                      <p className="font-display text-xl font-extrabold text-navy">
                        {formatALL(m.bundle.totalALL)}
                      </p>
                    </div>
                    <button className="rounded-xl bg-coral px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-coral transition hover:-translate-y-0.5">
                      Request approval
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="fixed inset-x-0 bottom-20 z-30 px-4 md:static md:bottom-auto md:mt-8 md:px-0">
        <div className="mx-auto max-w-3xl md:mx-0">
          <div className="mb-3 flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
            {conciergeStarters.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="shrink-0 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-navy/60 shadow-soft hover:bg-navy hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card p-2 shadow-lift"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell Perx what you need…"
              className="flex-1 bg-transparent px-4 py-3 text-base font-medium text-navy placeholder:text-navy/40 focus:outline-none"
            />
            <button
              type="submit"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-coral text-white shadow-coral transition hover:-translate-y-0.5"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
