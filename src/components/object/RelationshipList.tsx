import Link from "next/link";
import { Network } from "lucide-react";
import type { AstronomicalObject, Relationship } from "@/types/astronomy";
import { formatCategory } from "@/lib/astronomy/format";

export function RelationshipList({
  items,
}: {
  items: Array<{ relationship: Relationship; target: AstronomicalObject }>;
}) {
  return (
    <div className="grid gap-3">
      {items.map(({ relationship, target }) => (
        <Link
          key={`${relationship.kind}-${target.id}`}
          href={`/objects/${target.id}`}
          className="quiet-panel flex items-start gap-4 p-4 hover:border-[color:var(--border-strong)]"
        >
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--border)]">
            <Network aria-hidden="true" size={16} color="var(--accent)" />
          </span>
          <span>
            <span className="tiny-label">
              {relationship.kind.replaceAll("-", " ")} / {formatCategory(target.category)}
            </span>
            <span className="mt-1 block font-semibold">{target.name}</span>
            <span className="mt-1 block text-sm text-[color:var(--muted)]">
              {relationship.note || target.summary}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
