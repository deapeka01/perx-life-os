// Reusable conversational shell used by every Perx agent surface.
// Streams from /api/chat with the chosen `agent` persona.
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AGENTS, type AgentId } from "@/lib/agents";
import { AIOrb } from "@/components/perx/AIOrb";
import { MicButton } from "@/components/perx/MicButton";
import { toast } from "sonner";


type Props = {
  agent: AgentId;
  initialQ?: string;
  /** Override the default greeting in the empty state. */
  greeting?: string;
  /** Override starter prompts shown in the empty state. */
  starters?: string[];
  /** Optional right-rail slot (KPIs, demand feed, DNA, etc.). */
  rightRail?: ReactNode;
  /** Compact = embedded card layout. Default = full-bleed surface. */
  variant?: "full" | "card";
};

export function AgentChat({
  agent,
  initialQ,
  greeting,
  starters,
  rightRail,
  variant = "full",
}: Props) {
  const meta = AGENTS[agent];
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { agent } }),
    [agent],
  );
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onError: (e) => console.error(`[${agent}] chat error:`, e),
  });

  useEffect(() => {
    if (seededRef.current || !initialQ?.trim()) return;
    seededRef.current = true;
    void sendMessage({ text: initialQ.trim() });
  }, [initialQ, sendMessage]);

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
  const hasMsgs = messages.length > 0;

  const onSubmit = async (text: string) => {
    const t = text.trim();
    if (!t || isBusy) return;
    setInput("");
    await sendMessage({ text: t });
  };

  const usedStarters = starters ?? meta.starters;
  const usedGreeting = greeting ?? meta.greeting;

  const shell =
    variant === "card"
      ? "rounded-3xl border border-white/40 bg-white/70 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl"
      : "";

  return (
    <div className={`grid h-full gap-6 ${rightRail ? "lg:grid-cols-[1fr_360px]" : ""}`}>
      <div className={`flex h-full min-h-0 flex-col ${shell}`}>
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-5">
            {!hasMsgs && (
              <div className="animate-slide-up text-center">
                <AIOrb size={104} hue={meta.hue} className="mx-auto" />
                <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
                  {meta.role}
                </p>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy text-balance sm:text-4xl">
                  {usedGreeting}
                </h1>
                {usedStarters.length > 0 && (
                  <>
                    <p className="mt-3 text-sm font-semibold text-navy/60">
                      Try one of these — or just type what's on your mind.
                    </p>
                    <div className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">
                      {usedStarters.map((s) => (
                        <button
                          key={s}
                          onClick={() => onSubmit(s)}
                          className="group flex items-center gap-3 rounded-2xl border border-white/50 bg-white/60 px-4 py-3 text-left text-sm font-semibold text-navy shadow-[0_8px_24px_-16px_rgba(15,23,42,0.3)] backdrop-blur transition hover:-translate-y-0.5 hover:border-coral/50 hover:bg-white/90"
                        >
                          <Sparkles
                            className="size-4 shrink-0 text-coral opacity-70 transition group-hover:opacity-100"
                            aria-hidden
                          />
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {messages.map((m) => (
              <Bubble key={m.id} m={m} hue={meta.hue} />
            ))}

            {isBusy && (
              <div className="flex items-center gap-3 px-1">
                <AIOrb size={36} hue={meta.hue} />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2 text-sm font-bold text-navy/70 shadow-soft backdrop-blur">
                  <Dot /> <Dot delay={120} /> <Dot delay={240} />
                  <span className="ml-1">{meta.name} is thinking…</span>
                </span>
              </div>
            )}
            {error && (
              <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive">
                Something went wrong reaching the AI. Try again.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/40 bg-white/40 px-5 pb-6 pt-3 backdrop-blur md:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit(input);
            }}
            className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-white/60 bg-white/85 p-2 shadow-lift"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${meta.name}…`}
              aria-label={`Message ${meta.name}`}
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
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] font-bold uppercase tracking-wider text-navy/40">
            Powered by Perx AI · responses are illustrative
          </p>
        </div>
      </div>

      {rightRail && (
        <aside className="hidden h-full min-h-0 overflow-y-auto pr-1 lg:block">
          {rightRail}
        </aside>
      )}
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

function Bubble({ m, hue }: { m: UIMessage; hue: { from: string; via: string; to: string } }) {
  const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  if (m.role === "user") {
    return (
      <div className="flex animate-slide-up justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-base font-semibold text-white shadow-lift">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex animate-slide-up gap-3">
      <AIOrb size={32} hue={hue} className="mt-1 shrink-0" />
      <div className="perx-prose max-w-[85%] flex-1 rounded-2xl rounded-bl-sm border border-white/60 bg-white/85 px-5 py-4 text-[15px] leading-relaxed text-navy shadow-soft backdrop-blur">
        <ReactMarkdown>{text || "…"}</ReactMarkdown>
      </div>
    </div>
  );
}
