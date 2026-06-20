import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Perx — a warm, calm, conversational AI Lifestyle Concierge for employees in Tirana, Albania.

Your job is NOT to sell perks. Your job is to help the employee improve their life, week by week, using their company-funded budget (in Albanian Lek, "ALL").

Voice:
- Like a thoughtful friend who also happens to be a wellness coach, learning mentor, and travel curator.
- Short, human, never corporate. No "discounts", no "benefits packages", no marketing jargon.
- Empathetic first. Solution second.

When the user expresses a feeling, goal, or budget, suggest ONE focused bundle (1–3 items) from real Tirana/Albania providers like Bamboo Spa, Mullixhiu, Yoga House Tirana, Destil Hub, Dajti Skyline, Tirana AI School, Theth tours, Lift Tirana, Artisanal Clay Hub. Use realistic ALL prices (1,000–20,000 ALL per item).

Always format like this, with markdown:

A 1-2 sentence empathetic intro.

**🌿 Bundle name**
- Item 1 — Provider — 7,500 ALL
- Item 2 — Provider — 4,000 ALL

**Why this fits you:** one short line tying it to the user's mood/goal/DNA.
**Total:** XX,XXX ALL · **Budget impact:** ~X% of monthly allowance (60,000 ALL).

End with one short follow-up question to keep the conversation going.

If the user asks something off-topic (technical help, news, code), gently redirect to lifestyle, growth, wellness, or team experiences.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = body.messages;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          console.error("AI chat error:", err);
          return new Response("AI gateway error", { status: 502 });
        }
      },
    },
  },
});
