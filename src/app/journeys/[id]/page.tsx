import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import { GravitationalLensingMini } from "@/components/visualizations/GravitationalLensingMini";
import { HRDiagramMini } from "@/components/visualizations/HRDiagramMini";
import { HubbleDiagramMini } from "@/components/visualizations/HubbleDiagramMini";
import { RotationCurveMini } from "@/components/visualizations/RotationCurveMini";
import {
  getJourneyById,
  getJourneys,
  getObjectById,
  getSourceById,
} from "@/lib/astronomy/catalog";
import type { GuidedJourneyStep } from "@/types/astronomy";

type JourneyPageProps = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return getJourneys().map((journey) => ({ id: journey.id }));
}
export async function generateMetadata({ params }: JourneyPageProps) {
  const journey = getJourneyById((await params).id);
  return {
    title: journey ? `${journey.title} | CosmoLens` : "Journey | CosmoLens",
    description: journey?.summary,
  };
}
function Evidence({ step }: { step: GuidedJourneyStep }) {
  return (
    <dl className="journey-evidence">
      <div>
        <dt>01 / Observation</dt>
        <dd>{step.evidence.observation}</dd>
      </div>
      <div>
        <dt>02 / Interpretation</dt>
        <dd>{step.evidence.inference}</dd>
      </div>
      <div>
        <dt>03 / What remains uncertain</dt>
        <dd>{step.evidence.limitation}</dd>
      </div>
    </dl>
  );
}
function Visualization({ step }: { step: GuidedJourneyStep }) {
  switch (step.visualization) {
    case "rotation-curve":
      return <RotationCurveMini />;
    case "lensing":
      return <GravitationalLensingMini />;
    case "hubble-diagram":
      return <HubbleDiagramMini />;
    case "hr-diagram":
      return <HRDiagramMini />;
    default:
      return (
        <div className="journey-evidence-board">
          <p className="obs-kicker">Reading the evidence</p>
          <Evidence step={step} />
        </div>
      );
  }
}
export default async function JourneyPage({ params }: JourneyPageProps) {
  const journey = getJourneyById((await params).id);
  if (!journey) notFound();
  const firstObject = journey.steps
    .flatMap((step) => step.objectIds)
    .map(getObjectById)
    .find(Boolean);
  return (
    <section className="workspace-section">
      <div className="obs-container">
        <Link href="/journeys" className="journey-back">
          ← All journeys
        </Link>
        <header className="journey-header">
          <div className="workspace-heading">
            <p className="obs-kicker">
              Guided exploration · {journey.steps.length} evidence steps
            </p>
            <h1>{journey.title}</h1>
            <p>{journey.summary}</p>
            <div className="journey-actions">
              <a
                href={`#${journey.steps[0].id}`}
                className="button button-primary"
              >
                Start journey <ArrowRight aria-hidden="true" size={16} />
              </a>
              <Link
                href={`/compare?left=${journey.comparison.left}&right=${journey.comparison.right}`}
                className="button button-ghost"
              >
                Compare related objects
              </Link>
            </div>
          </div>
          <nav aria-label="Journey map">
            <ol>
              {journey.steps.map((step, index) => (
                <li key={step.id}>
                  <a href={`#${step.id}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {step.title}
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>
        {journey.steps.map((step, index) => (
          <article key={step.id} id={step.id} className="journey-step">
            <div className="journey-step-copy">
              <p className="obs-kicker">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <h2>{step.title}</h2>
              <p>{step.summary}</p>
              {step.visualization && <Evidence step={step} />}
              <div className="journey-related">
                <p className="tiny-label">Related atlas entries</p>
                {step.objectIds
                  .map(getObjectById)
                  .filter((o): o is NonNullable<typeof o> => Boolean(o))
                  .map((object) => (
                    <Link key={object.id} href={`/objects/${object.id}`}>
                      {object.name}
                      <ArrowUpRight aria-hidden="true" size={14} />
                    </Link>
                  ))}
              </div>
            </div>
            <div className="journey-step-visual">
              <Visualization step={step} />
            </div>
          </article>
        ))}
        <section className="journey-conclusion">
          <p className="obs-kicker">What the evidence tells us</p>
          <h2>{journey.conclusion.title}</h2>
          <p>{journey.conclusion.body}</p>
          <Link
            href={`/atlas?query=${encodeURIComponent(journey.atlasQuery)}`}
            className="button button-ghost"
          >
            Continue in atlas <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </section>
        <details className="journey-sources">
          <summary>Scientific sources ({journey.sourceIds.length})</summary>
          <ul>
            {journey.sourceIds.map((id) => {
              const source = getSourceById(id);
              return source ? (
                <li key={id}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} — {source.organization}
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </details>
        <AssistantPanel
          objectId={firstObject?.id}
          initialMode="research"
          suggestedQuestion={journey.suggestedQuestion}
        />
      </div>
    </section>
  );
}
