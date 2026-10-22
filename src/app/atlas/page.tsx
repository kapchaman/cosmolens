import { AtlasBrowser } from "@/components/atlas/AtlasBrowser";
import { getAllObjects } from "@/lib/astronomy/catalog";
export const metadata = {
  title: "Atlas | CosmoLens",
  description:
    "Search 33 sourced astronomical records, from nearby worlds to the cosmic web.",
};
export default function AtlasPage() {
  return (
    <section className="obs-page obs-container">
      <div className="obs-intro">
        <div>
          <p className="obs-kicker">01 / The scientific archive</p>
          <h1>A universe of connections.</h1>
          <p>
            Find an object. Read the evidence. Discover what connects it to
            everything else.
          </p>
        </div>
        <span className="obs-intro-note">
          33 curated records
          <br />8 categories · sources included
        </span>
      </div>
      <AtlasBrowser objects={getAllObjects()} />
    </section>
  );
}
