import Link from "next/link";
import { ArrowRight, Database, FlaskConical, Telescope } from "lucide-react";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import { ObjectCard } from "@/components/atlas/ObjectCard";
import { CosmicScaleExplorer } from "@/components/cosmic-scale/CosmicScaleExplorer";
import { JourneyPreview } from "@/components/journeys/JourneyPreview";
import { ApodPanel } from "@/components/nasa/ApodPanel";
import { LatestDiscoveriesPanel } from "@/components/news/LatestDiscoveriesPanel";
import { RotationCurveMini } from "@/components/visualizations/RotationCurveMini";
import { getAllObjects, getCosmicScale, getFeaturedObjects, getJourneys } from "@/lib/astronomy/catalog";

export default function HomePage() {
  const featuredObjects = getFeaturedObjects();
  const objects = getAllObjects();
  const scale = getCosmicScale();
  const journeys = getJourneys();
  const primaryObject = featuredObjects[0];

  return (
    <>
      <section className="min-h-[calc(100vh-65px)] py-10 md:py-16">
        <div className="app-container grid min-h-[calc(100vh-160px)] gap-8 lg:grid-cols-[1fr_480px] lg:items-center">
          <div>
            <div className="eyebrow">CosmoLens</div>
            <h1 className="headline mt-5">Explore the universe. Understand the unknown.</h1>
            <p className="subhead mt-6">
              A scientific exploration platform for cosmic scale, astronomical objects, evidence, and AI-assisted reasoning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/atlas" className="button button-primary">
                Open atlas
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link href="#cosmic-scale" className="button button-ghost">
                Enter scale explorer
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="quiet-panel p-4">
                <Database aria-hidden="true" size={17} color="var(--accent)" />
                <div className="mt-3 text-2xl font-semibold">{featuredObjects.length}</div>
                <div className="text-sm text-[color:var(--muted)]">featured objects</div>
              </div>
              <div className="quiet-panel p-4">
                <Telescope aria-hidden="true" size={17} color="var(--cyan)" />
                <div className="mt-3 text-2xl font-semibold">{scale.length}</div>
                <div className="text-sm text-[color:var(--muted)]">scale nodes</div>
              </div>
              <div className="quiet-panel p-4">
                <div className="text-sm text-[color:var(--muted)]">Current phase</div>
                <div className="mt-3 text-2xl font-semibold">09/10</div>
                <div className="text-sm text-[color:var(--muted)]">MVP foundations</div>
              </div>
            </div>
          </div>

          <div className="visual-frame min-h-[520px] p-5">
            <div className="scale-dial" />
            <div className="signal-line" />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <span className="tiny-label">active object</span>
              <span className="confidence mt-0">sourced</span>
            </div>
            <div className="absolute inset-x-5 bottom-5">
              {primaryObject ? (
                <div className="quiet-panel p-5">
                  <div className="tiny-label">{primaryObject.category}</div>
                  <h2 className="mt-2 text-3xl font-semibold">{primaryObject.name}</h2>
                  <p className="mt-3 text-sm text-[color:var(--muted)]">{primaryObject.summary}</p>
                  <Link href={`/objects/${primaryObject.id}`} className="button button-ghost mt-5">
                    Inspect object
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <CosmicScaleExplorer nodes={scale} objects={objects} />

      <section className="section">
        <div className="app-container">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">Atlas</div>
              <h2 className="mt-3 text-4xl font-semibold">Featured astronomical objects</h2>
            </div>
            <Link href="/atlas" className="button button-ghost">
              View full atlas
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredObjects.slice(0, 6).map((object) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </div>
        </div>
      </section>

      <ApodPanel />

      <section className="section">
        <div className="app-container grid gap-6 lg:grid-cols-[1fr_420px]">
          <RotationCurveMini />
          <AssistantPanel objectId="andromeda" suggestedQuestion="Why is Andromeda moving toward the Milky Way?" />
        </div>
      </section>

      <LatestDiscoveriesPanel compact />

      <section className="section">
        <div className="app-container">
          <div className="mb-6">
            <div className="eyebrow">Guided Exploration</div>
            <h2 className="mt-3 text-4xl font-semibold">Evidence-led journeys</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {journeys.map((journey) => (
              <JourneyPreview key={journey.id} journey={journey} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="app-container">
          <div className="panel grid gap-6 p-6 md:grid-cols-[1fr_320px] md:items-center md:p-8">
            <div>
              <div className="eyebrow">What If Lab</div>
              <h2 className="mt-3 max-w-3xl text-4xl font-semibold">Hypothetical scenarios with visible assumptions.</h2>
              <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
                Explore planetary, stellar, and galaxy-scale premises while keeping model boundaries explicit.
              </p>
            </div>
            <div className="quiet-panel p-5">
              <FlaskConical aria-hidden="true" size={20} color="var(--accent)" />
              <div className="mt-4 text-2xl font-semibold">4 scenarios</div>
              <Link href="/lab" className="button button-primary mt-5 w-full">
                Open lab
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
