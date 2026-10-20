import { beforeEach, expect, test, vi } from "vitest";
import { readCosmosNotes, readSavedObjects, writeCosmosNotes, cosmosNotesKey, savedObjectsKey } from "@/lib/my-cosmos/storage";
const note = { id: "n1", title: "Question", body: "Why do stars shine?", createdAt: "2026-10-21T00:00:00.000Z" };
let records: Map<string, string>;
beforeEach(() => {
  records = new Map();
  vi.stubGlobal("window", { localStorage: { getItem: (key: string) => records.get(key), setItem: (key: string, value: string) => records.set(key, value) }, dispatchEvent: vi.fn() });
});
test.each(["{", "null", "42", '"oops"', "{}", '[null,{},4,{"title":3}]'])("recovers malformed storage: %s", (raw) => {
  records.set(cosmosNotesKey, raw); records.set(savedObjectsKey, raw);
  expect(readCosmosNotes()).toEqual([]); expect(readSavedObjects()).toEqual([]);
});
test("retains valid notes in a mixed collection, deduplicates and does not rewrite it", () => {
  const raw = JSON.stringify([null, note, { ...note, id: "bad", body: 4 }, note]);
  records.set(cosmosNotesKey, raw);
  expect(readCosmosNotes()).toEqual([note]); expect(records.get(cosmosNotesKey)).toBe(raw);
});
test("rejects invalid saved categories and unsafe object identifiers", () => {
  records.set(savedObjectsKey, JSON.stringify([{ id: "../evil", name: "x", category: "planet", summary: "x", savedAt: note.createdAt }, { id: "sun", name: "Sun", category: "unknown", summary: "x", savedAt: note.createdAt }]));
  expect(readSavedObjects()).toEqual([]);
});
test("blocked storage reads recover but failed writes remain observable", () => {
  vi.stubGlobal("window", { get localStorage() { throw new Error("Storage blocked"); } });
  expect(readCosmosNotes()).toEqual([]);
  expect(() => writeCosmosNotes([note])).toThrow("Storage blocked");
});
test("valid writes round trip", () => { writeCosmosNotes([note]); expect(readCosmosNotes()).toEqual([note]); });
