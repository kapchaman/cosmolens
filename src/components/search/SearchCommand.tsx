"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { globalSearch } from "@/lib/astronomy/search";

export function SearchCommand({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => globalSearch(query), [query]);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 px-3 py-16 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search CosmoLens"
        >
          <div className="mx-auto max-w-2xl panel">
            <div className="flex items-center gap-3 border-b border-[color:var(--border)] p-4">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search objects, concepts, phenomena..."
                className="min-h-12 flex-1 bg-transparent text-lg outline-none placeholder:text-[color:var(--muted-strong)]"
              />
              <button className="button button-ghost size-10 p-0" type="button" onClick={() => setOpen(false)} aria-label="Close search">
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-3">
              {query.trim() && results.length === 0 ? (
                <div className="quiet-panel p-5 text-sm text-[color:var(--muted)]">
                  No matching object yet. The catalog is intentionally curated and will expand in phases.
                </div>
              ) : null}
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.href}
                  className="block rounded-md border border-transparent p-4 hover:border-[color:var(--border)] hover:bg-white/[0.04]"
                  onClick={() => setOpen(false)}
                >
                  <span className="tiny-label">{result.eyebrow}</span>
                  <span className="mt-1 block text-base font-semibold">{result.title}</span>
                  <span className="mt-1 block text-sm text-[color:var(--muted)]">{result.summary}</span>
                </Link>
              ))}
              {!query.trim() ? (
                <div className="grid gap-2 p-2 text-sm text-[color:var(--muted)]">
                  <span>Try: Andromeda, lensing, dark matter, Jupiter, Sagittarius A*</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
