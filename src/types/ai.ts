export type AssistantMode =
  | "explain"
  | "deep-dive"
  | "compare"
  | "socratic"
  | "research"
  | "object-context";

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};
