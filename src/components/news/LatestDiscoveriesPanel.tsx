"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink, Loader2, Newspaper } from "lucide-react";
import type { AstronomyNewsResponse } from "@/types/integrations";

type NewsState =
  | { status: "loading" }
  | { status: "ready"; data: AstronomyNewsResponse }
  | { status: "error"; message: string };

function formatDate(value: string | null) {
  if (!value) {
    return "date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function LatestDiscoveriesPanel({ compact = false, showOpenLink = true }: { compact?: boolean; showOpenLink?: boolean }) {
  const [state, setState] = useState<NewsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      try {
        const response = await fetch("/api/news", { signal: controller.signal });
        const data = (await response.json()) as AstronomyNewsResponse;

        if (!response.ok) {
          throw new Error("Latest discoveries could not be loaded.");
        }

        setState({ status: "ready", data });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({ status: "error", message: "Official feeds could not be reached." });
      }
    }

    loadNews();
    return () => controller.abort();
  }, []);

  return (
    <section className={compact ? "" : "section"} id="discoveries">
      <div className={compact ? "" : "app-container"}>
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Latest Discoveries</div>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold">Official astronomy and space science updates</h2>
          </div>
          {showOpenLink ? (
            <a className="button button-ghost" href="/discoveries">
              Open feed
            </a>
          ) : null}
        </div>

        {state.status === "loading" ? (
          <div className="panel grid min-h-48 place-items-center p-8" data-news-state="loading">
            <div className="flex items-center gap-3 text-[color:var(--muted)]">
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
              Checking official sources...
            </div>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div className="panel p-5" data-news-state="error" role="status">
            <div className="flex items-center gap-3 text-[color:var(--red)]">
              <AlertTriangle aria-hidden="true" size={18} />
              {state.message}
            </div>
          </div>
        ) : null}

        {state.status === "ready" ? (
          <div className="panel overflow-hidden" data-news-state={state.data.status}>
            <div className="grid gap-0 md:grid-cols-2">
              {state.data.items.length ? (
                state.data.items.slice(0, compact ? 4 : 8).map((item) => (
                  <article key={item.id} className="border-b border-[color:var(--border)] p-5 md:border-r">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="confidence mt-0">{item.source.name}</span>
                      <span className="confidence mt-0">{formatDate(item.publishedAt)}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-3 text-sm text-[color:var(--muted)]">{item.summary}</p>
                    <a className="button button-ghost mt-5" href={item.url} target="_blank" rel="noreferrer">
                      Source
                      <ExternalLink aria-hidden="true" size={15} />
                    </a>
                  </article>
                ))
              ) : (
                <div className="p-6 text-sm text-[color:var(--muted)]">
                  Official feeds are temporarily unavailable.
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border)] p-4 text-sm text-[color:var(--muted)]">
              <span className="flex items-center gap-2">
                <Newspaper aria-hidden="true" size={15} color="var(--accent)" />
                NASA, JPL, and ESA official feeds
              </span>
              {state.data.errors.length ? (
                <span>{state.data.errors.length} source warning{state.data.errors.length === 1 ? "" : "s"}</span>
              ) : (
                <span>all sources responded</span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
