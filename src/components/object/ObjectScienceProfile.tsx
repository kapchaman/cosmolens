import { Atom, CircleDot, MapPinned, ShieldCheck, Tags } from "lucide-react";
import type { AstronomicalObject, MeasurementConfidence } from "@/types/astronomy";
import { formatCategory, formatConfidence } from "@/lib/astronomy/format";

const confidenceOrder: MeasurementConfidence[] = ["measured", "estimate", "modeled", "theoretical", "contextual"];

export function ObjectScienceProfile({
  object,
  sourceCount,
}: {
  object: AstronomicalObject;
  sourceCount: number;
}) {
  const confidenceCounts = confidenceOrder
    .map((confidence) => ({
      confidence,
      count: object.measurements.filter((measurement) => measurement.confidence === confidence).length,
    }))
    .filter((item) => item.count > 0);

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Scientific Profile</div>
          <h2 className="mt-2 text-2xl font-semibold">{formatCategory(object.category)} context</h2>
        </div>
        <ShieldCheck aria-hidden="true" size={20} color="var(--green)" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="quiet-panel p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Atom aria-hidden="true" size={16} color="var(--accent)" />
            Composition
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(object.composition || ["not yet modeled"]).map((item) => (
              <span key={item} className="confidence mt-0">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="quiet-panel p-4">
          <div className="flex items-center gap-2 font-semibold">
            <MapPinned aria-hidden="true" size={16} color="var(--cyan)" />
            Location
          </div>
          <div className="mt-3 grid gap-2 text-sm text-[color:var(--muted)]">
            {object.coordinates?.constellation ? <span>Constellation: {object.coordinates.constellation}</span> : null}
            {object.coordinates?.rightAscension ? <span>RA: {object.coordinates.rightAscension}</span> : null}
            {object.coordinates?.declination ? <span>Dec: {object.coordinates.declination}</span> : null}
            {!object.coordinates ? <span>Coordinate metadata pending for this object.</span> : null}
          </div>
        </div>

        <div className="quiet-panel p-4">
          <div className="flex items-center gap-2 font-semibold">
            <CircleDot aria-hidden="true" size={16} color="var(--green)" />
            Data confidence
          </div>
          <div className="mt-3 grid gap-2">
            {confidenceCounts.map((item) => (
              <div key={item.confidence} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[color:var(--muted)]">{formatConfidence(item.confidence)}</span>
                <span className="font-mono">{item.count}</span>
              </div>
            ))}
            <div className="border-t border-[color:var(--border)] pt-2 text-sm text-[color:var(--muted)]">
              {sourceCount} source{sourceCount === 1 ? "" : "s"} linked
            </div>
          </div>
        </div>

        <div className="quiet-panel p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Tags aria-hidden="true" size={16} color="var(--violet)" />
            Discovery tags
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {object.tags.map((tag) => (
              <span key={tag} className="confidence mt-0">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
