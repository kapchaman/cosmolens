import { ExternalLink } from "lucide-react";
import type { Measurement } from "@/types/astronomy";
import { getSourceById } from "@/lib/astronomy/catalog";
import { formatConfidence } from "@/lib/astronomy/format";

export function MeasurementGrid({ measurements }: { measurements: Measurement[] }) {
  return (
    <div className="metric-grid">
      {measurements.map((measurement) => {
        const firstSource = getSourceById(measurement.sourceIds[0]);

        return (
          <div key={`${measurement.label}-${measurement.value}`} className="metric">
            <div className="metric-label">{measurement.label}</div>
            <div className="metric-value">
              {measurement.value}
              {measurement.unit ? ` ${measurement.unit}` : ""}
            </div>
            <div className="confidence">{formatConfidence(measurement.confidence)}</div>
            {measurement.note ? <p className="mt-3 text-xs text-[color:var(--muted)]">{measurement.note}</p> : null}
            {firstSource ? (
              <a
                href={firstSource.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--muted)] hover:text-[color:var(--accent)]"
              >
                {firstSource.organization}
                <ExternalLink aria-hidden="true" size={12} />
              </a>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
