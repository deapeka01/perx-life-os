// Speech-to-text proxy. Client posts an audio blob; we forward to Lovable AI
// and return the transcript JSON. Keeps the API key server-side.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const form = await request.formData();
        const audio = form.get("file");
        if (!(audio instanceof Blob)) {
          return new Response("Missing audio file", { status: 400 });
        }
        if (audio.size < 1024) {
          return new Response(
            JSON.stringify({ error: "Recording was empty — please try again." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const mime = (audio.type || "").split(";")[0];
        const ext =
          mime === "audio/mp4" ? "mp4" :
          mime === "audio/mpeg" ? "mp3" :
          mime === "audio/wav" ? "wav" :
          mime === "audio/ogg" ? "ogg" :
          "webm";

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", audio, `recording.${ext}`);

        const res = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: upstream,
          },
        );

        const body = await res.text();
        return new Response(body, {
          status: res.status,
          headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
        });
      },
    },
  },
});
