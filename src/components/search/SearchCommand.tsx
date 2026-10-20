"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { globalSearch } from "@/lib/astronomy/search";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const results = useMemo(() => globalSearch(query), [query]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) { if (element.open) element.close(); return; }
    element.showModal(); // Native modal makes the background inert and traps Tab.
    input.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; if (element.open) element.close(); };
  }, [open]);

  return (
    <>
      <button ref={trigger} className="button button-ghost min-h-11 px-3" type="button" aria-label="Search CosmoLens" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" size={16} /><span className="hidden sm:inline">Search</span>
      </button>
      <dialog ref={dialog} className="search-dialog panel" aria-label="Search CosmoLens" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div className="flex items-center gap-3 border-b border-[color:var(--border)] p-4">
          <label htmlFor={id} className="sr-only">Search objects and journeys</label>
          <input ref={input} id={id} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search objects, concepts, phenomena…" className="min-h-12 min-w-0 flex-1 bg-transparent text-base placeholder:text-[color:var(--muted-strong)] sm:text-lg" />
          <button className="button button-ghost size-11 shrink-0 p-0" type="button" onClick={() => setOpen(false)} aria-label="Close search"><X aria-hidden="true" size={18} /></button>
        </div>
        <div className="max-h-[60dvh] overflow-y-auto p-3">
          <p className="sr-only" role="status">{query.trim() ? `${results.length} search results` : "Enter a search term"}</p>
          {query.trim() && results.length === 0 ? <p className="quiet-panel p-5 text-sm text-[color:var(--muted)]">No matching entry yet. Try a shorter name or a broader topic.</p> : null}
          {results.map((result) => (
            <Link key={result.id} href={result.href} className="block rounded-md border border-transparent p-4 hover:border-[color:var(--border)] hover:bg-white/[0.04]" onClick={() => setOpen(false)}>
              <span className="tiny-label">{result.eyebrow}</span>
              <span className="mt-1 block text-base font-semibold">{result.title}</span>
              <span className="mt-1 block text-sm text-[color:var(--muted)]">{result.summary}</span>
            </Link>
          ))}
          {!query.trim() ? <p className="p-2 text-sm text-[color:var(--muted)]">Try: Andromeda, lensing, dark matter, Jupiter, Sagittarius A*</p> : null}
        </div>
      </dialog>
    </>
  );
}
