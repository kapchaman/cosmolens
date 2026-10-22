import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { AstronomicalObject } from "@/types/astronomy";
import { formatCategory, formatConfidence } from "@/lib/astronomy/format";
import { observatoryMedia } from "@/content/observatory-media";
import { AstroImage } from "./AstroImage";

export function ArchiveCard({
  object,
  index = 0,
}: {
  object: AstronomicalObject;
  index?: number;
}) {
  const media = observatoryMedia[object.id];
  const metric = object.measurements[0];
  const sourceCount = new Set([
    ...object.sourceIds,
    ...object.measurements.flatMap((m) => m.sourceIds),
  ]).size;
  return (
    <article className="archive-card" data-object-id={object.id}>
      <Link href={`/objects/${object.id}`} className="archive-record-link">
        {media ? (
          <AstroImage media={media} />
        ) : (
          <div className={`archive-data-plate archive-data-${object.category}`}>
            <FileText size={24} aria-hidden="true" />
            <span className="obs-kicker">
              {formatCategory(object.category)} / record
            </span>
            <strong>{object.aliases[0] || object.name}</strong>
            <span>Data view · no observation image</span>
          </div>
        )}
        <div className="archive-card-body">
          <div className="archive-id">
            <span>{formatCategory(object.category)}</span>
            <span>
              {String(index + 1).padStart(2, "0")}{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <h3>{object.name}</h3>
          <p>{object.summary}</p>
          {metric && (
            <dl className="archive-metric">
              <dt>{metric.label}</dt>
              <dd>
                {metric.value} {metric.unit}
              </dd>
              <dd className="archive-confidence">
                {formatConfidence(metric.confidence)}
              </dd>
            </dl>
          )}
        </div>
      </Link>
      <div className="archive-card-foot">
        <span>
          {sourceCount} source{sourceCount === 1 ? "" : "s"} in record
        </span>
        {media && (
          <a
            href={media.source}
            target="_blank"
            rel="noreferrer"
            title={media.credit}
          >
            {media.kind} · {media.credit} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
