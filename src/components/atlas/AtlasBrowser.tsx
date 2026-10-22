"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { updateQuery } from "@/lib/navigation";
import { Search } from "lucide-react";
import type { AstronomicalObject, ObjectCategory } from "@/types/astronomy";
import { formatCategory } from "@/lib/astronomy/format";
import { observatoryMedia } from "@/content/observatory-media";
import { ArchiveCard } from "@/components/observatory/ArchiveCard";

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
  return (
    <Suspense fallback={<p role="status">Loading atlas filters…</p>}>
      <AtlasBrowserContent objects={objects} />
    </Suspense>
  );
}

function AtlasBrowserContent({ objects }: { objects: AstronomicalObject[] }) {
  const params = useSearchParams();
  const query = params.get("query") || "";
  const candidate = params.get("category");
  const category = categories.find((item) => item === candidate) || "all";

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return objects
      .filter((object) => {
        const matchesCategory =
          category === "all" || object.category === category;
        const matchesQuery =
          !normalized ||
          [
            object.name,
            object.summary,
            object.description,
            ...object.aliases,
            ...object.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized);

        return matchesCategory && matchesQuery;
      })
      .sort(
        (a, b) =>
          Number(Boolean(observatoryMedia[b.id])) -
          Number(Boolean(observatoryMedia[a.id])),
      );
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

  return (
    <div>
      <div className="atlas-toolbar">
        <label className="atlas-search">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Search atlas</span>
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery({ query: event.target.value })}
            placeholder="Search objects or ideas"
            autoComplete="off"
          />
        </label>
        <div className="atlas-category-select">
          <label htmlFor="atlas-category">Object category</label>
          <select
            id="atlas-category"
            value={category}
            onChange={(event) =>
              updateQuery(
                {
                  category:
                    event.target.value === "all" ? null : event.target.value,
                },
                true,
              )
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All objects" : formatCategory(item)} (
                {categoryCounts[item] || 0})
              </option>
            ))}
          </select>
        </div>
        <div
          className="atlas-filters"
          role="group"
          aria-label="Filter by object category"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() =>
                updateQuery({ category: item === "all" ? null : item }, true)
              }
            >
              {item === "all" ? "All" : formatCategory(item)}{" "}
              <span>{categoryCounts[item] || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="atlas-summary">
        <p role="status">
          {filtered.length} matching entries{" "}
          <span aria-hidden="true">/ {objects.length} records</span>
        </p>
        {query || category !== "all" ? (
          <button
            type="button"
            onClick={() => updateQuery({ query: null, category: null }, true)}
          >
            Clear filters
          </button>
        ) : (
          <span>Measurements · estimates · models</span>
        )}
      </div>
      <div className="archive-grid">
        {filtered.map((object, index) => (
          <ArchiveCard key={object.id} object={object} index={index} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="atlas-empty">
          <h2>No matching records.</h2>
          <p>Try a different name, an alias or a broader category.</p>
          <button
            type="button"
            className="obs-action"
            onClick={() => updateQuery({ query: null, category: null }, true)}
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  );
}
