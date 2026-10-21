"use client";

import { useState } from "react";
import { Crosshair } from "lucide-react";

const stars = [
  { id: "rigel", name: "Rigel", x: 68, y: 44, color: "#91b9ff", type: "blue supergiant" },
  { id: "sirius", name: "Sirius A", x: 120, y: 92, color: "#e9f2ff", type: "main sequence" },
  { id: "sun", name: "Sun", x: 214, y: 132, color: "#f0c36f", type: "main sequence" },
  { id: "proxima", name: "Proxima Centauri", x: 430, y: 176, color: "#d87666", type: "red dwarf" },
  { id: "betelgeuse", name: "Betelgeuse", x: 390, y: 54, color: "#e48863", type: "red supergiant" },
];

export function HRDiagramMini() {
  const [selected, setSelected] = useState(stars[2]);

  return (
    <div className="panel p-5">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="eyebrow">Scientific Phenomenon</div>
          <h2 className="mt-2 text-2xl font-semibold">Hertzsprung-Russell diagram</h2>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
            A schematic map of stellar color, temperature, and luminosity used to reason about stellar evolution.
          </p>
        </div>
        <span className="confidence mt-0">schematic view</span>
      </div>

      <div className="visual-frame h-[320px] p-5">
        <svg className="h-full w-full" role="group" aria-label="Schematic Hertzsprung-Russell diagram" viewBox="0 0 520 260">
          <line x1="52" x2="482" y1="208" y2="208" stroke="rgba(255,255,255,0.28)" />
          <line x1="52" x2="52" y1="30" y2="208" stroke="rgba(255,255,255,0.28)" />
          <text x="52" y="238" fill="rgba(255,255,255,0.62)" fontSize="12">hotter stars</text>
          <text x="386" y="238" fill="rgba(255,255,255,0.62)" fontSize="12">cooler stars</text>
          <text x="6" y="28" fill="rgba(255,255,255,0.62)" fontSize="12">brighter</text>
          <path
            d="M 70 54 C 142 78, 210 112, 272 142 C 334 172, 396 190, 460 204"
            fill="none"
            stroke="rgba(121,200,214,0.42)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.4"
          />
          <ellipse cx="408" cy="58" rx="68" ry="28" fill="rgba(216,118,102,0.12)" stroke="rgba(216,118,102,0.34)" />
          {stars.map((star) => (
            <g
              key={star.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${star.name}`}
              aria-pressed={selected.id === star.id}
              className="cursor-pointer outline-none"
              onClick={() => setSelected(star)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelected(star);
                }
              }}
            >
              <circle
                cx={star.x}
                cy={star.y}
                r={selected.id === star.id ? 10 : 7}
                fill={star.color}
                stroke={selected.id === star.id ? "var(--foreground)" : "rgba(255,255,255,0.24)"}
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-5 quiet-panel p-4">
        <div className="flex items-center gap-2">
          <Crosshair aria-hidden="true" size={16} color="var(--accent)" />
          <span className="font-semibold">{selected.name}</span>
        </div>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Selected region: {selected.type}. Position is schematic and intended for concept exploration, not a calibrated catalog plot.
        </p>
      </div>
    </div>
  );
}
