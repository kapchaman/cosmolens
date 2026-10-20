import type { Metadata } from "next";
import { LatestDiscoveriesPanel } from "@/components/news/LatestDiscoveriesPanel";

export const metadata: Metadata = {
  title: "Latest Discoveries | CosmoLens",
  description: "Official astronomy and space science updates from NASA, JPL, and ESA feeds.",
};

export default function DiscoveriesPage() {
  return (
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-4xl">
          <div className="eyebrow">Latest Discoveries</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Official source feed, not fabricated news.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">
            CosmoLens surfaces astronomy and space-science updates only when official sources respond.
          </p>
        </div>
        <LatestDiscoveriesPanel compact showOpenLink={false} />
      </div>
    </section>
  );
}
