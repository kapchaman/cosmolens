import type { Metadata } from "next";
import { ObservationPlanner } from "@/components/observation/ObservationPlanner";
import { observationTargets } from "@/content/observation-targets";

export const metadata: Metadata = {
  title: "Observation Mode | CosmoLens",
  description: "A privacy-first seasonal observing planner with explicit ephemeris boundaries.",
};

export default function ObservePage() {
  return (
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-4xl">
          <div className="eyebrow">Observation Mode</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Plan the sky without exposing your exact location.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">
            A seasonal, privacy-first observing planner. Precise planet visibility is clearly separated until ephemeris data is integrated.
          </p>
        </div>
        <ObservationPlanner targets={observationTargets} />
      </div>
    </section>
  );
}
