import { CompareObjects } from "@/components/compare/CompareObjects";
import { getAllObjects, getAllSources } from "@/lib/astronomy/catalog";

export const metadata = {
  title: "Compare Objects | CosmoLens",
  description: "Compare sourced astronomical objects side by side.",
};

type ComparePageProps = {
  searchParams: Promise<{ left?: string; right?: string }> | { left?: string; right?: string };
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const objects = getAllObjects();
  const params = await searchParams;

  return (
    <section className="workspace-section">
      <div className="obs-container">
        <div className="workspace-heading">
          <div className="eyebrow">Compare</div>
          <h1>Two worlds. One frame.</h1>
          <p>
            Compare measurements, uncertainty labels, relationships, and scientific significance across curated astronomical entries.
          </p>
        </div>
        <CompareObjects sources={getAllSources()} objects={objects} initialLeft={params.left} initialRight={params.right} />
      </div>
    </section>
  );
}
