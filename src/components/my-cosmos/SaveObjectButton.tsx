"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { readSavedObjects, writeSavedObjects } from "@/lib/my-cosmos/storage";
import type { SavedCosmosObject } from "@/types/my-cosmos";

export function SaveObjectButton({ object }: { object: Omit<SavedCosmosObject, "savedAt"> }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSavedObjects().some((item) => item.id === object.id));
  }, [object.id]);

  function toggleSaved() {
    const existing = readSavedObjects();

    if (existing.some((item) => item.id === object.id)) {
      writeSavedObjects(existing.filter((item) => item.id !== object.id));
      setSaved(false);
      return;
    }

    writeSavedObjects([{ ...object, savedAt: new Date().toISOString() }, ...existing]);
    setSaved(true);
  }

  return (
    <button className="button button-ghost" type="button" aria-pressed={saved} onClick={toggleSaved}>
      <Star aria-hidden="true" size={16} fill={saved ? "var(--accent)" : "none"} color="var(--accent)" />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
