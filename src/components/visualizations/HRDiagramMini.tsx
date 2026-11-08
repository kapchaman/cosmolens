"use client";

import { useState } from "react";
import { Crosshair } from "lucide-react";

const stars = [
  {
    id: "rigel",
    name: "Rigel",
    x: 68,
    y: 44,
    color: "#91b9ff",
    type: "blue supergiant",
  },
  {
    id: "sirius",
    name: "Sirius A",
    x: 120,
    y: 92,
    color: "#e9f2ff",
    type: "main sequence",
  },
  {
    id: "sun",
    name: "Sun",
    x: 214,
    y: 132,
    color: "#f0c36f",
    type: "main sequence",
  },
  {
    id: "proxima",
    name: "Proxima Centauri",
    x: 430,
    y: 190,
    color: "#d87666",
    type: "red dwarf",
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    x: 390,
    y: 54,
    color: "#e48863",
    type: "red supergiant",
  },
];

export function HRDiagramMini() {
  const [selected, setSelected] = useState(stars[2]);

  return (
    <div className="journey-instrument">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="eyebrow">Scientific Phenomenon</div>
          <h3 className="mt-2 text-2xl font-semibold">
            Hertzsprung-Russell diagram
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
            A schematic map of stellar color, temperature, and luminosity used
            to reason about stellar evolution.
          </p>
        </div>
        <span className="confidence mt-0">schematic view</span>
      </div>

      <div className="science-chart">
        <p className="science-axis">Luminosity ↑ · brighter at the top</p>
        <svg
          role="img"
          aria-label={`Schematic HR diagram. ${selected.name} selected; ${selected.type}. Temperature decreases to the right.`}
          viewBox="0 0 520 230"
        >
          <line
            x1="52"
            x2="482"
            y1="208"
            y2="208"
            stroke="var(--muted-strong)"
          />
          <line x1="52" x2="52" y1="30" y2="208" stroke="var(--muted-strong)" />
          <path
            d="M 70 70 Q 94 80, 120 92 T 214 132 Q 320 168, 430 190 T 460 204"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="14"
            opacity="0.18"
          />
          {stars.map((star) => (
            <g key={star.id}>
              <circle cx={star.x} cy={star.y} r="7" fill={star.color} />
              {selected.id === star.id && (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r="14"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                />
              )}
            </g>
          ))}
        </svg>
        <div className="instrument-axis-pair">
          <span>Hotter ←</span>
          <span>Temperature</span>
          <span>→ Cooler</span>
        </div>
        <p className="instrument-limit">
          Shaded band: main sequence. A star’s position is schematic; this is
          not an evolutionary track or a calibrated catalog plot.
        </p>
      </div>
      <div
        className="instrument-star-controls"
        role="group"
        aria-label="Select a star"
      >
        {stars.map((star) => (
          <button
            key={star.id}
            type="button"
            className={`button ${selected.id === star.id ? "button-primary" : "button-ghost"}`}
            aria-label={`Select ${star.name}`}
            aria-pressed={selected.id === star.id}
            onClick={() => setSelected(star)}
          >
            {star.name}
          </button>
        ))}
      </div>

      <div className="mt-5 quiet-panel p-4" aria-live="polite">
        <div className="flex items-center gap-2">
          <Crosshair aria-hidden="true" size={16} color="var(--accent)" />
          <span className="font-semibold">{selected.name}</span>
        </div>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Selected region: {selected.type}. Position is schematic and intended
          for concept exploration, not a calibrated catalog plot.
        </p>
      </div>
    </div>
  );
}
