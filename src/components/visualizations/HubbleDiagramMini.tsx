"use client";

import { useMemo, useState } from "react";
import { Activity, Eye, EyeOff } from "lucide-react";

const points = [
  { distance: 18, velocity: 1220, label: "nearby group" },
  { distance: 42, velocity: 3050, label: "galaxy sample" },
  { distance: 78, velocity: 5200, label: "cluster field" },
  { distance: 118, velocity: 8500, label: "distant cluster" },
  { distance: 156, velocity: 11200, label: "deep field" },
  { distance: 194, velocity: 13700, label: "survey point" },
];

function x(distance: number) {
  return 44 + distance * 2.2;
}

function y(velocity: number) {
  return 196 - velocity * 0.011;
}

export function HubbleDiagramMini() {
  const [showTrend, setShowTrend] = useState(true);
  const [scatter, setScatter] = useState(28);

  const plotted = useMemo(
    () =>
      points.map((point, index) => ({
        ...point,
        y: y(point.velocity + ((index % 2 === 0 ? 1 : -1) * scatter * 32)),
      })),
    [scatter],
  );

  return (
    <div className="panel p-5">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="eyebrow">Scientific Phenomenon</div>
          <h2 className="mt-2 text-2xl font-semibold">Hubble-Lemaitre diagram</h2>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
            A schematic relationship between distance and recession velocity. Real surveys require calibration and uncertainty analysis.
          </p>
        </div>
        <button className="button button-ghost min-h-9 px-3 text-sm" type="button" onClick={() => setShowTrend((value) => !value)}>
          {showTrend ? <Eye aria-hidden="true" size={15} /> : <EyeOff aria-hidden="true" size={15} />}
          Expansion trend
        </button>
      </div>

      <div className="visual-frame h-[300px] p-5">
        <svg className="h-full w-full" role="img" aria-label="Conceptual Hubble diagram" viewBox="0 0 520 240">
          <line x1="44" x2="486" y1="196" y2="196" stroke="rgba(255,255,255,0.28)" />
          <line x1="44" x2="44" y1="28" y2="196" stroke="rgba(255,255,255,0.28)" />
          <text x="44" y="224" fill="rgba(255,255,255,0.62)" fontSize="12">distance</text>
          <text x="0" y="24" fill="rgba(255,255,255,0.62)" fontSize="12">recession velocity</text>
          {showTrend ? (
            <path d="M 54 186 L 474 42" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="9 8" />
          ) : null}
          {plotted.map((point) => (
            <g key={point.label}>
              <circle cx={x(point.distance)} cy={point.y} r="6" fill="var(--cyan)" opacity="0.9" />
              <circle cx={x(point.distance)} cy={point.y} r="14" fill="none" stroke="rgba(121,200,214,0.16)" />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <label className="quiet-panel p-4">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Activity aria-hidden="true" size={15} color="var(--cyan)" />
            Measurement scatter
          </span>
          <input
            className="mt-3 w-full accent-[color:var(--cyan)]"
            type="range"
            min="0"
            max="60"
            value={scatter}
            onChange={(event) => setScatter(Number(event.target.value))}
          />
        </label>
        <div className="quiet-panel p-4 text-sm text-[color:var(--muted)]">
          The positive trend is evidence for expansion, but interpreting the expansion history requires additional observations and cosmological models.
        </div>
      </div>
    </div>
  );
}
