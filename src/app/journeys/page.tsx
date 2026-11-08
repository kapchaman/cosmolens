import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getJourneys } from "@/lib/astronomy/catalog";
export const metadata = { title: "Journeys | CosmoLens" };
export default function JourneysPage() {
  return (
    <section className="workspace-section">
      <div className="obs-container">
        <header className="workspace-heading">
          <p className="obs-kicker">Guided explorations</p>
          <h1>Follow the evidence.</h1>
          <p>
            From a puzzling observation to a scientific explanation. Three
            routes through the questions that shape astronomy.
          </p>
        </header>
        <div className="journey-directory">
          {getJourneys().map((journey, index) => (
            <article key={journey.id}>
              <span className="journey-number">0{index + 1}</span>
              <div>
                <h2>
                  <Link href={`/journeys/${journey.id}`}>{journey.title}</Link>
                </h2>
                <p>{journey.summary}</p>
                <details>
                  <summary>
                    Explore {journey.steps.length} evidence steps
                  </summary>
                  <ol>
                    {journey.steps.map((step) => (
                      <li key={step.id}>
                        <Link href={`/journeys/${journey.id}#${step.id}`}>
                          {step.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
              <Link
                className="button button-primary"
                href={`/journeys/${journey.id}`}
                aria-label={`Open journey: ${journey.title}`}
              >
                Open journey <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
