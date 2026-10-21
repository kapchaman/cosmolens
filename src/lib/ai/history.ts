import type { AssistantMessage } from "@/types/ai";
import { AI_LIMITS } from "@/lib/ai/limits";

export function boundedHistory(history: AssistantMessage[]): AssistantMessage[] {
  return history.slice(-AI_LIMITS.historyMessages).map((message) => ({
    role: message.role,
    content: message.content.trim().slice(0, AI_LIMITS.historyCharacters),
  })).filter((message) => message.content.length > 0);
}
