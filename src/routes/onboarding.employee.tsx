import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { AIOrb } from "@/components/perx/AIOrb";
import { MicButton } from "@/components/perx/MicButton";
import { BenefitDnaBuilder } from "@/components/perx/BenefitDnaBuilder";
import { AGENTS } from "@/lib/agents";
import { getSession, saveOnboarding } from "@/lib/session";
import { useServerFn } from "@tanstack/react-start";
import { generateBenefitDna } from "@/lib/perx/ai.functions";


export const Route = createFileRoute("/onboarding/employee")({
  head: () => ({ meta: [{ title: "Welcome to Perx" }] }),
  component: EmployeeOnboarding,
});

const SEED = "Hi! Welcome them warmly by name if you know it, then start the conversation.";

function EmployeeOnboarding() {
  const meta = AGENTS["onboarding-employee"];
  const navigate = useNavigate();
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { agent: "onboarding-employee" } }),
    [],
  );
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  const { messages, sendMessage, status } = useChat({ transport });

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    (async () => {
      const s = await getSession();
      const seed = s?.name ? `${SEED} Their name is ${s.name}.` : SEED;
      void sendMessage({ text: seed });
    })();
  }, [sendMessage]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  const userText = useMemo(
    () =>
      messages
        .filter((m) => m.role === "user")
        .slice(1) // skip seed
        .map((m) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" "))
        .join(" "),
    [messages],
  );

  const isBusy = status === "submitted" || status === "streaming";
  const userTurns = messages.filter((m) => m.role === "user").length - 1; // exclude seed
  const ready = userTurns >= 4;

  const onSubmit = async (t: string) => {
    if (!t.trim() || isBusy) return;
    setInput("");
    await sendMessage({ text: t.trim() });
  };

  const genDna = useServerFn(generateBenefitDna);
  const finish = async () => {
    const transcript = messages.map((m) => ({
      role: m.role,
      text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join(""),
    }));
    await saveOnboarding({ transcript, capturedAt: new Date().toISOString() });
    try {
      await genDna({ data: { transcript } });
      toast.success("Your Benefit DNA is ready ✨");
    } catch (e: any) {
      toast.error(e?.message ?? "DNA generation failed — you can retry later.");
    }
    navigate({ to: "/employee" });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(50% 40% at 90% 0%, oklch(0.72 0.19 25 / 0.3), transparent 70%), radial-gradient(50% 40% at 0% 100%, oklch(0.72 0.15 230 / 0.35), transparent 60%)",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 font-display text-base font-extrabold backdrop-blur">
            P
          </span>
          <span className="font-display text-sm font-extrabold">Perx Onboarding</span>
        </Link>
        {ready && (
          <button
            onClick={finish}
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-navy shadow-lift transition hover:-translate-y-0.5"
          >
            Enter Perx <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </button>
        )}
      </header>

      <main className="relative z-10 mx-auto grid h-[calc(100dvh-72px)] max-w-7xl gap-6 px-5 pb-6 md:grid-cols-[1fr_360px] md:px-10">
        <section className="flex min-h-0 flex-col rounded-3xl border border-white/15 bg-white/95 text-navy shadow-lift">
          <div ref={scrollerRef} className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
            <div className="mx-auto max-w-2xl space-y-5">
              {messages.length <= 1 && (
                <div className="text-center">
                  <AIOrb size={88} hue={meta.hue} className="mx-auto" />
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55">
                    {meta.role}
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">
                    {meta.greeting}
                  </h1>
                </div>
              )}
              {messages
                .filter((m) => !(m.role === "user" && m.id === messages[0]?.id))
                .map((m) => (
                  <Bubble key={m.id} m={m} hue={meta.hue} />
                ))}
              {isBusy && (
                <div className="flex items-center gap-3">
                  <AIOrb size={28} hue={meta.hue} />
                  <span className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-bold text-navy/70 shadow-soft">
                    {meta.name} is thinking…
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-navy/10 px-5 py-4 md:px-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void onSubmit(input);
              }}
              className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border-2 border-navy/10 bg-white p-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or tap the mic to speak…"
                disabled={isBusy}
                className="flex-1 bg-transparent px-4 py-3 text-base font-medium text-navy placeholder:text-navy/45 focus:outline-none"
              />
              <MicButton
                disabled={isBusy}
                onTranscript={(text) => void onSubmit(text)}
                onError={(msg) => toast.error(msg)}
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                aria-label="Send"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-ai text-white ring-ai transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>

            </form>
          </div>
        </section>

        <aside className="hidden min-h-0 overflow-y-auto md:block">
          <BenefitDnaBuilder userText={userText} />
        </aside>
      </main>
    </div>
  );
}

function Bubble({ m, hue }: { m: UIMessage; hue: { from: string; via: string; to: string } }) {
  const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  if (m.role === "user") {
    return (
      <div className="flex animate-slide-up justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-base font-semibold text-white">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex animate-slide-up gap-3">
      <AIOrb size={28} hue={hue} className="mt-1 shrink-0" />
      <div className="perx-prose max-w-[85%] flex-1 rounded-2xl rounded-bl-sm border border-navy/10 bg-canvas px-4 py-3 text-[15px] leading-relaxed text-navy shadow-soft">
        <ReactMarkdown>{text || "…"}</ReactMarkdown>
      </div>
    </div>
  );
}
