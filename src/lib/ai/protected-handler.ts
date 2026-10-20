import { AI_LIMITS } from "@/lib/ai/limits";
import { readBoundedJson, RequestError } from "@/lib/ai/body";
import { assistantRequestSchema } from "@/lib/ai/validation";
import { buildContext, buildSystemPrompt } from "@/lib/ai/prompt";
import { getObjectById, getScaleNodeById } from "@/lib/astronomy/catalog";
import type { AdmissionStore } from "@/lib/ai/rate-limit";

// This foundation is deliberately NOT wired to /api/ai. It has no live provider
// or authentication adapter. Deployment-specific verification is a separate gate.
export type ProtectedDependencies = {
  isEnabled: () => boolean;
  allowedOrigin: string;
  // Must verify a server-authenticated, enrolled account. Never trust forwarded
  // headers, body IDs, arbitrary cookies, or freely minted anonymous sessions.
  verifyIdentity: (request: Request) => Promise<string | null>;
  store: AdmissionStore;
  model: string;
  allowedModels: readonly string[];
  // Conservative full-request cost, approved for the pinned model's maximum
  // 16,000 input + 900 output tokens. No default budget or pricing assumption.
  reserveMicrousd: number;
  generate: (input: { model: string; system: string; input: string; maxOutputTokens: number; store: false; signal: AbortSignal }) => Promise<string>;
};
const reply = (status: number, error: string) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

async function bounded<T>(operation: Promise<T>, milliseconds = 2000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { return await Promise.race([operation, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Dependency timed out")), milliseconds); })]); }
  finally { clearTimeout(timer); }
}

export function createProtectedAssistant(deps: ProtectedDependencies) {
  return async (request: Request): Promise<Response> => {
    if (!deps.isEnabled() || !deps.allowedModels.includes(deps.model)
      || !Number.isSafeInteger(deps.reserveMicrousd) || deps.reserveMicrousd <= 0 || deps.reserveMicrousd > 1e9) return reply(503, "CosmoLens AI is temporarily unavailable.");
    if (request.headers.get("origin") !== deps.allowedOrigin) return reply(403, "Request origin is not allowed.");
    let leaseId: string | undefined;
    let completed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (request.signal.aborted) return reply(408, "Request was cancelled.");
      const principal = await bounded(deps.verifyIdentity(request));
      if (!principal) return reply(401, "Sign in to use the assistant.");
      const parsed = assistantRequestSchema.safeParse(await readBoundedJson(request));
      if (!parsed.success) return reply(400, "Invalid assistant request.");
      const data = parsed.data;
      if ((data.objectId && !getObjectById(data.objectId)) || (data.comparisonObjectId && !getObjectById(data.comparisonObjectId)) || (data.scaleId && !getScaleNodeById(data.scaleId))) return reply(400, "Unknown astronomy context.");
      const system = buildSystemPrompt();
      const input = JSON.stringify({ context: buildContext(data.mode, data.objectId, data.scaleId, data.comparisonObjectId), history: data.history, question: data.question, educationLevel: data.educationLevel });
      // A conservative text-only byte bound plus framing allowance. The live
      // provider must verify the tokenizer/model bound before integration.
      if (new TextEncoder().encode(system + input).byteLength + 1024 > 16000) return reply(413, "Context is too large. Start a shorter conversation.");
      const admission = await bounded(deps.store.reserve(principal, deps.reserveMicrousd));
      if (!admission.allowed) return Response.json({ error: "AI capacity is temporarily unavailable. Try later." }, { status: 429, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
      leaseId = admission.leaseId;
      if (!deps.isEnabled() || request.signal.aborted) { completed = true; return reply(503, "CosmoLens AI is temporarily unavailable."); }
      const controller = new AbortController();
      const signal = AbortSignal.any([controller.signal, request.signal]);
      const deadline = new Promise<never>((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error("Upstream timed out")); }, 20000); });
      const answer = await Promise.race([deps.generate({ model: deps.model, system, input, maxOutputTokens: AI_LIMITS.outputTokens, store: false, signal }), deadline]);
      completed = true;
      if (typeof answer !== "string" || !answer.trim() || answer.length > 16000) return reply(502, "The assistant could not provide an answer.");
      return Response.json({ answer }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      if (error instanceof RequestError) return reply(error.status, error.message);
      return reply(503, "CosmoLens AI is temporarily unavailable.");
    } finally {
      clearTimeout(timer);
      // On ambiguous upstream failure, leave the concurrency lease to expire.
      // Reservations are never refunded automatically, even if release fails.
      if (leaseId && completed) await bounded(deps.store.release(leaseId)).catch(() => {});
    }
  };
}
