"use client";
import { useId } from "react";
export function ExperimentDiagram({
  kind,
  mass = 2,
  changed = true,
}: {
  kind: string;
  mass?: number;
  changed?: boolean;
}) {
  const id = useId(),
    arrow = `${id}-arrow`;
  const earth = kind === "earth-double-mass",
    moon = kind === "moon-disappears";
  return (
    <figure className="lab-visual">
      <div className="lab-visual-legend">
        <span>
          {earth
            ? "FIXED RADIUS / VARIABLE MASS"
            : moon
              ? "EARTH · MOON · SUN"
              : "STELLAR EVOLUTION"}
        </span>
        <strong>
          {earth
            ? `${mass.toFixed(2)} M⊕`
            : changed
              ? "CHANGED PREMISE"
              : "REFERENCE STATE"}
        </strong>
      </div>
      <svg viewBox="0 0 480 280" role="img" aria-labelledby={id}>
        <title id={id}>
          {earth
            ? `Earth at ${mass.toFixed(2)} times its mass, with an unchanged radius. Acceleration arrows grow with mass.`
            : moon
              ? `Schematic Earth-Moon-Sun system, with the lunar contribution ${changed ? "removed" : "present"}. Not to scale.`
              : `The Sun ${changed ? "as an illustrative expanded red giant" : "on the main sequence"}. Sizes are schematic, not a prediction.`}
        </title>
        <defs>
          <marker
            id={arrow}
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7" fill="var(--ion)" />
          </marker>
        </defs>
        {earth ? (
          <>
            <line
              x1="32"
              x2="448"
              y1="144"
              y2="144"
              stroke="#263d54"
              strokeDasharray="4 6"
            />
            <line
              x1="240"
              x2="240"
              y1="20"
              y2="260"
              stroke="#263d54"
              strokeDasharray="4 6"
            />
            <circle
              cx="240"
              cy="140"
              r="78"
              fill="#173c52"
              stroke="var(--ion)"
              strokeWidth="2"
            />
            <path
              d="M180 117 l20 -22 22 8 9 24 -17 18 6 28 -19 4 -19 -28z M250 78 l28 8 19 33 -16 21 7 30 -22 23 -17 -42 12 -22 -17 -22z"
              fill="#477369"
            />
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a} 240 140)`}>
                <line
                  x1={329 + mass * 18}
                  x2="329"
                  y1="140"
                  y2="140"
                  stroke="var(--ion)"
                  strokeWidth="2.5"
                  markerEnd={`url(#${arrow})`}
                />
              </g>
            ))}
            <line
              x1="240"
              x2="318"
              y1="140"
              y2="140"
              stroke="var(--solar)"
              strokeWidth="2"
            />
            <circle cx="240" cy="140" r="3" fill="var(--solar)" />
            <text x="267" y="130" fill="var(--solar)" fontSize="18">
              R
            </text>

            <text
              x="240"
              y="274"
              fill="var(--muted)"
              fontSize="17"
              textAnchor="middle"
            >
              Radius held at 6,371 km
            </text>
          </>
        ) : moon ? (
          <>
            <circle
              cx="80"
              cy="140"
              r="44"
              fill="#7d5324"
              stroke="var(--solar)"
              strokeWidth="2"
            />
            <text
              x="80"
              y="210"
              fill="var(--solar)"
              textAnchor="middle"
              fontSize="18"
            >
              Sun
            </text>
            <circle
              cx="272"
              cy="140"
              r="35"
              fill="#173c52"
              stroke="var(--ion)"
              strokeWidth="2"
            />
            <text
              x="272"
              y="210"
              fill="var(--ion)"
              textAnchor="middle"
              fontSize="18"
            >
              Earth
            </text>
            <line
              x1="130"
              y1="140"
              x2="227"
              y2="140"
              stroke="var(--solar)"
              strokeWidth="3"
            />
            <circle
              cx="414"
              cy="90"
              r="18"
              fill={changed ? "none" : "#82909c"}
              stroke="var(--muted)"
              strokeDasharray={changed ? "4 5" : undefined}
            />
            {!changed && (
              <line
                x1="313"
                y1="123"
                x2="389"
                y2="99"
                stroke="var(--ion)"
                strokeWidth="3"
              />
            )}
            <text
              x="414"
              y="136"
              fill="var(--muted)"
              textAnchor="middle"
              fontSize="17"
            >
              {changed ? "Removed" : "Moon"}
            </text>
          </>
        ) : (
          <>
            <circle cx="124" cy="140" r="23" fill="#e2b76f" />
            <text
              x="124"
              y="250"
              fill="var(--muted)"
              textAnchor="middle"
              fontSize="18"
            >
              Main sequence
            </text>
            <line
              x1="177"
              y1="140"
              x2="220"
              y2="140"
              stroke="var(--ion)"
              strokeWidth="2"
              markerEnd={`url(#${arrow})`}
            />
            <circle
              cx="336"
              cy="140"
              r={changed ? 79 : 23}
              fill={changed ? "#c76c4f" : "#e2b76f"}
            />
            <text
              x="336"
              y="250"
              fill="var(--muted)"
              textAnchor="middle"
              fontSize="18"
            >
              {changed ? "Red giant" : "Reference Sun"}
            </text>
          </>
        )}
      </svg>
      <figcaption>
        {earth
          ? "Schematic Earth. Arrow length encodes acceleration; the planet does not grow. Surface texture is illustrative."
          : moon
            ? "Connections identify the sources of tidal forcing. Distances, body sizes and line widths are not quantitative."
            : "A conceptual comparison of stellar stages. Radius, colour and spacing are illustrative; the Sun cannot transform suddenly."}
      </figcaption>
    </figure>
  );
}
