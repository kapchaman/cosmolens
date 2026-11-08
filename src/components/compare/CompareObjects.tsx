"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import type { AstronomicalObject, Measurement } from "@/types/astronomy";
import type { ScientificSource } from "@/types/sources";
import { formatCategory, formatConfidence } from "@/lib/astronomy/format";
import { comparisonRows } from "@/lib/astronomy/comparison";

function Value({
  measurement,
  sources,
}: {
  measurement?: Measurement;
  sources: ScientificSource[];
}) {
  if (!measurement)
    return <p className="comparison-missing">Not in curated record</p>;
  return (
    <>
      <p className="comparison-value">
        {measurement.value}
        {measurement.unit && (
          <>
            {" "}
            <span>{measurement.unit}</span>
          </>
        )}
      </p>
      <p className="comparison-qualifier">
        {measurement.label} · {formatConfidence(measurement.confidence)}
      </p>
      <details className="comparison-sources">
        <summary>Sources &amp; context</summary>
        {measurement.note && <p>{measurement.note}</p>}
        <ul>
          {measurement.sourceIds.map((id) => {
            const source = sources.find((item) => item.id === id);
            return source ? (
              <li key={id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title} — {source.organization}
                </a>
              </li>
            ) : null;
          })}
        </ul>
      </details>
    </>
  );
}

export function CompareObjects({
  objects,
  sources,
  initialLeft,
  initialRight,
}: {
  objects: AstronomicalObject[];
  sources: ScientificSource[];
  initialLeft?: string;
  initialRight?: string;
}) {
  const [leftId, setLeftId] = useState(initialLeft || "andromeda");
  const [rightId, setRightId] = useState(initialRight || "milky-way");
  const left = objects.find((object) => object.id === leftId) || objects[0];
  const right =
    objects.find((object) => object.id === rightId && object.id !== left.id) ||
    objects.find((object) => object.id !== left.id) ||
    objects[0];
  const rows = comparisonRows(left.measurements, right.measurements);
  const shared = rows.filter((row) => row.left && row.right).length;
  const sharedTags = left.tags.filter((tag) => right.tags.includes(tag));
  const relationship = left.relationships.find(
    (item) => item.targetId === right.id,
  );
  const reverse = right.relationships.find((item) => item.targetId === left.id);

  return (
    <div className="comparison-workspace">
      <div className="comparison-selectors">
        <label>
          <span className="tiny-label">Primary object</span>
          <select
            value={left.id}
            onChange={(event) => setLeftId(event.target.value)}
          >
            {objects.map((object) => (
              <option key={object.id} value={object.id}>
                {object.name}
              </option>
            ))}
          </select>
        </label>
        <ArrowLeftRight aria-hidden="true" size={20} />
        <label>
          <span className="tiny-label">Comparison object</span>
          <select
            value={right.id}
            onChange={(event) => setRightId(event.target.value)}
          >
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

      <section aria-labelledby="comparison-title" className="comparison-data">
        <div className="comparison-heading">
          <h2 id="comparison-title">Side-by-side data</h2>
          <span>
            {shared} shared {shared === 1 ? "property" : "properties"}
          </span>
        </div>
        <p id="comparison-help" className="comparison-help">
          Values retain their source definitions. Missing data is unknown, never
          zero. Radius and diameter stay separate; no automatic unit conversion.
        </p>
        <table className="comparison-table" aria-describedby="comparison-help">
          <caption className="sr-only">
            Scientific properties of {left.name} and {right.name}
          </caption>
          <colgroup>
            <col className="comparison-property-column" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">
                <Link href={`/objects/${left.id}`}>
                  {left.name}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
              </th>
              <th scope="col">
                <Link href={`/objects/${right.id}`}>
                  {right.name}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.label}-${index}`}>
                <th scope="row">{row.label}</th>
                <td>
                  <Value measurement={row.left} sources={sources} />
                </td>
                <td>
                  <Value measurement={row.right} sources={sources} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!shared && (
          <p className="comparison-help">
            These records have no shared measurement fields. Explore their
            source context below.
          </p>
        )}
      </section>

      <div className="comparison-context">
        {[left, right].map((object) => (
          <article key={object.id}>
            <p className="obs-kicker">{formatCategory(object.category)}</p>
            <h2>
              <Link href={`/objects/${object.id}`}>
                {object.name} <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </h2>
            <p>{object.summary}</p>
            <p className="comparison-qualifier">
              {object.measurements.length} measurements ·{" "}
              {object.relationships.length} relationships ·{" "}
              {object.sourceIds.length} sources
            </p>
          </article>
        ))}
      </div>
      <section className="comparison-relationships">
        <p className="obs-kicker">Relationship analysis</p>
        <h2>What connects them?</h2>
        <p>
          {relationship
            ? `${left.name} is marked as ${relationship.kind.replaceAll("-", " ")} ${right.name}. ${relationship.note || ""}`
            : reverse
              ? `${right.name} is marked as ${reverse.kind.replaceAll("-", " ")} ${left.name}. ${reverse.note || ""}`
              : "No direct relationship is recorded in this curated catalog."}
        </p>
        <p className="comparison-qualifier">
          Shared tags:{" "}
          {sharedTags.length ? sharedTags.join(" · ") : "none in this record"}
        </p>
      </section>
      <AssistantPanel
        objectId={left.id}
        comparisonObjectId={right.id}
        initialMode="compare"
        suggestedQuestion={`Compare ${left.name} and ${right.name}. Focus on what is measured, what is estimated, and why astronomers care.`}
      />
    </div>
  );
}
