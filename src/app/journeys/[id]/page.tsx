import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Database, Route } from "lucide-react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import { GravitationalLensingMini } from "@/components/visualizations/GravitationalLensingMini";
import { HRDiagramMini } from "@/components/visualizations/HRDiagramMini";
import { HubbleDiagramMini } from "@/components/visualizations/HubbleDiagramMini";
import { RotationCurveMini } from "@/components/visualizations/RotationCurveMini";
import { getJourneyById, getJourneys, getObjectById, getSourceById } from "@/lib/astronomy/catalog";
import type { GuidedJourneyStep } from "@/types/astronomy";

type JourneyPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export function generateStaticParams() {
  return getJourneys().map((journey) => ({ id: journey.id }));
}

function JourneyVisualization({ step }: { step: GuidedJourneyStep }) {
  if (step.visualization === "rotation-curve") {
    return <RotationCurveMini />;
  }

  if (step.visualization === "lensing") {
    return <GravitationalLensingMini />;
  }

  if (step.visualization === "hubble-diagram") {
    return <HubbleDiagramMini />;
  }

  if (step.visualization === "hr-diagram") {
    return <HRDiagramMini />;
  }

  return (
    <div className="visual-frame min-h-[320px] p-5">
      <div className="scale-dial" />
      <div className="signal-line" />
      <div className="absolute inset-x-5 bottom-5 quiet-panel p-4">
        <div className="tiny-label">Visualization planned</div>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          This step is ready for a richer simulation in a later phase.
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: JourneyPageProps) {
  const { id } = await params;
  const journey = getJourneyById(id);

  return {
    title: journey ? `${journey.title} | CosmoLens` : "Journey | CosmoLens",
    description: journey?.summary,
  };
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { id } = await params;
  const journey = getJourneyById(id);

  if (!journey) {
    notFound();
  }

  const firstStepObject = journey.steps.flatMap((step) => step.objectIds).map(getObjectById).find(Boolean);

  return (
    <section className="section">
      <div className="app-container">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <div>
            <div className="eyebrow">Guided Exploration</div>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{journey.title}</h1>
            <p className="mt-5 max-w-3xl text-lg text-[color:var(--muted)]">{journey.summary}</p>
            <div className="mt-4 text-sm text-[color:var(--muted)]">
              <span className="font-semibold">Scientific sources</span>
              <ul className="mt-2 list-disc space-y-2 pl-5">{journey.sourceIds.map((id) => { const source = getSourceById(id); return source ? <li key={id}><a href={source.url} target="_blank" rel="noreferrer" className="underline">{source.title} — {source.organization}</a></li> : null; })}</ul>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/journeys" className="button button-ghost">
                All journeys
              </Link>
              <Link href={`/compare?left=${journey.comparison.left}&right=${journey.comparison.right}`} className="button button-primary">
                Compare related objects
              </Link>
            </div>
          </div>

          <aside className="panel p-5">
            <div className="flex items-center gap-2">
              <Route aria-hidden="true" size={18} color="var(--accent)" />
              <h2 className="text-xl font-semibold">Journey map</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {journey.steps.map((step, index) => (
                <a key={step.id} href={`#${step.id}`} className="quiet-panel flex gap-3 p-3 hover:border-[color:var(--border-strong)]">
                  <span className="font-mono text-sm text-[color:var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm">{step.title}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-6">
          {journey.steps.map((step, index) => {
            const stepObjects = step.objectIds
              .map(getObjectById)
              .filter((object): object is NonNullable<ReturnType<typeof getObjectById>> => Boolean(object));

            return (
              <article key={step.id} id={step.id} className="panel overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="p-6 md:p-8">
                    <div className="tiny-label">Step {String(index + 1).padStart(2, "0")}</div>
                    <h2 className="mt-3 text-3xl font-semibold">{step.title}</h2>
                    <p className="mt-4 text-[color:var(--muted)]">{step.summary}</p>

                    <div className="mt-6 grid gap-3">
                      <div className="quiet-panel p-4">
                        <div className="flex items-center gap-2 font-semibold">
                          <BookOpen aria-hidden="true" size={16} color="var(--accent)" />
                          Evidence lens
                        </div>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">
                          This step separates observation from interpretation. Measurements support the claim, but uncertainty labels remain visible.
                        </p>
                      </div>
                      <div className="quiet-panel p-4">
                        <div className="flex items-center gap-2 font-semibold">
                          <Database aria-hidden="true" size={16} color="var(--cyan)" />
                          Related atlas entries
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stepObjects.map((object) => (
                            <Link key={object.id} href={`/objects/${object.id}`} className="confidence mt-0 hover:border-[color:var(--accent)]">
                              {object.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[color:var(--border)] p-4 lg:border-l lg:border-t-0">
                    <JourneyVisualization step={step} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="panel p-6">
            <div className="eyebrow">What This Journey Teaches</div>
            <h2 className="mt-2 text-3xl font-semibold">{journey.conclusion.title}</h2>
            <p className="mt-4 text-[color:var(--muted)]">
              {journey.conclusion.body}
            </p>
            <Link href={`/atlas?query=${encodeURIComponent(journey.atlasQuery)}`} className="button button-ghost mt-6">
              Continue in atlas
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <AssistantPanel
            objectId={firstStepObject?.id}
            initialMode="research"
            suggestedQuestion={journey.suggestedQuestion}
          />
        </div>
      </div>
    </section>
  );
}
