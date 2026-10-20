import type { Metadata } from "next";
import { WhatIfLab } from "@/components/lab/WhatIfLab";
import { whatIfScenarios } from "@/content/what-if-scenarios";

export const metadata: Metadata = {
  title: "What If Lab | CosmoLens",
  description: "Hypothetical astronomy scenarios with explicit model boundaries and uncertainty labels.",
};

export default function LabPage() {
  return (
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-4xl">
          <div className="eyebrow">What If Lab</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">Change the premise. Keep the uncertainty visible.</h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">
            Hypothetical scenarios for reasoning about astronomy without turning speculation into certainty.
          </p>
        </div>
        <WhatIfLab scenarios={whatIfScenarios} />
      </div>
    </section>
  );
}
