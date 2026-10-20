import type { CosmosNote, SavedCosmosObject } from "@/types/my-cosmos";

export const savedObjectsKey = "cosmolens:saved-objects";
export const cosmosNotesKey = "cosmolens:notes";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readSavedObjects() {
  return readJson<SavedCosmosObject[]>(savedObjectsKey, []);
}

export function writeSavedObjects(objects: SavedCosmosObject[]) {
  writeJson(savedObjectsKey, objects);
}

export function readCosmosNotes() {
  return readJson<CosmosNote[]>(cosmosNotesKey, []);
}

export function writeCosmosNotes(notes: CosmosNote[]) {
  writeJson(cosmosNotesKey, notes);
}
