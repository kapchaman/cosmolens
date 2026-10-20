"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="section app-container"><div className="panel p-6" role="alert"><div className="eyebrow">Connection interrupted</div><h1 className="mt-3 text-3xl font-semibold">This view could not be loaded.</h1><p className="mt-4 text-[color:var(--muted)]">Try again, or return to the atlas to continue exploring.</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" className="button button-primary" onClick={reset}>Try again</button><Link href="/atlas" className="button button-ghost">Open atlas</Link></div></div></section>;
}
