"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Star, Trash2 } from "lucide-react";
import { readCosmosNotes, readSavedObjects, writeCosmosNotes, writeSavedObjects } from "@/lib/my-cosmos/storage";
import type { CosmosNote, SavedCosmosObject } from "@/types/my-cosmos";

function createNoteId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}`;
}

export function MyCosmosPanel() {
  const [savedObjects, setSavedObjects] = useState<SavedCosmosObject[]>([]);
  const [notes, setNotes] = useState<CosmosNote[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);

  useEffect(() => {
    setSavedObjects(readSavedObjects());
    setNotes(readCosmosNotes());
  }, []);

  const savedCategories = useMemo(
    () => [...new Set(savedObjects.map((object) => object.category))],
    [savedObjects],
  );

  function removeObject(id: string) {
    const next = savedObjects.filter((object) => object.id !== id);
    try {
      writeSavedObjects(next);
      setSavedObjects(next);
      setFeedback({ error: false, text: "Object removed." });
    } catch {
      setFeedback({ error: true, text: "Could not remove the object. Check browser storage and try again." });
    }
  }

  function removeNote(id: string) {
    const next = notes.filter((note) => note.id !== id);
    try {
      writeCosmosNotes(next);
      setNotes(next);
      setFeedback({ error: false, text: "Note removed." });
    } catch {
      setFeedback({ error: true, text: "Could not remove the note. Check browser storage and try again." });
    }
  }

  function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      return;
    }

    const next = [
      {
        id: createNoteId(),
        title: trimmedTitle,
        body: trimmedBody,
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ];

    try {
      writeCosmosNotes(next);
      setNotes(next);
      setTitle("");
      setBody("");
      setFeedback({ error: false, text: "Note saved on this device." });
    } catch {
      setFeedback({ error: true, text: "Note was not saved. Your draft is still here. Check browser storage and try again." });
    }
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      {feedback ? <p className="quiet-panel p-4 lg:col-span-2" role={feedback.error ? "alert" : "status"}>{feedback.text}</p> : null}
      <section className="panel p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Saved Objects</div>
            <h2 className="mt-2 text-3xl font-semibold">Personal atlas</h2>
          </div>
          <span className="confidence mt-0">{savedObjects.length} saved</span>
        </div>

        {savedObjects.length ? (
          <div className="grid gap-3">
            {savedObjects.map((object) => (
              <article key={object.id} className="quiet-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="tiny-label">{object.category}</div>
                    <Link href={`/objects/${object.id}`} className="mt-1 block text-xl font-semibold hover:text-[color:var(--accent)]">
                      {object.name}
                    </Link>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">{object.summary}</p>
                  </div>
                  <button className="button button-ghost size-10 p-0" type="button" onClick={() => removeObject(object.id)} aria-label={`Remove ${object.name}`}>
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="quiet-panel p-5 text-sm text-[color:var(--muted)]">
            No saved objects yet. <Link href="/atlas" className="underline">Explore the atlas</Link> and save something that interests you.
          </div>
        )}
      </section>

      <aside className="grid h-fit gap-4">
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Star aria-hidden="true" size={17} color="var(--accent)" />
            <h2 className="text-xl font-semibold">Signal</h2>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="quiet-panel p-3">
              <div className="tiny-label">Categories</div>
              <div className="mt-2">{savedCategories.length ? savedCategories.join(", ") : "none yet"}</div>
            </div>
            <div className="quiet-panel p-3">
              <div className="tiny-label">Notes</div>
              <div className="mt-2">{notes.length} entries</div>
            </div>
          </div>
        </section>

        <section className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen aria-hidden="true" size={17} color="var(--cyan)" />
            <h2 className="text-xl font-semibold">Notes</h2>
          </div>
          <form onSubmit={submitNote} className="grid gap-3">
            <label className="sr-only" htmlFor="cosmos-note-title">
              Note title
            </label>
            <input
              id="cosmos-note-title"
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="min-h-11 rounded-md border border-[color:var(--border)] bg-black/20 px-3 outline-none placeholder:text-[color:var(--muted-strong)]"
              placeholder="Question or discovery"
            />
            <label className="sr-only" htmlFor="cosmos-note-body">
              Note body
            </label>
            <textarea
              id="cosmos-note-body"
              required
              maxLength={20000}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-28 resize-y rounded-md border border-[color:var(--border)] bg-black/20 p-3 outline-none placeholder:text-[color:var(--muted-strong)]"
              placeholder="What should I investigate next?"
            />
            <button className="button button-primary" type="submit">
              <Plus aria-hidden="true" size={16} />
              Add note
            </button>
          </form>

          <div className="mt-5 grid gap-3">
            {notes.map((note) => (
              <article key={note.id} className="quiet-panel p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{note.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-[color:var(--muted)]">{note.body}</p>
                  </div>
                  <button className="button button-ghost size-9 p-0" type="button" onClick={() => removeNote(note.id)} aria-label={`Remove note ${note.title}`}>
                    <Trash2 aria-hidden="true" size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
