// Microphone capture + transcription button for AgentChat.
// Records via MediaRecorder, posts to /api/transcribe, returns text.
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

type Props = {
  disabled?: boolean;
  onTranscript: (text: string) => void;
  onError?: (msg: string) => void;
};

export function MicButton({ disabled, onTranscript, onError }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "transcribing">("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = ["audio/webm", "audio/mp4"].find((t) =>
        typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t),
      );
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        if (blob.size < 1024) {
          setState("idle");
          onError?.("That recording was too short — please try again.");
          return;
        }
        setState("transcribing");
        try {
          const form = new FormData();
          form.append("file", blob, `recording.${(recorder.mimeType.split("/")[1] ?? "webm").split(";")[0]}`);
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data?.error || `Transcription failed (${res.status})`);
          }
          const text = (data.text ?? "").trim();
          if (!text) {
            onError?.("Couldn't hear anything — please try again.");
          } else {
            onTranscript(text);
          }
        } catch (err) {
          onError?.(err instanceof Error ? err.message : "Transcription failed.");
        } finally {
          setState("idle");
        }
      };
      recorder.start();
      recorderRef.current = recorder;
      setState("recording");
    } catch {
      onError?.("Microphone access is needed for voice input.");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
  };

  const click = () => {
    if (state === "idle") void start();
    else if (state === "recording") stop();
  };

  const isRecording = state === "recording";
  const isBusy = state === "transcribing";

  return (
    <button
      type="button"
      onClick={click}
      disabled={disabled || isBusy}
      aria-label={isRecording ? "Stop recording" : "Start voice input"}
      title={isRecording ? "Stop recording" : "Speak to the agent"}
      className={`grid size-11 shrink-0 place-items-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isRecording
          ? "animate-pulse border-coral/60 bg-coral text-white shadow-[0_0_0_4px_rgba(255,107,107,0.18)]"
          : "border-white/60 bg-white/85 text-navy hover:-translate-y-0.5 hover:border-coral/40"
      }`}
    >
      {isBusy ? <Loader2 className="size-4 animate-spin" /> : isRecording ? <Square className="size-4" /> : <Mic className="size-4" />}
    </button>
  );
}
