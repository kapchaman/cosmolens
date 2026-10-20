import { z } from "zod";

export const assistantRequestSchema = z.object({
  mode: z
    .enum(["explain", "deep-dive", "compare", "socratic", "research", "object-context"])
    .default("explain"),
  question: z.string().trim().min(2).max(2000),
  objectId: z.string().trim().optional(),
  comparisonObjectId: z.string().trim().optional(),
  scaleId: z.string().trim().optional(),
  educationLevel: z.string().trim().max(80).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().max(2000),
      }),
    )
    .max(8)
    .default([]),
});

export type AssistantRequestInput = z.infer<typeof assistantRequestSchema>;
