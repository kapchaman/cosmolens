"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Atom, Brain, FlaskConical } from "lucide-react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import type { LabIntegrity, WhatIfScenario } from "@/types/lab";

const integrityLabel: Record<LabIntegrity, string> = {
  "established-physics": "established physics",
  "modeled-consequence": "modeled consequence",
  speculative: "speculative",
};

function gravityEstimate(multiplier: number) {
  return {
    fixedRadius: (9.81 * multiplier).toFixed(1),
    relative: multiplier.toFixed(2),
  };
}

export function WhatIfLab({ scenarios }: { scenarios: WhatIfScenario[] }) {
  const [selectedId, setSelectedId] = useState(scenarios[0]?.id || "");
  const selected = scenarios.find((scenario) => scenario.id === selectedId) || scenarios[0];
  const [parameterValue, setParameterValue] = useState(selected?.parameter?.initial || 1);

  const estimate = useMemo(() => gravityEstimate(parameterValue), [parameterValue]);

  if (!selected) {
    return null;
  }

  function selectScenario(id: string) {
    const next = scenarios.find((scenario) => scenario.id === id);
    setSelectedId(id);
    setParameterValue(next?.parameter?.initial || 1);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="panel h-fit p-4">
        <div className="mb-4 flex items-center gap-2">
          <FlaskConical aria-hidden="true" size={17} color="var(--accent)" />
          <h2 className="text-xl font-semibold">Scenarios</h2>
        </div>
        <div className="grid gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              className={`rounded-md border p-3 text-left transition ${
                scenario.id === selected.id
                  ? "border-[color:var(--accent)] bg-[rgba(214,168,95,0.12)]"
                  : "border-[color:var(--border)] bg-transparent hover:bg-white/[0.04]"
              }`}
              type="button"
              onClick={() => selectScenario(scenario.id)}
            >
              <span className="block text-sm font-semibold">{scenario.title}</span>
              <span className="mt-1 block text-xs text-[color:var(--muted)]">{scenario.summary}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="grid gap-6">
        <section className="panel overflow-hidden">
          <div className="grid gap-0 xl:grid-cols-[1fr_360px]">
            <div className="p-6 md:p-8">
              <div className="eyebrow">Hypothetical Simulation</div>
              <h2 className="mt-3 text-4xl font-semibold leading-tight">{selected.title}</h2>
              <p className="mt-4 max-w-3xl text-[color:var(--muted)]">{selected.summary}</p>

              <div className="mt-6 quiet-panel p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle aria-hidden="true" className="mt-1 shrink-0 text-[color:var(--accent)]" size={17} />
                  <p className="text-sm text-[color:var(--muted)]">{selected.boundary}</p>
                </div>
              </div>

              {selected.parameter ? (
                <div className="mt-6 quiet-panel p-4">
                  <label className="text-sm font-semibold" htmlFor={selected.parameter.id}>
                    {selected.parameter.label}
                  </label>
                  <input
                    id={selected.parameter.id}
                    className="mt-3 w-full accent-[color:var(--accent)]"
                    type="range"
                    min={selected.parameter.min}
                    max={selected.parameter.max}
                    step={selected.parameter.step}
                    value={parameterValue}
                    onChange={(event) => setParameterValue(Number(event.target.value))}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="confidence mt-0">
                      {parameterValue.toFixed(2)} {selected.parameter.unit}
                    </span>
                    <span className="confidence mt-0">~{estimate.fixedRadius} m/s^2 fixed-radius gravity</span>
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--muted)]">{selected.parameter.assumption}</p>
                </div>
              ) : null}
            </div>

            <div className="visual-frame min-h-[340px] rounded-none border-0">
              <div className="scale-dial" />
              <div className="signal-line" />
              <div className="absolute inset-x-5 bottom-5 quiet-panel p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Atom aria-hidden="true" size={16} color="var(--cyan)" />
                  Model boundary
                </div>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  Thought experiments are useful when assumptions stay visible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {selected.outcomes.map((outcome) => (
            <article key={outcome.label} className="panel p-5">
              <span className="confidence mt-0">{integrityLabel[outcome.integrity]}</span>
              <h3 className="mt-4 text-xl font-semibold">{outcome.label}</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">{outcome.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="panel p-6">
            <div className="flex items-center gap-2">
              <Brain aria-hidden="true" size={18} color="var(--accent)" />
              <h2 className="text-2xl font-semibold">Reasoning contract</h2>
            </div>
            <p className="mt-4 text-[color:var(--muted)]">
              Every answer should separate known physics, model assumptions, and unknowns. The point is not to make fiction sound certain; it is to expose the causal structure.
            </p>
          </div>
          <AssistantPanel key={selected.id} initialMode="explain" suggestedQuestion={selected.aiQuestion} />
        </section>
      </div>
    </div>
  );
}
