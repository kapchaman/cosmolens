import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CosmicScaleExplorer } from "@/components/cosmic-scale/CosmicScaleExplorer";
import { ApodPanel } from "@/components/nasa/ApodPanel";
import { LatestDiscoveriesPanel } from "@/components/news/LatestDiscoveriesPanel";
import { RotationCurveMini } from "@/components/visualizations/RotationCurveMini";
import {
  getAllObjects,
  getCosmicScale,
  getJourneys,
} from "@/lib/astronomy/catalog";
import { AstroImage } from "@/components/observatory/AstroImage";
import { ArchiveCard } from "@/components/observatory/ArchiveCard";
import {
  OfflineAssistantNotice,
  SectionHeading,
} from "@/components/observatory/Primitives";
import { observatoryMedia } from "@/content/observatory-media";

export default function HomePage() {
  const objects = getAllObjects();
  const selected = ["earth", "jupiter", "andromeda"].map(
    (id) => objects.find((o) => o.id === id)!,
  );
  const image = observatoryMedia.andromeda;
  return (
    <div className="observatory-home">
      <section className="obs-hero obs-container" aria-labelledby="home-title">
        <div className="obs-grid hero-grid">
          <div className="hero-copy">
            <p className="obs-kicker">The Living Observatory</p>
            <h1 id="home-title">
              The universe,
              <br />
              in <em>perspective.</em>
            </h1>
            <p>
              Travel from nearby worlds to the cosmic web. Change a physical
              assumption. Follow the evidence behind what we know.
            </p>
            <div className="obs-actions">
              <Link href="/atlas" className="obs-action obs-action-primary">
                Explore the atlas <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link href="#cosmic-scale" className="obs-action">
                Change the scale <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <figure className="hero-observation">
            <AstroImage media={image} priority />
            <figcaption>
              <div className="hero-caption">
                <span>
                  <strong>M31 / ANDROMEDA</strong>≈ 2.5 million light-years away
                </span>
                <a href={image.source} target="_blank" rel="noreferrer">
                  Hubble mosaic · cropped detail ↗
                </a>
              </div>
              <p className="hero-credit">{image.credit}</p>
            </figcaption>
          </figure>
        </div>
        <nav className="observatory-index" aria-label="Observatory instruments">
          {[
            {
              n: "01",
              title: "The atlas",
              body: "33 objects. A connected universe.",
              href: "/atlas",
            },
            {
              n: "02",
              title: "The experiment",
              body: "Four questions. Visible assumptions.",
              href: "/lab",
            },
            {
              n: "03",
              title: "The evidence",
              body: "Guided journeys through big ideas.",
              href: "/journeys",
            },
          ].map((x) => (
            <Link href={x.href} key={x.n}>
              <span className="index-number">{x.n}</span>
              <div>
                <h2>{x.title}</h2>
                <p>{x.body}</p>
              </div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
      <CosmicScaleExplorer nodes={getCosmicScale()} objects={objects} />
      <section className="obs-section obs-container">
        <SectionHeading
          index="02"
          eyebrow="Field notes / the atlas"
          title="Every object has a story."
        >
          <Link href="/atlas" className="obs-text-link">
            Browse all {objects.length} objects{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </SectionHeading>
        <div className="archive-grid">
          {selected.map((object, i) => (
            <ArchiveCard object={object} index={i} key={object.id} />
          ))}
        </div>
      </section>
      <section className="obs-section obs-container home-journal">
        <SectionHeading
          index="03"
          eyebrow="Guided exploration"
          title="Follow a question further."
        >
          <p>Build an explanation, one piece of evidence at a time.</p>
        </SectionHeading>
        <div className="journey-ledger">
          {getJourneys().map((journey, i) => (
            <Link href={`/journeys/${journey.id}`} key={journey.id}>
              <span className="obs-kicker">
                Journey {String(i + 1).padStart(2, "0")} /{" "}
                {journey.steps.length} steps
              </span>
              <h3>{journey.title}</h3>
              <p>{journey.summary}</p>
              <span className="obs-text-link">
                Start exploring <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="obs-section obs-container home-evidence">
        <div className="home-evidence-copy">
          <p className="obs-kicker">04 / Question the model</p>
          <h2>
            What happens when
            <br />
            the explanation changes?
          </h2>
          <p>
            Compare the motion we observe with the motion a model predicts. The
            difference is where the next question begins.
          </p>
          <Link href="/lab" className="obs-action obs-action-primary">
            Open the experiment lab{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <RotationCurveMini />
      </section>
      <ApodPanel />
      <section className="obs-section obs-container">
        <LatestDiscoveriesPanel compact />
        <OfflineAssistantNotice />
      </section>
    </div>
  );
}
