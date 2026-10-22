import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="obs-section-heading">
      <div>
        <p className="obs-kicker">
          <span>{index}</span> {eyebrow}
        </p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function Readout({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="obs-readout">
      <dt>{label}</dt>
      <dd>
        {value}
        {unit && <span className="obs-unit"> {unit}</span>}
      </dd>
      {hint && <dd className="obs-readout-hint">{hint}</dd>}
    </div>
  );
}

export function OfflineAssistantNotice() {
  return (
    <aside className="obs-offline" aria-label="Assistant availability">
      <Sparkles size={17} aria-hidden="true" />
      <p>
        <strong>Explore with the evidence.</strong> AI assistance is temporarily
        unavailable. The atlas and guided journeys remain open.
      </p>
      <Link href="/journeys">
        Choose a journey <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </aside>
  );
}
