"use client";

import { FormEvent, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import type { AssistantMode, AssistantMessage } from "@/types/ai";

const modes: Array<{ id: AssistantMode; label: string }> = [
  { id: "object-context", label: "This object" },
  { id: "explain", label: "Explain" },
  { id: "deep-dive", label: "Deep dive" },
  { id: "socratic", label: "Socratic" },
  { id: "research", label: "Research" },
];

export function AssistantPanel({
  objectId,
  comparisonObjectId,
  scaleId,
  suggestedQuestion,
  initialMode,
}: {
  objectId?: string;
  comparisonObjectId?: string;
  scaleId?: string;
  suggestedQuestion?: string;
  initialMode?: AssistantMode;
}) {
  const [mode, setMode] = useState<AssistantMode>(initialMode || (objectId ? "object-context" : "explain"));
  const [question, setQuestion] = useState(suggestedQuestion || "");
  const [history, setHistory] = useState<AssistantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setQuestion("");

    const nextHistory: AssistantMessage[] = [...history, { role: "user", content: trimmed }];
    setHistory(nextHistory);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          question: trimmed,
          objectId,
          comparisonObjectId,
          scaleId,
          history: history.slice(-6),
        }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "CosmoLens AI could not respond.");
      }

      setHistory([...nextHistory, { role: "assistant", content: data.answer || "" }]);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "CosmoLens AI could not respond.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot aria-hidden="true" size={18} color="var(--accent)" />
            <h2 className="text-xl font-semibold">CosmoLens AI</h2>
          </div>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Context-aware astronomy help with uncertainty labels and source-aware behavior.
          </p>
        </div>
        <Sparkles aria-hidden="true" size={18} color="var(--muted)" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2" aria-label="AI modes">
        {modes.map((item) => (
          <button
            key={item.id}
            className={`button min-h-9 px-3 text-sm ${mode === item.id ? "button-primary" : "button-ghost"}`}
            type="button"
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-4 max-h-72 overflow-y-auto rounded-md border border-[color:var(--border)] bg-black/20 p-3">
        {history.length === 0 ? (
          <div className="text-sm text-[color:var(--muted)]">
            Ask about motion, scale, evidence, uncertainty, or relationships.
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-md border p-3 text-sm ${
                  message.role === "assistant"
                    ? "border-[rgba(121,200,214,0.24)] bg-[rgba(121,200,214,0.06)]"
                    : "border-[color:var(--border)] bg-white/[0.03]"
                }`}
              >
                <div className="tiny-label mb-1">{message.role === "assistant" ? "CosmoLens AI" : "You"}</div>
                <p className="whitespace-pre-wrap text-[color:var(--foreground)]">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <div className="mb-3 rounded-md border border-[rgba(216,118,102,0.34)] bg-[rgba(216,118,102,0.08)] p-3 text-sm text-[color:var(--red)]">{error}</div> : null}

      <form onSubmit={submit} className="flex gap-2">
        <label className="sr-only" htmlFor="ai-question">
          Ask CosmoLens AI
        </label>
        <input
          id="ai-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-11 flex-1 rounded-md border border-[color:var(--border)] bg-black/20 px-3 outline-none placeholder:text-[color:var(--muted-strong)]"
          placeholder="Why is it moving toward us?"
        />
        <button className="button button-primary min-h-11 px-4" type="submit" disabled={loading}>
          <Send aria-hidden="true" size={16} />
          <span className="hidden sm:inline">{loading ? "Thinking" : "Ask"}</span>
        </button>
      </form>
    </div>
  );
}
