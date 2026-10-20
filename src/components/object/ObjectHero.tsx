import Link from "next/link";
import { Atom, Compass, Database, Orbit, Telescope } from "lucide-react";
import { SaveObjectButton } from "@/components/my-cosmos/SaveObjectButton";
import type { AstronomicalObject } from "@/types/astronomy";
import { formatCategory } from "@/lib/astronomy/format";

const categoryAccent: Record<AstronomicalObject["category"], { color: string; label: string }> = {
  planet: { color: "var(--cyan)", label: "planetary body" },
  moon: { color: "var(--green)", label: "satellite system" },
  star: { color: "var(--accent)", label: "stellar physics" },
  galaxy: { color: "var(--violet)", label: "galactic structure" },
  nebula: { color: "var(--red)", label: "interstellar medium" },
  "black-hole": { color: "var(--accent)", label: "strong gravity" },
  cluster: { color: "var(--cyan)", label: "large-scale gravity" },
  concept: { color: "var(--green)", label: "scientific concept" },
};

function ObjectVisual({ object }: { object: AstronomicalObject }) {
  const accent = categoryAccent[object.category];
  const points = Array.from({ length: Math.max(12, object.tags.length * 5) }, (_, index) => index);

  return (
    <div className="absolute inset-0">
      <div className="scale-dial" />
      <div className="signal-line" />
      <div className="absolute inset-0">
        {points.map((point) => (
          <span
            key={point}
            className="absolute rounded-full"
            style={{
              left: `${(point * 37 + object.name.length * 11) % 100}%`,
              top: `${(point * 53 + object.category.length * 13) % 100}%`,
              width: point % 5 === 0 ? 3 : 2,
              height: point % 5 === 0 ? 3 : 2,
              background: point % 4 === 0 ? accent.color : "rgba(255,255,255,0.52)",
              opacity: point % 4 === 0 ? 0.72 : 0.32,
            }}
          />
        ))}
      </div>
      <div
        className="absolute left-1/2 top-1/2 flex aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-black/20"
        style={{ borderColor: accent.color }}
      >
        <div className="aspect-square w-[64%] rounded-full border border-white/10" />
      </div>
      {object.category === "galaxy" || object.category === "cluster" ? (
        <div className="absolute left-1/2 top-1/2 h-[18%] w-[84%] -translate-x-1/2 -translate-y-1/2 rotate-[-17deg] rounded-full border border-[rgba(121,200,214,0.3)] bg-[rgba(121,200,214,0.05)]" />
      ) : null}
      {object.category === "black-hole" ? (
        <div className="absolute left-1/2 top-1/2 aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(214,168,95,0.48)] bg-black shadow-[0_0_90px_rgba(214,168,95,0.25)]" />
      ) : null}
    </div>
  );
}

export function ObjectHero({ object }: { object: AstronomicalObject }) {
  const accent = categoryAccent[object.category];
  const primaryMeasurement = object.measurements[0];

  return (
    <section className="section pb-10">
      <div className="app-container grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
        <div>
          <div className="eyebrow">{formatCategory(object.category)}</div>
          <h1 className="headline mt-4">{object.name}</h1>
          <p className="subhead mt-6">{object.summary}</p>
          {object.aliases.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {object.aliases.map((alias) => (
                <span key={alias} className="confidence">
                  {alias}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/compare?left=${object.id}`} className="button button-primary">
              Compare object
            </Link>
            <SaveObjectButton
              object={{
                id: object.id,
                name: object.name,
                category: object.category,
                summary: object.summary,
              }}
            />
            <Link href="/atlas" className="button button-ghost">
              Back to atlas
            </Link>
          </div>
        </div>
        <div className="visual-frame min-h-[560px] p-5 sm:min-h-[420px]">
          <ObjectVisual object={object} />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-black/30 px-3 py-2 text-sm text-[color:var(--muted)] backdrop-blur">
            <Orbit aria-hidden="true" size={15} color={accent.color} />
            {accent.label}
          </div>
          <div className="absolute inset-x-5 bottom-5 grid gap-3">
            <div className="quiet-panel p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Telescope aria-hidden="true" size={16} color="var(--accent)" />
                Scientific view
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{object.media.alt}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="quiet-panel p-3">
                <Database aria-hidden="true" size={15} color="var(--cyan)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">{object.measurements.length} measurements</div>
              </div>
              <div className="quiet-panel p-3">
                <Compass aria-hidden="true" size={15} color="var(--green)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">{object.relationships.length} relationships</div>
              </div>
              <div className="quiet-panel p-3">
                <Atom aria-hidden="true" size={15} color="var(--accent)" />
                <div className="mt-2 text-xs text-[color:var(--muted)]">
                  {primaryMeasurement ? primaryMeasurement.label : "profile"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
