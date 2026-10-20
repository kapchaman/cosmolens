import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AstronomicalObject } from "@/types/astronomy";
import { formatCategory } from "@/lib/astronomy/format";

export function ObjectCard({ object }: { object: AstronomicalObject }) {
  const primaryMetric = object.measurements[0];

  return (
    <Link href={`/objects/${object.id}`} className="object-card">
      <div>
        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="tiny-label">{formatCategory(object.category)}</span>
          <ArrowUpRight aria-hidden="true" size={16} color="var(--muted)" />
        </div>
        <h3 className="text-xl font-semibold">{object.name}</h3>
        <p className="mt-3 text-sm text-[color:var(--muted)]">{object.summary}</p>
      </div>
      <div className="mt-8 border-t border-[color:var(--border)] pt-4">
        {primaryMetric ? (
          <>
            <span className="text-xs text-[color:var(--muted-strong)]">{primaryMetric.label}</span>
            <span className="mt-1 block text-sm font-semibold">
              {primaryMetric.value}
              {primaryMetric.unit ? ` ${primaryMetric.unit}` : ""}
            </span>
          </>
        ) : (
          <span className="text-sm text-[color:var(--muted)]">Curated data pending</span>
        )}
      </div>
    </Link>
  );
}
