"use client";

import { useState } from "react";
const distances = [18, 42, 78, 118, 156, 194];
const x = (distance: number) => 24 + distance * 2.2;
const y = (velocity: number) => 220 - velocity / 75;

export function HubbleDiagramMini() {
  const [showTrend, setShowTrend] = useState(true);
  const [scatter, setScatter] = useState(500);
  return (
    <figure className="journey-instrument">
      <figcaption>
        <p className="obs-kicker">Synthetic experiment</p>
        <h3>The distance–velocity relation</h3>
        <p>
          Six invented points illustrate a low-redshift expansion trend. These
          are not survey observations or an estimate of today’s Hubble constant.
        </p>
      </figcaption>
      <div className="science-chart">
        <p className="science-axis">Recession velocity ↑ · km/s</p>
        <div className="calibrated-plot">
          <div className="plot-area">
            <div className="plot-y-ticks">
              <span>15,000</span>
              <span>7,500</span>
              <span>0</span>
            </div>
            <svg
              role="img"
              aria-label={`Synthetic distance–velocity diagram, illustrative scatter plus or minus ${scatter} kilometers per second`}
              viewBox="0 0 480 240"
            >
              {[0, 7500, 15000].map((v) => (
                <line
                  key={v}
                  x1="24"
                  x2="464"
                  y1={y(v)}
                  y2={y(v)}
                  stroke="var(--border-strong)"
                />
              ))}
              <line
                x1="24"
                x2="24"
                y1="20"
                y2="220"
                stroke="var(--muted-strong)"
              />
              {showTrend && (
                <path
                  d={`M ${x(0)} ${y(0)} L ${x(200)} ${y(14000)}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
              )}
              {distances.map((distance, index) => (
                <circle
                  key={distance}
                  cx={x(distance)}
                  cy={y(70 * distance + (index % 2 ? -scatter : scatter))}
                  r="6"
                  fill="var(--cyan)"
                />
              ))}
            </svg>
          </div>
          <div className="plot-x-ticks">
            <span>0</span>
            <span>100</span>
            <span>200</span>
          </div>
        </div>
        <p className="science-axis science-axis-x">Distance → · Mpc</p>
        <ul className="instrument-legend">
          <li>
            <span className="legend-cyan">●</span> Synthetic points
          </li>
          <li>
            <span className="legend-gold">┄</span> v = H₀d, H₀ = 70 km/s/Mpc
            (illustrative)
          </li>
        </ul>
      </div>
      <div className="instrument-controls">
        <label>
          Illustrative scatter <output>±{scatter} km/s</output>
          <input
            aria-label="Illustrative scatter"
            type="range"
            min="0"
            max="1000"
            step="50"
            value={scatter}
            onChange={(event) => setScatter(Number(event.target.value))}
          />
        </label>
        <button
          className="button button-ghost"
          type="button"
          aria-pressed={showTrend}
          onClick={() => setShowTrend((value) => !value)}
        >
          Expansion trend {showTrend ? "on" : "off"}
        </button>
      </div>
      <p className="instrument-reading" aria-live="polite">
        At 100 Mpc, this chosen trend gives 7,000 km/s. Changing scatter moves
        the points, not the trend.
      </p>
      <p className="instrument-limit">
        The alternating offsets are a teaching device, not error bars or
        measured peculiar velocities. Calibrated distances and cosmological
        models are needed to infer expansion history.
      </p>
    </figure>
  );
}
