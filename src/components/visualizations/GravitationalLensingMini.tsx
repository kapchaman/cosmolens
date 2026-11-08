"use client";

import { useState } from "react";
import { pointLens } from "@/lib/astronomy/lensing";

export function GravitationalLensingMini() {
  const [mass, setMass] = useState(1);
  const [offset, setOffset] = useState(0.5);
  const lens = pointLens(mass, offset);
  const scale = 62;
  return (
    <figure className="journey-instrument">
      <figcaption>
        <p className="obs-kicker">An idealized point lens</p>
        <h3>One source. Multiple images.</h3>
        <p>
          Apparent positions on the sky, viewed by an observer. This is a model,
          not a telescope image or a ray-path diagram.
        </p>
      </figcaption>
      <div className="science-chart lens-chart">
        <svg
          viewBox="0 0 440 300"
          role="img"
          aria-label={
            offset === 0
              ? `Aligned source forms an Einstein ring of radius ${lens.einsteinRadius.toFixed(2)} reference angular units`
              : `Two lensed images at ${lens.negative.toFixed(2)} and ${lens.positive.toFixed(2)} reference angular units`
          }
        >
          <line
            x1="28"
            x2="412"
            y1="150"
            y2="150"
            stroke="var(--border-strong)"
          />
          <line
            x1="220"
            x2="220"
            y1="24"
            y2="276"
            stroke="var(--border-strong)"
          />
          <circle
            cx="220"
            cy="150"
            r={lens.einsteinRadius * scale}
            stroke={offset === 0 ? "var(--cyan)" : "var(--muted-strong)"}
            strokeDasharray={offset === 0 ? undefined : "4 7"}
            strokeWidth={offset === 0 ? 4 : 1}
            fill="none"
          />
          <circle cx="220" cy="150" r="7" fill="var(--accent)" />
          <path
            d={`M ${220 + offset * scale - 7} 143 l 14 14 m 0 -14 l -14 14`}
            stroke="var(--foreground)"
            strokeWidth="2"
          />
          {offset !== 0 && (
            <>
              <circle
                cx={220 + lens.positive * scale}
                cy="150"
                r="8"
                fill="var(--cyan)"
              />
              <circle
                cx={220 + lens.negative * scale}
                cy="150"
                r="8"
                fill="var(--cyan)"
              />
            </>
          )}
        </svg>
        <ul className="instrument-legend">
          <li>
            <span className="legend-gold">●</span> Lens center
          </li>
          <li>
            <span>×</span> Unlensed source position
          </li>
          <li>
            <span className="legend-cyan">● / ○</span> Images / aligned ring
          </li>
          <li>Dashed circle: Einstein radius</li>
        </ul>
      </div>
      <div className="instrument-controls">
        <label>
          Lens mass <output>{mass.toFixed(2)} × M₀</output>
          <input
            aria-label="Lens mass"
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={mass}
            onChange={(event) => setMass(Number(event.target.value))}
          />
        </label>
        <label>
          Source offset <output>{offset.toFixed(2)} θE₀</output>
          <input
            aria-label="Source offset"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={offset}
            onChange={(event) => setOffset(Number(event.target.value))}
          />
        </label>
      </div>
      <p className="instrument-reading" aria-live="polite">
        {offset === 0
          ? `Exact alignment: a ring with radius ${lens.einsteinRadius.toFixed(2)} θE₀.`
          : `Image positions: ${lens.negative.toFixed(2)} and +${lens.positive.toFixed(2)} θE₀ relative to the lens.`}
      </p>
      <details className="instrument-assumptions">
        <summary>Model assumptions</summary>
        <p>
          Fixed distances, a point source and an isolated point mass. θE₀ is the
          angular Einstein radius at mass M₀; θE = √(M/M₀) θE₀. Image positions
          solve β = θ − (M/M₀)/θ in these units. Marker sizes do not represent
          brightness, mass radius or magnification. Real cluster lenses need
          extended mass models.
        </p>
        <a
          href="https://astronomy.swin.edu.au/cosmos/S/Schwarzschild+Lens"
          target="_blank"
          rel="noreferrer"
        >
          Swinburne Astronomy: point-lens equations
        </a>
      </details>
    </figure>
  );
}
