import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { AGENT_SYSTEM_PROMPTS, type AgentId } from "@/lib/agents";

type ChatRequestBody = { messages?: unknown; agent?: unknown };

const VALID_AGENTS = new Set<AgentId>([
  "employee",
  "company",
  "provider",
  "onboarding-employee",
  "onboarding-company",
  "onboarding-provider",
]);

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
        const agent: AgentId =
          typeof body.agent === "string" && VALID_AGENTS.has(body.agent as AgentId)
            ? (body.agent as AgentId)
            : "employee";

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const result = streamText({
            model,
            system: AGENT_SYSTEM_PROMPTS[agent],
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
