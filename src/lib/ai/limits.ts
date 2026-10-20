// Shared client/server bounds. Character caps also bound serialized history.
export const AI_LIMITS = {
  questionCharacters: 2000,
  historyMessages: 6,
  historyCharacters: 2000,
  bodyBytes: 65536,
  outputTokens: 900,
} as const;
