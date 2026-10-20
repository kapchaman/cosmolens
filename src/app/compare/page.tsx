import { CompareObjects } from "@/components/compare/CompareObjects";
import { getAllObjects } from "@/lib/astronomy/catalog";

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
    <section className="section">
      <div className="app-container">
        <div className="mb-8 max-w-3xl">
          <div className="eyebrow">Compare</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">Objects in context, not isolation.</h1>
          <p className="mt-5 text-[color:var(--muted)]">
            Compare measurements, uncertainty labels, relationships, and scientific significance across curated astronomical entries.
          </p>
        </div>
        <CompareObjects objects={objects} initialLeft={params.left} initialRight={params.right} />
      </div>
    </section>
  );
}
