import { getObjectById, getScaleNodeById, getSourcesForObject } from "@/lib/astronomy/catalog";
import type { AstronomicalObject } from "@/types/astronomy";
import type { AssistantMode } from "@/types/ai";

const modeInstructions: Record<AssistantMode, string> = {
  explain: "Explain clearly for an intelligent non-specialist. Use plain language without oversimplifying the science.",
  "deep-dive": "Give a technically deeper explanation. Define specialist terms and identify the observational basis.",
  compare: "Compare the relevant objects or concepts directly. Use a concise table only when it clarifies the comparison.",
  socratic: "Guide the user through reasoning with short questions before giving the final explanation.",
  research: "Help interpret the scientific context, sources, uncertainty, and what kind of evidence would be needed next.",
  "object-context": "Answer using the currently selected object as primary context. Resolve pronouns such as it, this object, or here.",
};

export function buildSystemPrompt() {
  return [
    "You are CosmoLens AI, a careful astronomy assistant embedded in an interactive scientific atlas.",
    "Prioritize scientific integrity over sounding impressive.",
    "Distinguish established observations, estimates, models, hypotheses, and speculation.",
    "If the curated context is insufficient, say what is missing instead of inventing data.",
    "Avoid sensational claims. Dark matter, dark energy, inflation, and speculative cosmology require uncertainty labels.",
    "When possible, mention which supplied source records support the answer.",
    "Keep answers concise unless the user asks for a deep explanation.",
  ].join("\n");
}

function serializeObjectContext(object: AstronomicalObject) {
  const sources = object ? getSourcesForObject(object) : [];

  return {
    id: object.id,
    name: object.name,
    aliases: object.aliases,
    category: object.category,
    summary: object.summary,
    description: object.description,
    scientificSignificance: object.scientificSignificance,
    measurements: object.measurements,
    relationships: object.relationships,
    sources: sources.map((source) => ({
      id: source.id,
      title: source.title,
      organization: source.organization,
      url: source.url,
    })),
  };
}

export function buildContext(mode: AssistantMode, objectId?: string, scaleId?: string, comparisonObjectId?: string) {
  const object = objectId ? getObjectById(objectId) : undefined;
  const comparisonObject = comparisonObjectId ? getObjectById(comparisonObjectId) : undefined;
  const scale = scaleId ? getScaleNodeById(scaleId) : undefined;

  return {
    modeInstruction: modeInstructions[mode],
    objectContext: object ? serializeObjectContext(object) : null,
    comparisonObjectContext: comparisonObject ? serializeObjectContext(comparisonObject) : null,
    scaleContext: scale
      ? {
          id: scale.id,
          title: scale.title,
          subtitle: scale.subtitle,
          context: scale.context,
          measurements: scale.measurements,
        }
      : null,
  };
}
