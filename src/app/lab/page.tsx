import type { Metadata } from "next";
import { WhatIfLab } from "@/components/lab/WhatIfLab";
import { whatIfScenarios } from "@/content/what-if-scenarios";
export const metadata: Metadata = {
  title: "What If Lab | CosmoLens",
  description:
    "Change a physical assumption and explore the consequences, with explicit model boundaries.",
};
export default function LabPage() {
  return (
    <section className="obs-page obs-container">
      <div className="obs-intro">
        <div>
          <p className="obs-kicker">02 / The experiment lab</p>
          <h1>
            Change one thing.
            <br />
            See what follows.
          </h1>
          <p>
            Four thought experiments. Adjustable models. Assumptions in plain
            sight.
          </p>
        </div>
        <span className="obs-intro-note">
          Explore a model.
          <br />
          Understand its limits.
        </span>
      </div>
      <WhatIfLab scenarios={whatIfScenarios} />
    </section>
  );
}
