"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, CircleDot, Database, EqualNot, Scale } from "lucide-react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import type { AstronomicalObject, Measurement } from "@/types/astronomy";
import { formatCategory, formatConfidence } from "@/lib/astronomy/format";

function measurementValue(measurement?: Measurement) {
  if (!measurement) {
    return "not in curated record";
  }

  return `${measurement.value}${measurement.unit ? ` ${measurement.unit}` : ""}`;
}

function confidenceLabel(measurement?: Measurement) {
  return measurement ? formatConfidence(measurement.confidence) : "Pending";
}

export function CompareObjects({
  objects,
  initialLeft,
  initialRight,
}: {
  objects: AstronomicalObject[];
  initialLeft?: string;
  initialRight?: string;
}) {
  const [leftId, setLeftId] = useState(initialLeft || "andromeda");
  const [rightId, setRightId] = useState(initialRight || "milky-way");

  const left = objects.find((object) => object.id === leftId) || objects[0];
  const right = objects.find((object) => object.id === rightId && object.id !== left.id) || objects.find((object) => object.id !== left.id) || objects[0];

  const comparisonRows = useMemo(() => {
    const leftByLabel = new Map(left.measurements.map((measurement) => [measurement.label.toLowerCase(), measurement]));
    const rightByLabel = new Map(right.measurements.map((measurement) => [measurement.label.toLowerCase(), measurement]));
    const labels = new Set([...leftByLabel.keys(), ...rightByLabel.keys()]);

    return [...labels].map((label) => ({
      label,
      left: leftByLabel.get(label),
      right: rightByLabel.get(label),
    }));
  }, [left, right]);

  const sharedTags = left.tags.filter((tag) => right.tags.includes(tag));
  const directRelationship = left.relationships.find((relationship) => relationship.targetId === right.id);
  const reverseRelationship = right.relationships.find((relationship) => relationship.targetId === left.id);

  return (
    <div className="grid gap-8">
      <div className="panel p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
          <label className="grid gap-2">
            <span className="tiny-label">Primary object</span>
            <select value={left.id} onChange={(event) => setLeftId(event.target.value)} className="min-h-12 rounded-md border border-[color:var(--border)] bg-black/30 px-3 text-[color:var(--foreground)]">
              {objects.map((object) => (
                <option key={object.id} value={object.id}>
                  {object.name}
                </option>
              ))}
            </select>
          </label>

          <div className="hidden h-12 w-12 items-center justify-center rounded-md border border-[color:var(--border)] lg:flex">
            <ArrowLeftRight aria-hidden="true" size={18} color="var(--accent)" />
          </div>

          <label className="grid gap-2">
            <span className="tiny-label">Comparison object</span>
            <select value={right.id} onChange={(event) => setRightId(event.target.value)} className="min-h-12 rounded-md border border-[color:var(--border)] bg-black/30 px-3 text-[color:var(--foreground)]">
              {objects
                .filter((object) => object.id !== left.id)
                .map((object) => (
                  <option key={object.id} value={object.id}>
                    {object.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[left, right].map((object) => (
          <section key={object.id} className="panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow">{formatCategory(object.category)}</div>
                <h2 className="mt-3 text-3xl font-semibold">{object.name}</h2>
                <p className="mt-3 text-sm text-[color:var(--muted)]">{object.summary}</p>
              </div>
              <Scale aria-hidden="true" size={20} color="var(--accent)" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="quiet-panel p-3">
                <Database aria-hidden="true" size={15} color="var(--cyan)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">{object.measurements.length} measurements</div>
              </div>
              <div className="quiet-panel p-3">
                <CircleDot aria-hidden="true" size={15} color="var(--green)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">{object.relationships.length} relationships</div>
              </div>
              <div className="quiet-panel p-3">
                <EqualNot aria-hidden="true" size={15} color="var(--violet)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">{object.sourceIds.length} sources</div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-[color:var(--border)] p-5">
          <div className="eyebrow">Measured And Estimated Properties</div>
          <h2 className="mt-2 text-2xl font-semibold">Side-by-side data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="text-left text-[color:var(--muted)]">
              <tr>
                <th className="border-b border-[color:var(--border)] p-4">Property</th>
                <th className="border-b border-[color:var(--border)] p-4">{left.name}</th>
                <th className="border-b border-[color:var(--border)] p-4">{right.name}</th>
                <th className="border-b border-[color:var(--border)] p-4">Integrity</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <td className="border-b border-[color:var(--border)] p-4 font-semibold capitalize">{row.label}</td>
                  <td className="border-b border-[color:var(--border)] p-4">{measurementValue(row.left)}</td>
                  <td className="border-b border-[color:var(--border)] p-4">{measurementValue(row.right)}</td>
                  <td className="border-b border-[color:var(--border)] p-4 text-[color:var(--muted)]">
                    {confidenceLabel(row.left)} / {confidenceLabel(row.right)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="panel p-6">
          <div className="eyebrow">Relationship Analysis</div>
          <h2 className="mt-2 text-2xl font-semibold">What connects them?</h2>
          <div className="mt-5 grid gap-4">
            <div className="quiet-panel p-4">
              <div className="tiny-label">Direct relationship</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                {directRelationship
                  ? `${left.name} is marked as ${directRelationship.kind.replaceAll("-", " ")} ${right.name}. ${directRelationship.note || ""}`
                  : reverseRelationship
                    ? `${right.name} is marked as ${reverseRelationship.kind.replaceAll("-", " ")} ${left.name}. ${reverseRelationship.note || ""}`
                    : "No direct curated relationship yet. This can become a knowledge-graph gap to fill."}
              </p>
            </div>
            <div className="quiet-panel p-4">
              <div className="tiny-label">Shared tags</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sharedTags.length ? (
                  sharedTags.map((tag) => (
                    <span key={tag} className="confidence mt-0">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[color:var(--muted)]">No shared tags in the curated record yet.</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <AssistantPanel
          objectId={left.id}
          comparisonObjectId={right.id}
          initialMode="compare"
          suggestedQuestion={`Compare ${left.name} and ${right.name}. Focus on what is measured, what is estimated, and why astronomers care.`}
        />
      </div>
    </div>
  );
}
