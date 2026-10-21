"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cosmosStorageEvent, readSavedObjects, writeSavedObjects } from "@/lib/my-cosmos/storage";
import type { SavedCosmosObject } from "@/types/my-cosmos";

export function SaveObjectButton({ object }: { object: Omit<SavedCosmosObject, "savedAt"> }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => setSaved(readSavedObjects().some((item) => item.id === object.id));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(cosmosStorageEvent, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(cosmosStorageEvent, refresh);
    };
  }, [object.id]);

  function toggleSaved() {
    const existing = readSavedObjects();
    const wasSaved = existing.some((item) => item.id === object.id);
    try {
      writeSavedObjects(wasSaved
        ? existing.filter((item) => item.id !== object.id)
        : [{ ...object, savedAt: new Date().toISOString() }, ...existing]);
      setSaved(!wasSaved);
      setError("");
    } catch {
      setError("Change was not saved. Check browser storage and try again.");
    }
  }
  return (
    <div>
      <button className="button button-ghost" type="button" aria-pressed={saved} onClick={toggleSaved}>
        <Star aria-hidden="true" size={16} fill={saved ? "var(--accent)" : "none"} color="var(--accent)" />
        {saved ? "Saved" : "Save"}
      </button>
      {error ? <p className="mt-2 text-sm text-[color:var(--red)]" role="alert">{error}</p> : null}
    </div>
  );
}
