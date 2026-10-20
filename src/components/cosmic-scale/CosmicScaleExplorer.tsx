"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Database, Maximize2, Ruler } from "lucide-react";
import type { AstronomicalObject, CosmicScaleNode } from "@/types/astronomy";
import { formatConfidence } from "@/lib/astronomy/format";

type ScaleObjectSummary = Pick<AstronomicalObject, "id" | "name" | "category" | "summary">;

function formatPowerOfTen(value: number) {
  const exponent = Math.floor(Math.log10(value));
  return `10^${exponent} m`;
}

function formatScaleJump(value: number) {
  if (value < 1000) {
    return `${value.toFixed(1)}x`;
  }

  const exponent = Math.floor(Math.log10(value));
  return `~10^${exponent}x`;
}

function VisualSystem({ mode, order }: { mode: CosmicScaleNode["visualMode"]; order: number }) {
  const density = Math.min(9, Math.max(3, order));
  const marks = Array.from({ length: density * 3 }, (_, index) => index);

  return (
    <div className={`relative h-full min-h-[340px] overflow-hidden scale-mode-${mode}`}>
      <div className="scale-dial" />
      <div className="signal-line" />
      <div className="absolute inset-0">
        {marks.map((mark) => {
          const left = (mark * 31 + order * 11) % 100;
          const top = (mark * 47 + order * 7) % 100;
          const size = mode === "cosmic-web" ? 2 + (mark % 4) : 2 + (mark % 3);

          return (
            <span
              key={mark}
              className="absolute rounded-full bg-white/55"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                opacity: mode === "body" ? 0.18 : 0.36,
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-[18%] flex items-center justify-center">
        <div
          className="rounded-full border border-[rgba(214,168,95,0.58)] bg-[rgba(214,168,95,0.13)]"
          style={{
            width: `${Math.min(76, 18 + order * 5)}%`,
            aspectRatio: "1 / 1",
            boxShadow: "inset 0 0 48px rgba(214,168,95,0.1)",
          }}
        />
      </div>
      {mode === "galaxy" || mode === "galaxy-group" || mode === "cluster" ? (
        <div className="absolute left-1/2 top-1/2 h-[20%] w-[82%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full border border-[rgba(121,200,214,0.34)] bg-[rgba(121,200,214,0.06)]" />
      ) : null}
      {mode === "cosmic-web" ? (
        <div className="absolute inset-10 opacity-80">
          <div className="absolute left-[12%] top-[32%] h-px w-[68%] rotate-12 bg-[rgba(121,200,214,0.36)]" />
          <div className="absolute left-[25%] top-[18%] h-px w-[54%] rotate-[58deg] bg-[rgba(214,168,95,0.32)]" />
          <div className="absolute left-[7%] top-[70%] h-px w-[76%] rotate-[-24deg] bg-[rgba(136,184,138,0.32)]" />
        </div>
      ) : null}
    </div>
  );
}

export function CosmicScaleExplorer({
  nodes,
  objects = [],
}: {
  nodes: CosmicScaleNode[];
  objects?: ScaleObjectSummary[];
}) {
  const [index, setIndex] = useState(0);
  const active = nodes[index];
  const progress = useMemo(() => ((index + 1) / nodes.length) * 100, [index, nodes.length]);
  const objectById = useMemo(() => new Map(objects.map((object) => [object.id, object])), [objects]);
  const activeObjects = active.objectIds.map((id) => objectById.get(id)).filter((object): object is ScaleObjectSummary => Boolean(object));
  const previousNode = index > 0 ? nodes[index - 1] : null;
  const scaleJump = previousNode ? active.approximateSizeMeters / previousNode.approximateSizeMeters : null;

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === "ArrowRight") {
        setIndex((value) => Math.min(nodes.length - 1, value + 1));
      }

      if (event.key === "ArrowLeft") {
        setIndex((value) => Math.max(0, value - 1));
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [nodes.length]);

  return (
    <section className="section" id="cosmic-scale">
      <div className="app-container">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Cosmic Scale</div>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Move from nearby worlds to large-scale structure.
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="button button-ghost size-10 p-0"
              type="button"
              aria-label="Previous scale"
              disabled={index === 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
            >
              <ArrowLeft aria-hidden="true" size={17} />
            </button>
            <button
              className="button button-ghost size-10 p-0"
              type="button"
              aria-label="Next scale"
              disabled={index === nodes.length - 1}
              onClick={() => setIndex((value) => Math.min(nodes.length - 1, value + 1))}
            >
              <ArrowRight aria-hidden="true" size={17} />
            </button>
          </div>
        </div>

        <div className="panel grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <div className="visual-frame min-h-[420px] rounded-none border-0">
            <VisualSystem mode={active.visualMode} order={active.order} />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/30 px-3 py-2 text-sm text-[color:var(--muted)] backdrop-blur">
              <Maximize2 aria-hidden="true" size={15} />
              {active.visualMode.replaceAll("-", " ")}
            </div>
            <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
              <div className="quiet-panel p-3">
                <Ruler aria-hidden="true" size={15} color="var(--accent)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">order of magnitude</div>
                <div className="mt-1 font-mono text-sm">{formatPowerOfTen(active.approximateSizeMeters)}</div>
              </div>
              <div className="quiet-panel p-3">
                <Maximize2 aria-hidden="true" size={15} color="var(--cyan)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">jump from previous</div>
                <div className="mt-1 font-mono text-sm">{scaleJump ? formatScaleJump(scaleJump) : "origin"}</div>
              </div>
              <div className="quiet-panel p-3">
                <Database aria-hidden="true" size={15} color="var(--green)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">linked entries</div>
                <div className="mt-1 font-mono text-sm">{activeObjects.length}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
            <div>
              <div className="tiny-label">
                {String(index + 1).padStart(2, "0")} / {String(nodes.length).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-3xl font-semibold">{active.title}</h3>
              <p className="mt-2 text-[color:var(--muted)]">{active.subtitle}</p>
              <p className="mt-6 text-base text-[color:var(--muted)]">{active.context}</p>
              {activeObjects.length ? (
                <div className="mt-5">
                  <div className="tiny-label">Explore this scale</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeObjects.map((object) => (
                      <Link key={object.id} href={`/objects/${object.id}`} className="confidence mt-0 hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]">
                        {object.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-6 grid gap-3">
                {active.measurements.map((measurement) => (
                  <div key={measurement.label} className="quiet-panel p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-sm text-[color:var(--muted)]">{measurement.label}</span>
                        <span className="mt-1 block text-lg font-semibold">
                          {measurement.value}
                          {measurement.unit ? ` ${measurement.unit}` : ""}
                        </span>
                      </span>
                      <span className="confidence mt-0">{formatConfidence(measurement.confidence)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="tiny-label" htmlFor="scale-slider">
                Scale position
              </label>
              <input
                id="scale-slider"
                className="mt-3 w-full accent-[color:var(--accent)]"
                type="range"
                min={0}
                max={nodes.length - 1}
                value={index}
                onChange={(event) => setIndex(Number(event.target.value))}
              />
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[color:var(--muted)] sm:grid-cols-5">
                {nodes.map((node, nodeIndex) => (
                  <button
                    key={node.id}
                    className={`rounded-md border px-2 py-2 text-left transition ${
                      nodeIndex === index
                        ? "border-[color:var(--accent)] bg-[rgba(214,168,95,0.12)] text-[color:var(--foreground)]"
                        : "border-[color:var(--border)] bg-transparent"
                    }`}
                    type="button"
                    onClick={() => setIndex(nodeIndex)}
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
