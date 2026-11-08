import type { Metadata } from "next";
import { LatestDiscoveriesPanel } from "@/components/news/LatestDiscoveriesPanel";

export const metadata: Metadata = {
  title: "Latest Discoveries | CosmoLens",
  description: "Official astronomy and space science updates from NASA, JPL, and ESA feeds.",
};

export default function DiscoveriesPage() {
  return (
    <section className="workspace-section">
      <div className="obs-container">
        <div className="workspace-heading">
          <div className="eyebrow">Latest Discoveries</div>
          <h1>
            Dispatches from the universe.
          </h1>
          <p>
            Astronomy and space-science updates from NASA, JPL, and ESA. Read each discovery at its original source.
          </p>
        </div>
        <LatestDiscoveriesPanel compact showOpenLink={false} showHeading={false} />
      </div>
    </section>
  );
}
