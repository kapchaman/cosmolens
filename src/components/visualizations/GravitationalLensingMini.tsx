"use client";

import { useMemo, useState } from "react";
import { Orbit, SlidersHorizontal } from "lucide-react";

export function GravitationalLensingMini() {
  const [mass, setMass] = useState(64);
  const [alignment, setAlignment] = useState(44);

  const geometry = useMemo(() => {
    const ringRadius = 34 + mass * 0.34;
    const arcOffset = (alignment - 50) * 0.42;
    const arcSpread = Math.max(18, 62 - Math.abs(alignment - 50) * 0.7);

    return { ringRadius, arcOffset, arcSpread };
  }, [alignment, mass]);

  return (
    <div className="panel p-5">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="eyebrow">Scientific Phenomenon</div>
          <h2 className="mt-2 text-2xl font-semibold">Gravitational lensing</h2>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
            A conceptual lens model showing how foreground mass can distort light from a background source.
          </p>
        </div>
        <span className="confidence mt-0">conceptual model</span>
      </div>

      <div className="visual-frame h-[300px] p-4">
        <svg className="h-full w-full" role="img" aria-label="Conceptual gravitational lensing visualization" viewBox="0 0 520 250">
          <defs>
            <radialGradient id="lensGradient" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(214,168,95,0.48)" />
              <stop offset="100%" stopColor="rgba(214,168,95,0.02)" />
            </radialGradient>
          </defs>
          <line x1="52" x2="468" y1="126" y2="126" stroke="rgba(255,255,255,0.16)" strokeDasharray="6 9" />
          <circle cx="260" cy="126" r={geometry.ringRadius} fill="none" stroke="rgba(121,200,214,0.22)" strokeWidth="1.4" />
          <circle cx="260" cy="126" r={24 + mass * 0.11} fill="url(#lensGradient)" stroke="rgba(214,168,95,0.64)" />
          <circle cx="108" cy={126 + geometry.arcOffset} r="9" fill="var(--cyan)" opacity="0.9" />
          <path
            d={`M 92 ${126 + geometry.arcOffset} C 170 ${68 - geometry.arcSpread * 0.2}, 350 ${68 - geometry.arcSpread * 0.2}, 428 ${126 - geometry.arcOffset}`}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.82"
          />
          <path
            d={`M 92 ${126 + geometry.arcOffset} C 170 ${184 + geometry.arcSpread * 0.2}, 350 ${184 + geometry.arcSpread * 0.2}, 428 ${126 - geometry.arcOffset}`}
            fill="none"
            stroke="var(--violet)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.68"
          />
          <circle cx="428" cy={126 - geometry.arcOffset} r="7" fill="var(--violet)" opacity="0.82" />
          <text x="78" y="228" fill="rgba(255,255,255,0.62)" fontSize="12">background source</text>
          <text x="226" y="228" fill="rgba(255,255,255,0.62)" fontSize="12">foreground mass</text>
          <text x="382" y="228" fill="rgba(255,255,255,0.62)" fontSize="12">apparent image</text>
        </svg>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="quiet-panel p-4">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal aria-hidden="true" size={15} color="var(--accent)" />
            Lens mass
          </span>
          <input
            className="mt-3 w-full accent-[color:var(--accent)]"
            type="range"
            min="20"
            max="100"
            value={mass}
            onChange={(event) => setMass(Number(event.target.value))}
          />
        </label>
        <label className="quiet-panel p-4">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Orbit aria-hidden="true" size={15} color="var(--cyan)" />
            Source alignment
          </span>
          <input
            className="mt-3 w-full accent-[color:var(--cyan)]"
            type="range"
            min="0"
            max="100"
            value={alignment}
            onChange={(event) => setAlignment(Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
