import { z } from "zod";
import { AI_LIMITS } from "@/lib/ai/limits";

const contextId = z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/).optional();

export const assistantRequestSchema = z.object({
  mode: z
    .enum(["explain", "deep-dive", "compare", "socratic", "research", "object-context"])
    .default("explain"),
  question: z.string().trim().min(2).max(AI_LIMITS.questionCharacters),
  objectId: contextId,
  comparisonObjectId: contextId,
  scaleId: contextId,
  educationLevel: z.string().trim().max(80).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(AI_LIMITS.historyCharacters),
      }).strict(),
    )
    .max(AI_LIMITS.historyMessages)
    .default([]),
}).strict();

export type AssistantRequestInput = z.infer<typeof assistantRequestSchema>;
