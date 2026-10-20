import { ExternalLink } from "lucide-react";
import type { ScientificSource } from "@/types/sources";

export function SourceList({ sources }: { sources: ScientificSource[] }) {
  return (
    <div className="grid gap-3">
      {sources.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="quiet-panel flex items-start justify-between gap-4 p-4 hover:border-[color:var(--border-strong)]"
        >
          <span>
            <span className="tiny-label">{source.organization}</span>
            <span className="mt-1 block font-semibold">{source.title}</span>
            <span className="mt-1 block text-sm text-[color:var(--muted)]">
              {source.year ? `${source.year} · ` : ""}
              {source.type}
            </span>
          </span>
          <ExternalLink aria-hidden="true" className="mt-1 shrink-0" size={16} color="var(--muted)" />
        </a>
      ))}
    </div>
  );
}
