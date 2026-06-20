import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { conciergeStarters, currentEmployee } from "@/lib/mock-data";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/employee/concierge")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "AI Concierge · Perx" }] }),
  component: Concierge,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

function Concierge() {
  const { q } = Route.useSearch();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => console.error("Concierge chat error:", e),
  });

  useEffect(() => {
    if (seededRef.current) return;
    if (q && q.trim()) {
      seededRef.current = true;
      void sendMessage({ text: q.trim() });
    }
  }, [q, sendMessage]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  const isBusy = status === "submitted" || status === "streaming";

  const onSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  };

  const hasUserMessages = useMemo(
    () => messages.some((m) => m.role === "user"),
    [messages],
  );

  return (
    <div className="flex h-[calc(100dvh-5rem)] flex-col md:h-[100dvh]">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-canvas/95 px-5 py-3 backdrop-blur md:px-10">
        <Link
          to="/employee"
          aria-label="Back"
          className="grid size-10 place-items-center rounded-full border-2 border-border bg-card text-navy shadow-soft transition hover:border-coral"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-navy/55">
              Perx AI · Lifestyle Concierge
            </p>
            <p className="truncate font-display text-base font-extrabold text-navy">
              Talking with {currentEmployee.firstName}
            </p>
          </div>
        </div>
        <span aria-hidden className="grid size-10 place-items-center opacity-0">·</span>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-6 md:px-10">
        <div className="mx-auto max-w-2xl space-y-5">
          {!hasUserMessages && messages.length === 0 && (
            <div className="animate-slide-up rounded-3xl border-2 border-border bg-card p-6 shadow-soft">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
                <Sparkles className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">
                Hey {currentEmployee.firstName} 👋
              </h2>
              <p className="mt-1 text-base font-medium text-navy/75">
                Tell me how you feel, what you want to learn, or how to spend your credits.
                I'll plan it.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {conciergeStarters.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSubmit(s)}
                    className="rounded-full border-2 border-border bg-canvas px-3.5 py-1.5 text-sm font-bold text-navy transition hover:border-coral hover:bg-coral hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {isBusy && (
            <div className="flex items-center gap-3 px-1">
              <span className="grid size-8 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
                <Sparkles className="size-4" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-sm font-bold text-navy/70 shadow-soft">
                <Dot /> <Dot delay={120} /> <Dot delay={240} />
                <span className="ml-1">Perx is thinking…</span>
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive">
              Something went wrong reaching the AI. Try again in a moment.
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-canvas px-5 pb-6 pt-3 md:px-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(input);
          }}
          className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border-2 border-border bg-card p-2 shadow-lift"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Perx what you need…"
            aria-label="Message Perx"
            disabled={isBusy}
            className="flex-1 bg-transparent px-4 py-3 text-base font-medium text-navy placeholder:text-navy/45 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            aria-label="Send"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-ai text-white ring-ai transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] font-bold uppercase tracking-wider text-navy/40">
          Powered by Lovable AI · suggestions are illustrative
        </p>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="block size-1.5 animate-pulse-dot rounded-full bg-coral"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex animate-slide-up justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-coral px-4 py-3 text-base font-semibold text-white shadow-coral">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-slide-up gap-3">
      <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-ai text-white ring-ai">
        <Sparkles className="size-4" aria-hidden />
      </span>
      <div className="perx-prose max-w-[85%] flex-1 rounded-2xl rounded-bl-sm border-2 border-border bg-card px-5 py-4 text-[15px] leading-relaxed text-navy shadow-soft">
        <ReactMarkdown>{text || "…"}</ReactMarkdown>
      </div>
    </div>
  );
}
