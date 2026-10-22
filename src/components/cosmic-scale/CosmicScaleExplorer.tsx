"use client";

import Link from "next/link";
import { Suspense, useId } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { updateQuery } from "@/lib/navigation";
import { formatConfidence } from "@/lib/astronomy/format";
import { sourceById } from "@/content/sources";
import type { AstronomicalObject, CosmicScaleNode } from "@/types/astronomy";
import { SectionHeading, Readout } from "@/components/observatory/Primitives";

type ScaleObjectSummary = Pick<
  AstronomicalObject,
  "id" | "name" | "category" | "summary"
>;
function scientific(value: number) {
  const [mantissa, exp] = value.toExponential(1).split("e");
  return `${mantissa} × 10${Number(exp)
    .toString()
    .replace(
      /./g,
      (c) =>
        ({
          "-": "⁻",
          "0": "⁰",
          "1": "¹",
          "2": "²",
          "3": "³",
          "4": "⁴",
          "5": "⁵",
          "6": "⁶",
          "7": "⁷",
          "8": "⁸",
          "9": "⁹",
        })[c] || c,
    )}`;
}
function ScaleScene({
  active,
  previous,
}: {
  active: CosmicScaleNode;
  previous: CosmicScaleNode | null;
}) {
  const id = useId();
  const referenceSize = previous?.approximateSizeMeters || 1.2756e7;
  const referenceTitle = previous?.title || "Earth";
  const max = Math.max(active.approximateSizeMeters, referenceSize);
  const currentRadius = (65 * active.approximateSizeMeters) / max;
  const referenceRadius = (65 * referenceSize) / max;
  const body = active.visualMode === "body";
  return (
    <figure className="scale-scene" data-testid="scale-scene">
      <svg viewBox="0 0 400 240" role="img" aria-labelledby={id}>
        <title id={id}>
          {body ? "Diameter" : "Reference span"} comparison: {active.title} and{" "}
          {referenceTitle}. Sizes are proportional; marks below one pixel are
          indicated.
        </title>
        <g stroke="#263d54" strokeWidth="1">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
            <line key={x} x1={x} x2={x} y1="24" y2="212" />
          ))}
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="24" x2="376" y1={y} y2={y} />
          ))}
        </g>
        {body ? (
          <>
            <circle
              cx="122"
              cy="108"
              r={Math.max(1, currentRadius)}
              fill="#173c52"
              stroke="var(--ion)"
              strokeWidth="2"
            />
            <circle
              cx="294"
              cy="108"
              r={Math.max(1, referenceRadius)}
              fill="#443726"
              stroke="var(--solar)"
              strokeWidth="2"
            />
            <path
              d={`M ${122 - currentRadius} 188 v 6 H ${122 + currentRadius} v -6`}
              fill="none"
              stroke="var(--ion)"
              strokeWidth="2"
            />
            <path
              d={`M ${294 - referenceRadius} 188 v 6 H ${294 + referenceRadius} v -6`}
              fill="none"
              stroke="var(--solar)"
              strokeWidth="2"
            />
          </>
        ) : (
          <>
            <rect
              x="40"
              y="65"
              width="320"
              height="32"
              fill="#173c52"
              stroke="var(--ion)"
              strokeWidth="2"
            />
            <rect
              x="40"
              y="150"
              width={Math.max(
                1,
                (320 * referenceSize) / active.approximateSizeMeters,
              )}
              height="32"
              fill="#443726"
              stroke="var(--solar)"
              strokeWidth="2"
            />
            <text x="40" y="52" fill="var(--ion)" fontSize="17">
              Current reference span
            </text>
            <text x="40" y="138" fill="var(--solar)" fontSize="17">
              Previous reference span
            </text>
          </>
        )}
      </svg>
      <figcaption>
        <span>
          <strong>{active.title}</strong>
          <br />
          {body ? "Diameter comparison" : "Linear span comparison"}
        </span>
        <span>
          {referenceTitle}
          <br />
          {(body
            ? referenceRadius
            : (320 * referenceSize) / active.approximateSizeMeters) < 1
            ? "Below drawing resolution"
            : "Same linear ruler"}
        </span>
      </figcaption>
    </figure>
  );
}
function CosmicScaleContent({
  nodes,
  objects = [],
}: {
  nodes: CosmicScaleNode[];
  objects?: ScaleObjectSummary[];
}) {
  const params = useSearchParams();
  const index = Math.max(
    0,
    nodes.findIndex((node) => node.id === params.get("scale")),
  );
  const active = nodes[index],
    previous = index > 0 ? nodes[index - 1] : null;
  const setIndex = (next: number) =>
    updateQuery({
      scale: nodes[Math.max(0, Math.min(nodes.length - 1, next))].id,
    });
  const linked = active.objectIds
    .map((id) => objects.find((o) => o.id === id))
    .filter((o): o is ScaleObjectSummary => Boolean(o));
  return (
    <section
      className="obs-section obs-container"
      id="cosmic-scale"
      aria-label="Cosmic Scale Explorer"
      onKeyDown={(event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("input,textarea,select,[contenteditable=true]")
        )
          return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setIndex(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <SectionHeading
        index="01"
        eyebrow="Cosmic Scale Explorer"
        title="A change in scale. A new perspective."
      >
        <p>
          Ten reference scales, from our nearest neighbour to the structure of
          the universe.
        </p>
      </SectionHeading>
      <div className="scale-instrument">
        <div className="scale-instrument-head">
          <p className="obs-kicker">
            Scale instrument / {String(index + 1).padStart(2, "0")} of{" "}
            {nodes.length}
          </p>
          <div className="obs-actions">
            <button
              className="obs-action"
              type="button"
              aria-label="Previous scale"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              className="obs-action"
              type="button"
              aria-label="Next scale"
              disabled={index === nodes.length - 1}
              onClick={() => setIndex(index + 1)}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="scale-layout">
          <div className="scale-display">
            <ScaleScene active={active} previous={previous} />
            <div className="scale-controls">
              <label htmlFor="scale-slider">
                Scale position{" "}
                <output>
                  {String(index + 1).padStart(2, "0")} / {nodes.length}
                </output>
              </label>
              <input
                id="scale-slider"
                type="range"
                min="0"
                max={nodes.length - 1}
                step="1"
                value={index}
                aria-valuetext={active.title}
                onChange={(e) => setIndex(Number(e.target.value))}
              />
              <div className="scale-endpoints">
                <span>NEARBY WORLDS</span>
                <span>COSMIC STRUCTURE</span>
              </div>
            </div>
            <dl className="scale-readouts" data-testid="scale-readouts">
              <Readout
                label="Reference size"
                value={scientific(active.approximateSizeMeters)}
                unit="m"
              />
              <Readout
                label="From previous"
                value={
                  previous
                    ? scientific(
                        active.approximateSizeMeters /
                          previous.approximateSizeMeters,
                      )
                    : "Start"
                }
                unit={previous ? "×" : undefined}
              />
              <Readout label="Linked records" value={linked.length} />
            </dl>
          </div>
          <div className="scale-copy">
            <p className="obs-kicker">
              {active.visualMode.replaceAll("-", " ")}
            </p>
            <h3 aria-live="polite">{active.title}</h3>
            <p className="scale-subtitle">{active.subtitle}</p>
            <p>{active.context}</p>
            <div className="scale-reference">
              <p>
                {active.sizeDescription} The diagram compares reference sizes,
                not positions or distances between objects.
              </p>
              {active.measurements.map((m) => (
                <dl key={m.label}>
                  <dt>
                    {m.label} · {formatConfidence(m.confidence)}
                  </dt>
                  <dd>
                    {m.value} {m.unit}
                  </dd>
                  <dd>
                    {m.sourceIds.map((id) => {
                      const s = sourceById.get(id);
                      return s ? (
                        <a
                          key={id}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="obs-text-link"
                        >
                          Source: {s.organization} ↗
                        </a>
                      ) : null;
                    })}
                  </dd>
                </dl>
              ))}
            </div>
            <div className="scale-object-links">
              {linked.map((o) => (
                <Link key={o.id} href={`/objects/${o.id}`}>
                  {o.name} ↗
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div
          className="scale-stations"
          role="group"
          aria-label="Choose a cosmic scale"
        >
          {nodes.map((node, i) => (
            <button
              type="button"
              key={node.id}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              {node.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
export function CosmicScaleExplorer(props: {
  nodes: CosmicScaleNode[];
  objects?: ScaleObjectSummary[];
}) {
  if (!props.nodes.length)
    return <p role="status">No scale entries are available.</p>;
  return (
    <Suspense
      fallback={
        <section
          className="obs-section obs-container"
          id="cosmic-scale"
          role="status"
        >
          Loading cosmic scale…
        </section>
      }
    >
      <CosmicScaleContent {...props} />
    </Suspense>
  );
}
