import Link from "next/link";
import { getJourneys } from "@/lib/astronomy/catalog";

export const metadata = {
  title: "Journeys | CosmoLens",
};

export default function JourneysPage() {
  const journeys = getJourneys();

  return (
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-3xl">
          <div className="eyebrow">Guided Explorations</div>
          <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-6xl">Learn through evidence chains.</h1>
          <p className="mt-5 text-[color:var(--muted)]">
            Journeys connect observations, visualizations, and scientific interpretation into structured explorations.
          </p>
        </div>

        <div className="grid gap-5">
          {journeys.map((journey) => (
            <article key={journey.id} className="panel p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="eyebrow">{journey.status}</div>
                  <h2 className="mt-3 text-3xl font-semibold">{journey.title}</h2>
                  <p className="mt-3 max-w-3xl text-[color:var(--muted)]">{journey.summary}</p>
                </div>
                <Link className="button button-ghost" href={`/journeys/${journey.id}`}>
                  Open journey
                </Link>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {journey.steps.map((step, index) => (
                  <div key={step.id} className="quiet-panel p-4">
                    <div className="font-mono text-sm text-[color:var(--accent)]">{String(index + 1).padStart(2, "0")}</div>
                    <h3 className="mt-3 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">{step.summary}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
