import { AtlasBrowser } from "@/components/atlas/AtlasBrowser";
import { getAllObjects } from "@/lib/astronomy/catalog";

export const metadata = {
  title: "Atlas | CosmoLens",
};

export default function AtlasPage() {
  const objects = getAllObjects();

  return (
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-3xl">
          <div className="eyebrow">Astronomical Atlas</div>
          <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-6xl">Objects, evidence, relationships.</h1>
          <p className="mt-5 text-[color:var(--muted)]">
            A curated database of astronomical objects and concepts. Each entry is structured for sources, uncertainty, relationships, and future visualizations.
          </p>
        </div>
        <AtlasBrowser objects={objects} />
      </div>
    </section>
  );
}
