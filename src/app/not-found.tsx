import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="app-container max-w-2xl">
        <div className="eyebrow">Not found</div>
        <h1 className="mt-4 text-5xl font-semibold">This region is not mapped yet.</h1>
        <p className="mt-5 text-[color:var(--muted)]">
          The CosmoLens catalog is curated, so unmapped entries are kept empty until they can be sourced properly.
        </p>
        <Link href="/atlas" className="button button-primary mt-8">
          Return to atlas
        </Link>
      </div>
    </section>
  );
}
