import Link from "next/link";
import { Route } from "lucide-react";
import type { GuidedJourney } from "@/types/astronomy";

export function JourneyPreview({ journey }: { journey: GuidedJourney }) {
  return (
    <div className="quiet-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--border)]">
          <Route aria-hidden="true" size={17} color="var(--accent)" />
        </span>
        <span className="confidence mt-0">{journey.status === "mvp" ? "MVP" : "Planned"}</span>
      </div>
      <h3 className="text-xl font-semibold">{journey.title}</h3>
      <p className="mt-3 text-sm text-[color:var(--muted)]">{journey.summary}</p>
      <div className="mt-5 grid gap-2">
        {journey.steps.slice(0, 4).map((step, index) => (
          <div key={step.id} className="flex gap-3 text-sm text-[color:var(--muted)]">
            <span className="font-mono text-[color:var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
            <span>{step.title}</span>
          </div>
        ))}
      </div>
      <Link href={`/journeys/${journey.id}`} className="button button-ghost mt-6">
        Open journey
      </Link>
    </div>
  );
}
