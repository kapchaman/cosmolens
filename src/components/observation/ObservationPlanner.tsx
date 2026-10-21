"use client";

import Link from "next/link";
import { approximateMoonPhase, localDateInput, parseCalendarDate } from "@/lib/astronomy/dates";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye, MapPin, Moon, ShieldCheck, Telescope } from "lucide-react";
import type { LatitudeBand, ObservationDifficulty, ObservationTarget } from "@/types/observation";

const difficultyLabel: Record<ObservationDifficulty, string> = {
  easy: "easy",
  moderate: "moderate",
  "dark-sky": "dark sky",
};

function scoreTarget(target: ObservationTarget, sky: string) {
  if (target.difficulty === "easy") return 3;
  if (target.difficulty === "moderate") return sky === "urban" ? 1 : 2;
  return sky === "dark" ? 2 : 0;
}

export function ObservationPlanner({ targets }: { targets: ObservationTarget[] }) {
  const [date, setDate] = useState("");
  useEffect(() => setDate(localDateInput()), []);
  const [latitudeBand, setLatitudeBand] = useState<LatitudeBand>("north");
  const [sky, setSky] = useState("suburban");
  const month = parseCalendarDate(date)?.getUTCMonth();
  const moonPhase = useMemo(() => approximateMoonPhase(date), [date]);

  const seasonalTargets = useMemo(
    () =>
      targets
        .filter((target) => !target.ephemerisRequired)
        .filter((target) => target.latitudeBands.includes(latitudeBand))
        .filter((target) => month !== undefined && moonPhase !== null && target.bestMonths.includes(month + 1))
        .map((target) => ({ ...target, score: scoreTarget(target, sky) }))
        .filter((target) => target.score > 0)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [latitudeBand, month, moonPhase, sky, targets],
  );

  const ephemerisTargets = targets.filter((target) => target.ephemerisRequired);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="panel h-fit p-5">
        <div className="flex items-center gap-2">
          <Telescope aria-hidden="true" size={18} color="var(--accent)" />
          <h2 className="text-xl font-semibold">Planning controls</h2>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays aria-hidden="true" size={15} color="var(--cyan)" />
              Date
            </span>
            <input
              className="min-h-11 rounded-md border border-[color:var(--border)] bg-black/20 px-3 outline-none"
              type="date"
              min="1900-01-01"
              max="2100-12-31"
              aria-invalid={!moonPhase}
              aria-describedby="observation-date-help"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MapPin aria-hidden="true" size={15} color="var(--green)" />
              Latitude band
            </span>
            <select
              className="min-h-11 rounded-md border border-[color:var(--border)] bg-black/20 px-3 outline-none"
              value={latitudeBand}
              onChange={(event) => setLatitudeBand(event.target.value as LatitudeBand)}
            >
              <option value="north">Northern mid-latitudes</option>
              <option value="equatorial">Equatorial / low latitude</option>
              <option value="south">Southern mid-latitudes</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Eye aria-hidden="true" size={15} color="var(--violet)" />
              Sky condition
            </span>
            <select
              className="min-h-11 rounded-md border border-[color:var(--border)] bg-black/20 px-3 outline-none"
              value={sky}
              onChange={(event) => setSky(event.target.value)}
            >
              <option value="urban">Urban</option>
              <option value="suburban">Suburban</option>
              <option value="dark">Dark sky</option>
            </select>
          </label>
        </div>

        <div className="mt-5 quiet-panel p-4">
          <div className="flex items-center gap-2">
            <Moon aria-hidden="true" size={16} color="var(--accent)" />
            <span className="font-semibold">Approximate Moon phase</span>
          </div>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {moonPhase ? `${moonPhase.label}, lunar age ~${moonPhase.age.toFixed(1)} days.` : "Choose a valid date between 1900 and 2100."}
          </p>
          <p id="observation-date-help" className="mt-2 text-xs text-[color:var(--muted)]" role="status">{moonPhase ? "Rough estimate at UTC midnight, not an observing ephemeris. Your initial date uses this device’s local calendar." : "A valid date is needed for seasonal suggestions and Moon phase."}</p>
        </div>

        <div className="mt-5 quiet-panel p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" size={16} color="var(--green)" />
            <span className="font-semibold">Privacy boundary</span>
          </div>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            This MVP does not request precise location. Future location mode should ask permission and avoid storing exact coordinates by default.
          </p>
        </div>
      </aside>

      <div className="grid gap-6">
        <section className="panel p-5 md:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">Seasonal Targets</div>
              <h2 className="mt-2 text-3xl font-semibold">Potentially well placed this month</h2>
            </div>
            <span className="confidence mt-0">{seasonalTargets.length} matches</span>
          </div>

          {seasonalTargets.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {seasonalTargets.map((target) => (
                <article key={target.id} className="quiet-panel p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="confidence mt-0">{target.category}</span>
                    <span className="confidence mt-0">{difficultyLabel[target.difficulty]}</span>
                    <span className="confidence mt-0">{target.opticalAid}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{target.name}</h3>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{target.note}</p>
                  <div className="mt-4 text-sm text-[color:var(--muted)]">Best time: {target.bestTime}</div>
                  {target.atlasObjectId ? (
                    <Link className="button button-ghost mt-4" href={`/objects/${target.atlasObjectId}`}>
                      Atlas entry
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="quiet-panel p-5 text-sm text-[color:var(--muted)]">
              No curated seasonal matches for this combination. Try a darker sky, a different month, or a lower latitude band.
            </div>
          )}
        </section>

        <section className="panel p-5 md:p-6">
          <div className="mb-5">
            <div className="eyebrow">Ephemeris Needed</div>
            <h2 className="mt-2 text-3xl font-semibold">Objects that require live position data</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ephemerisTargets.map((target) => (
              <article key={target.id} className="quiet-panel p-4">
                <span className="confidence mt-0">{target.opticalAid}</span>
                <h3 className="mt-4 text-lg font-semibold">{target.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{target.note}</p>
                {target.atlasObjectId ? (
                  <Link className="button button-ghost mt-4" href={`/objects/${target.atlasObjectId}`}>
                    Atlas entry
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
