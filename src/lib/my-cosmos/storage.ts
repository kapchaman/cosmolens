import { z } from "zod";
import type { CosmosNote, SavedCosmosObject } from "@/types/my-cosmos";

export const savedObjectsKey = "cosmolens:saved-objects";
export const cosmosNotesKey = "cosmolens:notes";
export const cosmosStorageEvent = "cosmolens:storage-change";

const savedObjectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(300),
  category: z.enum(["planet", "moon", "star", "galaxy", "nebula", "black-hole", "cluster", "concept"]),
  summary: z.string().max(10000),
  savedAt: z.string().datetime(),
});
const noteSchema = z.object({
  id: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
  createdAt: z.string().datetime(),
});

// localStorage is untrusted input, including syntactically valid JSON.
// Recover valid entries individually without overwriting the original records.
function readRecords<T extends { id: string }>(key: string, schema: z.ZodType<T>): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || "null");
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.flatMap((entry) => {
      const result = schema.safeParse(entry);
      if (!result.success || seen.has(result.data.id)) return [];
      seen.add(result.data.id);
      return [result.data];
    });
  } catch {
    return [];
  }
}

function writeJson(key: string, value: unknown) {
  // Keep the exception observable: callers commit UI state only after success.
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(cosmosStorageEvent));
}

export function readSavedObjects(): SavedCosmosObject[] {
  return readRecords(savedObjectsKey, savedObjectSchema);
}
export function writeSavedObjects(objects: SavedCosmosObject[]) {
  writeJson(savedObjectsKey, z.array(savedObjectSchema).parse(objects));
}
export function readCosmosNotes(): CosmosNote[] {
  return readRecords(cosmosNotesKey, noteSchema);
}
export function writeCosmosNotes(notes: CosmosNote[]) {
  writeJson(cosmosNotesKey, z.array(noteSchema).parse(notes));
}
