"use client";

import { useState } from "react";
import type { WhatIfScenario, LabIntegrity } from "@/types/lab";
import {
  OfflineAssistantNotice,
  Readout,
} from "@/components/observatory/Primitives";
import { RotationCurveMini } from "@/components/visualizations/RotationCurveMini";
import { ExperimentDiagram } from "./ExperimentDiagram";
import { surfaceGravity, weightNewtons } from "@/lib/lab/gravity";

const shortNames: Record<string, string> = {
  "earth-double-mass": "Earth mass",
  "moon-disappears": "Moon & tides",
  "sun-red-giant-today": "Stellar evolution",
  "milky-way-no-dark-matter": "Galaxy dynamics",
};
const integrity: Record<LabIntegrity, string> = {
  "established-physics": "Established physics",
  "modeled-consequence": "Modeled consequence",
  speculative: "Speculative",
};
export function WhatIfLab({ scenarios }: { scenarios: WhatIfScenario[] }) {
  const [selectedId, setSelectedId] = useState(scenarios[0]?.id || "");
  const selected = scenarios.find((s) => s.id === selectedId) || scenarios[0];
  const [parameterValue, setParameterValue] = useState(
    selected?.parameter?.initial || 1,
  );
  const [bodyMass, setBodyMass] = useState("75");
  const [changed, setChanged] = useState(true);
  if (!selected) return null;
  const isEarth = selected.id === "earth-double-mass",
    isMoon = selected.id === "moon-disappears",
    isGalaxy = selected.id === "milky-way-no-dark-matter";
  const g = surfaceGravity(parameterValue);
  const kg = Number(bodyMass),
    validMass =
      bodyMass.trim() !== "" && Number.isFinite(kg) && kg >= 1 && kg <= 500;
  const weight = validMass ? weightNewtons(kg, g) : null;
  const selectScenario = (id: string) => {
    const next = scenarios.find((s) => s.id === id);
    setSelectedId(id);
    setParameterValue(next?.parameter?.initial || 1);
    setChanged(true);
  };
  const description = isEarth
    ? `At ${parameterValue.toFixed(2)} times Earth's mass and the same radius, surface gravity is ${g.toFixed(2)} m/s² (${parameterValue.toFixed(2)} times the reference value). ${weight === null ? "Enter a test-body mass to calculate its weight." : `A ${kg} kg test body still has ${kg} kg of mass, but its weight is now ${weight.toFixed(1)} newtons.`}`
    : isMoon
      ? changed
        ? "The lunar contribution to tides is removed in this artificial scenario. Solar tides remain. This diagram does not predict local ocean heights."
        : "Both the Moon and the Sun contribute to tidal forcing. Local tide heights also depend on coastlines, ocean depth and timing."
      : isGalaxy
        ? "Toggle the visible-matter prediction and the dark-matter model. These schematic curves illustrate why the observed motion calls for an explanation; they are not a numerical simulation of removing matter."
        : changed
          ? "A red giant has a cooler surface but can be much more luminous because its radiating surface is larger. This illustration compresses stellar evolution; no sudden change is physically possible."
          : "The Sun is currently a main-sequence star. Core hydrogen fusion supplies energy. A red-giant phase belongs to its far future, on a timescale of billions of years.";
  const source = isEarth
    ? "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"
    : isMoon
      ? "https://science.nasa.gov/moon/"
      : isGalaxy
        ? "https://science.nasa.gov/dark-matter/"
        : "https://science.nasa.gov/exoplanets/stars/";
  return (
    <div>
      <div
        className="lab-scenarios"
        role="group"
        aria-label="Choose an experiment"
      >
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            title={s.title}
            aria-pressed={s.id === selected.id}
            onClick={() => selectScenario(s.id)}
          >
            <span>EXPERIMENT {String(i + 1).padStart(2, "0")}</span>
            <strong>{shortNames[s.id] || s.title}</strong>
          </button>
        ))}
      </div>
      <div className="lab-scenario-select">
        <label htmlFor="lab-scenario">Experiment</label>
        <select
          id="lab-scenario"
          value={selected.id}
          onChange={(e) => selectScenario(e.target.value)}
        >
          {scenarios.map((s) => (
            <option value={s.id} key={s.id}>
              {shortNames[s.id] || s.title}
            </option>
          ))}
        </select>
      </div>
      <section className="lab-instrument" aria-labelledby="experiment-title">
        <div className="lab-instrument-title">
          <div>
            <p className="obs-kicker">
              {isEarth
                ? "Newtonian gravity / fixed radius"
                : "Conceptual model / qualitative"}
            </p>
            <h2 id="experiment-title">
              {isEarth ? "Earth under a different gravity." : selected.title}
            </h2>
          </div>
          <span className="lab-status">
            {isEarth ? "MODEL OUTPUT" : "THOUGHT EXPERIMENT"}
          </span>
        </div>
        {isGalaxy ? (
          <div className="p-4 md:p-6">
            <RotationCurveMini />
          </div>
        ) : (
          <div className="lab-workspace">
            <ExperimentDiagram
              kind={selected.id}
              mass={parameterValue}
              changed={changed}
            />
            <div className="lab-controls">
              {isEarth && selected.parameter ? (
                <>
                  <div className="lab-control-label">
                    <label htmlFor={selected.parameter.id}>
                      {selected.parameter.label}
                    </label>
                    <output htmlFor={selected.parameter.id}>
                      {parameterValue.toFixed(2)} × Earth
                    </output>
                  </div>
                  <input
                    id={selected.parameter.id}
                    type="range"
                    min={selected.parameter.min}
                    max={selected.parameter.max}
                    step={selected.parameter.step}
                    value={parameterValue}
                    aria-valuetext={`${parameterValue.toFixed(2)} times Earth mass`}
                    onChange={(e) => setParameterValue(Number(e.target.value))}
                  />
                  <div className="lab-range-ends">
                    <span>1.00 × EARTH</span>
                    <span>3.00 × EARTH</span>
                  </div>
                  <p className="lab-live-acceleration" aria-live="polite">
                    Surface acceleration <strong>{g.toFixed(2)} m/s²</strong>
                  </p>
                  <div className="lab-fixed-radius">
                    <span className="obs-kicker">Held constant</span>
                    <strong>Radius: 6,371 km</strong>
                    <p>Changing mass does not change radius in this model.</p>
                  </div>
                  <details className="lab-mass-input">
                    <summary>Test-body mass: {validMass ? kg : "—"} kg</summary>
                    <label htmlFor="test-body-mass">Test-body mass</label>
                    <input
                      id="test-body-mass"
                      type="number"
                      min="1"
                      max="500"
                      step="1"
                      value={bodyMass}
                      aria-invalid={!validMass}
                      aria-describedby="body-mass-help"
                      onChange={(e) => setBodyMass(e.target.value)}
                    />
                    <span>kg</span>
                    <p id="body-mass-help" className="control-help">
                      {validMass
                        ? "Mass is the amount of matter. Weight is a force, measured in newtons."
                        : "Enter a mass between 1 and 500 kg."}
                    </p>
                  </details>
                </>
              ) : (
                <>
                  <p className="obs-kicker">Compare the premise</p>
                  <div
                    className="lab-toggle"
                    role="group"
                    aria-label="Model state"
                  >
                    <button
                      type="button"
                      aria-pressed={!changed}
                      onClick={() => setChanged(false)}
                    >
                      {isMoon ? "With Moon" : "Present Sun"}
                    </button>
                    <button
                      type="button"
                      aria-pressed={changed}
                      onClick={() => setChanged(true)}
                    >
                      {isMoon ? "Without Moon" : "Red giant"}
                    </button>
                  </div>
                  <div className="lab-concept-number">
                    {isMoon
                      ? changed
                        ? "Lunar forcing: removed"
                        : "Lunar forcing: present"
                      : changed
                        ? "Expanded, cooler surface"
                        : "Main sequence"}
                  </div>
                  <p className="control-help">
                    {isMoon
                      ? "Solar tidal forcing remains in both states. The drawing identifies contributions, not ocean heights."
                      : "The size comparison is schematic. Stellar evolution takes billions of years, not the time it takes to press this button."}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        {isEarth && (
          <>
            <dl
              className="lab-output-grid"
              aria-live="polite"
              aria-atomic="true"
            >
              <Readout
                label="Surface acceleration"
                value={g.toFixed(2)}
                unit="m/s²"
                hint="How quickly a freely falling body speeds up"
              />
              <Readout
                label="Test-body weight"
                value={weight === null ? "—" : weight.toFixed(1)}
                unit="N"
                hint="Gravitational force on the test body"
              />
              <Readout
                label="Planet mass"
                value={parameterValue.toFixed(2)}
                unit="M⊕"
                hint="Earth-mass units; radius unchanged"
              />
            </dl>
            <div className="lab-equation">
              <code>g = GM / R² · W = mg</code>
              <span>
                Reference g₀ = 9.81 m/s² · spherical, non-rotating approximation
              </span>
            </div>
          </>
        )}
      </section>
      <div className="lab-reasoning">
        <div className="lab-explanation">
          <h3>{isEarth ? "Read the result." : "What this tells us."}</h3>
          <p data-testid="lab-explanation" aria-live="polite">
            {description}
          </p>
          <div className="lab-outcomes">
            {selected.outcomes.map((outcome) => (
              <details key={outcome.label}>
                <summary>{outcome.label}</summary>
                <p>{outcome.body}</p>
                <small>{integrity[outcome.integrity]}</small>
              </details>
            ))}
          </div>
        </div>
        <aside className="lab-assumptions">
          <h3>Where the model stops.</h3>
          <p>{selected.boundary}</p>
          {isEarth && (
            <p className="mt-3">
              Holding radius fixed isolates one variable. Density must increase
              with mass. This model does not calculate a new equilibrium radius,
              atmosphere or habitability, and omits rotation and local gravity
              variation.
            </p>
          )}
          <a href={source} target="_blank" rel="noreferrer">
            Read the scientific background ↗
          </a>
        </aside>
      </div>
      <OfflineAssistantNotice />
    </div>
  );
}
