"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  cosmosStorageEvent,
  readCosmosNotes,
  readSavedObjects,
  writeCosmosNotes,
  writeSavedObjects,
} from "@/lib/my-cosmos/storage";
import type { CosmosNote, SavedCosmosObject } from "@/types/my-cosmos";

export function MyCosmosPanel() {
  const [savedObjects, setSavedObjects] = useState<SavedCosmosObject[]>([]);
  const [records, setRecords] = useState<CosmosNote[]>([]);
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [lastRemoved, setLastRemoved] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    error: boolean;
    text: string;
  } | null>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const undoButton = useRef<HTMLButtonElement>(null);
  const notes = records.filter((note) => !note.removedAt);
  const removed = records.filter((note) => note.removedAt);

  useEffect(() => {
    function refresh() {
      setSavedObjects(readSavedObjects());
      setRecords(readCosmosNotes(true));
      setReady(true);
    }
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(cosmosStorageEvent, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(cosmosStorageEvent, refresh);
    };
  }, []);
  useEffect(() => {
    if (lastRemoved) undoButton.current?.focus();
  }, [lastRemoved]);

  function removeObject(id: string) {
    try {
      const next = readSavedObjects().filter((object) => object.id !== id);
      writeSavedObjects(next);
      setSavedObjects(next);
      setFeedback({
        error: false,
        text: "Object removed. You can save it again from the atlas.",
      });
    } catch {
      setFeedback({
        error: true,
        text: "Could not remove the object. Check browser storage and try again.",
      });
    }
  }

  function removeNote(id: string) {
    try {
      const next = readCosmosNotes(true).map((note) =>
        note.id === id
          ? { ...note, removedAt: new Date().toISOString() }
          : note,
      );
      writeCosmosNotes(next);
      setRecords(next);
      setLastRemoved(id);
      setFeedback({
        error: false,
        text: "Note moved to Removed notes. You can restore it, even after reloading.",
      });
    } catch {
      setFeedback({
        error: true,
        text: "Could not remove the note. Your note is still saved.",
      });
    }
  }

  function restoreNote(id: string) {
    try {
      const next = readCosmosNotes(true).map((note) => {
        if (note.id !== id) return note;
        const { removedAt: _removedAt, ...restored } = note;
        return restored;
      });
      writeCosmosNotes(next);
      setRecords(next);
      setLastRemoved(null);
      setFeedback({ error: false, text: "Note restored on this device." });
      titleInput.current?.focus();
    } catch {
      setFeedback({
        error: true,
        text: "Could not restore the note. It remains in Removed notes; try again.",
      });
    }
  }

  function permanentlyDelete(id: string) {
    if (
      !window.confirm(
        "Permanently delete this removed note? This cannot be undone.",
      )
    )
      return;
    try {
      const next = readCosmosNotes(true).filter(
        (note) => note.id !== id || !note.removedAt,
      );
      writeCosmosNotes(next);
      setRecords(next);
      if (lastRemoved === id) setLastRemoved(null);
      setFeedback({
        error: false,
        text: "Note permanently deleted from this device.",
      });
      titleInput.current?.focus();
    } catch {
      setFeedback({
        error: true,
        text: "Could not delete the note. It remains in Removed notes.",
      });
    }
  }

  function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || !title.trim() || !body.trim()) return;
    const next = [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        createdAt: new Date().toISOString(),
      },
      ...readCosmosNotes(true),
    ];
    try {
      writeCosmosNotes(next);
      setRecords(next);
      setTitle("");
      setBody("");
      setFeedback({ error: false, text: "Note saved on this device." });
      titleInput.current?.focus();
    } catch {
      setFeedback({
        error: true,
        text: "Note was not saved. Your draft is still here. Check browser storage and try again.",
      });
    }
  }

  return (
    <div className="journal-workspace">
      <nav aria-label="Journal sections" className="journal-navigation">
        <a href="#new-note" className="button button-primary">
          Write a note <Plus aria-hidden="true" size={16} />
        </a>
        <a href="#saved-objects" className="button button-ghost">
          Saved objects · {savedObjects.length}
        </a>
        <a href="#journal-notes" className="button button-ghost">
          Notes · {notes.length}
        </a>
      </nav>
      <p className="journal-privacy">
        Stored in this browser only. No account or cloud backup. Clearing site
        data removes your journal, including removed notes.
      </p>
      {feedback && (
        <div className="journal-feedback">
          <p role={feedback.error ? "alert" : "status"}>{feedback.text}</p>
          {lastRemoved && removed.some((note) => note.id === lastRemoved) && (
            <button
              ref={undoButton}
              className="button button-ghost"
              onClick={() => restoreNote(lastRemoved)}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={16} />
              Undo removal
            </button>
          )}
        </div>
      )}
      <div className="journal-layout">
        <section
          id="new-note"
          className="journal-composer"
          aria-labelledby="new-note-heading"
        >
          <p className="obs-kicker">Field notebook</p>
          <h2 id="new-note-heading">What caught your attention?</h2>
          <form onSubmit={submitNote}>
            <label htmlFor="cosmos-note-title">Note title</label>
            <input
              ref={titleInput}
              id="cosmos-note-title"
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A question or a discovery"
            />
            <label htmlFor="cosmos-note-body">Note body</label>
            <textarea
              id="cosmos-note-body"
              required
              maxLength={20000}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Record what you noticed and what to investigate next."
            />
            <button
              className="button button-primary"
              type="submit"
              disabled={!ready}
            >
              <Plus aria-hidden="true" size={16} />
              Add note
            </button>
          </form>
        </section>
        <section
          id="saved-objects"
          className="journal-saved"
          aria-labelledby="saved-heading"
        >
          <p className="obs-kicker">Saved objects</p>
          <h2 id="saved-heading">Your personal atlas</h2>
          {savedObjects.length ? (
            savedObjects.map((object) => (
              <article key={object.id} className="journal-entry">
                <div>
                  <p className="tiny-label">{object.category}</p>
                  <h3>
                    <Link href={`/objects/${object.id}`}>
                      {object.name}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  </h3>
                  <p>{object.summary}</p>
                </div>
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => removeObject(object.id)}
                  aria-label={`Remove ${object.name}`}
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </article>
            ))
          ) : (
            <p className="journal-empty">
              No saved objects yet. <Link href="/atlas">Explore the atlas</Link>{" "}
              and save something that interests you.
            </p>
          )}
        </section>
      </div>
      <section
        id="journal-notes"
        aria-labelledby="notes-heading"
        className="journal-notes"
      >
        <p className="obs-kicker">Observation log</p>
        <h2 id="notes-heading">
          Notes <span>{notes.length}</span>
        </h2>
        {!notes.length && (
          <p className="journal-empty">Your next question belongs here.</p>
        )}
        {notes.map((note) => (
          <article key={note.id} className="journal-entry">
            <div>
              <h3>{note.title}</h3>
              <p className="journal-note-body">{note.body}</p>
            </div>
            <button
              className="button button-ghost"
              type="button"
              onClick={() => removeNote(note.id)}
              aria-label={`Remove note ${note.title}`}
            >
              <Trash2 aria-hidden="true" size={16} />
            </button>
          </article>
        ))}
      </section>
      {!!removed.length && (
        <details className="journal-removed">
          <summary>Removed notes ({removed.length})</summary>
          <p>Kept on this device until restored or permanently deleted.</p>
          {removed.map((note) => (
            <article key={note.id} className="journal-entry">
              <div>
                <h3>{note.title}</h3>
                <p className="journal-note-body">{note.body}</p>
              </div>
              <div className="journal-removed-actions">
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => restoreNote(note.id)}
                  aria-label={`Restore note ${note.title}`}
                >
                  <RotateCcw aria-hidden="true" size={16} />
                  Restore
                </button>
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => permanentlyDelete(note.id)}
                  aria-label={`Permanently delete note ${note.title}`}
                >
                  Delete permanently
                </button>
              </div>
            </article>
          ))}
        </details>
      )}
    </div>
  );
}
