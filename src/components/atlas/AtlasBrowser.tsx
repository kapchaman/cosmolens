"use client";

import { useMemo, useState } from "react";
import { Database, Filter, Search, Sparkles } from "lucide-react";
import type { AstronomicalObject, ObjectCategory } from "@/types/astronomy";
import { formatCategory } from "@/lib/astronomy/format";
import { ObjectCard } from "@/components/atlas/ObjectCard";

const categories: Array<"all" | ObjectCategory> = [
  "all",
  "planet",
  "moon",
  "star",
  "galaxy",
  "nebula",
  "black-hole",
  "cluster",
  "concept",
];

export function AtlasBrowser({ objects }: { objects: AstronomicalObject[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return objects.filter((object) => {
      const matchesCategory = category === "all" || object.category === category;
      const matchesQuery =
        !normalized ||
        [object.name, object.summary, object.description, ...object.aliases, ...object.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [category, objects, query]);

  const categoryCounts = useMemo(() => {
    return objects.reduce<Record<string, number>>(
      (counts, object) => {
        counts.all += 1;
        counts[object.category] = (counts[object.category] || 0) + 1;
        return counts;
      },
      { all: 0 },
    );
  }, [objects]);

  const featuredCount = useMemo(() => objects.filter((object) => object.featured).length, [objects]);
  const sourceBackedCount = useMemo(
    () => objects.filter((object) => object.sourceIds.length > 0 && object.measurements.every((measurement) => measurement.sourceIds.length > 0)).length,
    [objects],
  );

  return (
    <div>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="quiet-panel p-4">
          <Database aria-hidden="true" size={17} color="var(--accent)" />
          <div className="mt-3 text-2xl font-semibold">{objects.length}</div>
          <div className="text-sm text-[color:var(--muted)]">curated entries</div>
        </div>
        <div className="quiet-panel p-4">
          <Sparkles aria-hidden="true" size={17} color="var(--cyan)" />
          <div className="mt-3 text-2xl font-semibold">{featuredCount}</div>
          <div className="text-sm text-[color:var(--muted)]">featured objects</div>
        </div>
        <div className="quiet-panel p-4">
          <div className="tiny-label">Scientific integrity</div>
          <div className="mt-3 text-2xl font-semibold">{sourceBackedCount}</div>
          <div className="text-sm text-[color:var(--muted)]">entries with source-backed measurements</div>
        </div>
      </div>

      <div className="panel p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-md border border-[color:var(--border)] bg-black/20 px-3">
            <Search aria-hidden="true" size={18} color="var(--muted)" />
            <span className="sr-only">Search atlas</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-[color:var(--muted-strong)]"
              placeholder="Search objects, concepts, phenomena..."
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto" aria-label="Filter by object category">
            <Filter aria-hidden="true" size={17} color="var(--muted)" />
            {categories.map((item) => (
              <button
                key={item}
                className={`button min-h-10 whitespace-nowrap px-3 ${category === item ? "button-primary" : "button-ghost"}`}
                type="button"
                onClick={() => setCategory(item)}
              >
                {item === "all" ? "All" : formatCategory(item)}
                <span className="rounded-full border border-current/20 px-1.5 text-xs opacity-70">
                  {categoryCounts[item] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((object) => (
          <ObjectCard key={object.id} object={object} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 quiet-panel p-8 text-center text-[color:var(--muted)]">
          No curated object matches this search yet.
        </div>
      ) : null}
    </div>
  );
}
