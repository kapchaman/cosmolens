"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { AstroImage } from "@/components/observatory/AstroImage";
import type { ApodItem } from "@/types/integrations";

type ApodState =
  | { status: "loading" }
  | { status: "ready"; item: ApodItem }
  | { status: "error"; message: string };

export function ApodPanel() {
  const [state, setState] = useState<ApodState>({ status: "loading" });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    async function loadApod() {
      try {
        const response = await fetch("/api/nasa/apod", {
          signal: controller.signal,
        });
        const data = (await response.json()) as ApodItem;

        if (!response.ok) {
          throw new Error("NASA APOD is unavailable.");
        }

        setState({ status: "ready", item: data });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({
          status: "error",
          message:
            "NASA APOD could not be loaded. The atlas remains available.",
        });
      }
    }

    loadApod();
    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="section" id="apod">
      <div className="app-container">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">NASA APOD</div>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold">
              Astronomy picture of the day
            </h2>
          </div>
          <a
            className="button button-ghost"
            href="https://science.nasa.gov/mission/apod/"
            target="_blank"
            rel="noreferrer"
          >
            NASA archive
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        </div>

        {state.status === "loading" ? (
          <div
            className="panel grid min-h-[380px] place-items-center p-8"
            aria-live="polite"
            data-apod-state="loading"
          >
            <div className="flex items-center gap-3 text-[color:var(--muted)]">
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
              Loading astronomical data...
            </div>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div className="panel p-6" role="status" data-apod-state="error">
            <div className="flex items-center gap-3 text-[color:var(--red)]">
              <AlertTriangle aria-hidden="true" size={18} />
              <span>{state.message}</span>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        {state.status === "ready" ? (
          <ApodContent
            item={state.item}
            onRetry={() => setAttempt((value) => value + 1)}
          />
        ) : null}
      </div>
    </section>
  );
}

function ApodContent({
  item,
  onRetry,
}: {
  item: ApodItem;
  onRetry: () => void;
}) {
  const showImage = item.mediaType === "image" && item.imageUrl;

  return (
    <article
      className="panel grid overflow-hidden lg:grid-cols-[1.08fr_0.92fr]"
      data-apod-state="ready"
    >
      <div className="apod-observation">
        {showImage ? (
          <AstroImage
            key={item.imageUrl}
            media={{
              src: item.imageUrl!,
              alt: item.alt || item.title,
              kind: "NASA APOD",
              credit: item.credit || item.copyright || "NASA APOD",
              source:
                item.sourceUrl || "https://science.nasa.gov/mission/apod/",
            }}
          />
        ) : (
          <div className="grid h-full min-h-[360px] place-items-center p-8">
            <div className="quiet-panel max-w-md p-5 text-center">
              <ImageIcon
                aria-hidden="true"
                className="mx-auto text-[color:var(--accent)]"
                size={24}
              />
              <h3 className="mt-3 text-xl font-semibold">
                {item.mediaType === "video"
                  ? "NASA video entry"
                  : "NASA media unavailable"}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Open the original APOD page for the full media entry.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="confidence mt-0">
              {item.status === "live" ? "live NASA data" : "fallback"}
            </span>
            {item.date ? (
              <span className="confidence mt-0">{item.date}</span>
            ) : null}
          </div>
          <h3 className="mt-5 text-3xl font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
            {item.explanation.length > 280
              ? item.explanation.slice(0, 280) + "…"
              : item.explanation}
          </p>
        </div>

        {item.explanation.length > 280 && (
          <details className="text-sm leading-7 text-[color:var(--muted)]">
            <summary className="cursor-pointer text-[color:var(--cyan)]">
              Read full explanation
            </summary>
            <p className="mt-3">{item.explanation}</p>
          </details>
        )}
        <div className="grid gap-3">
          {item.status === "fallback" && (
            <button
              type="button"
              className="button button-ghost w-fit"
              onClick={onRetry}
            >
              Retry NASA data
            </button>
          )}
          {item.credit || item.copyright ? (
            <div className="quiet-panel p-4 text-sm text-[color:var(--muted)]">
              <div className="tiny-label">Credit</div>
              <div className="mt-2">{item.credit || item.copyright}</div>
            </div>
          ) : null}
          {item.sourceUrl ? (
            <a
              className="button button-primary w-fit"
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open source
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
