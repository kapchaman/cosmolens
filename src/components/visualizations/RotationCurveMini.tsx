"use client";

import { useState } from "react";
import { Activity, Eye, EyeOff } from "lucide-react";

const observed = "M 24 128 C 92 70, 178 70, 270 72 C 342 74, 408 76, 476 78";
const visibleMatter = "M 24 128 C 92 72, 168 88, 246 116 C 320 142, 394 160, 476 168";
const darkMatterModel = "M 24 130 C 96 76, 186 72, 274 73 C 348 74, 412 77, 476 80";

export function RotationCurveMini() {
  const [showVisible, setShowVisible] = useState(true);
  const [showModel, setShowModel] = useState(true);

  return (
    <div className="panel p-5">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="eyebrow">Scientific Phenomenon</div>
          <h2 className="mt-2 text-2xl font-semibold">Galaxy rotation curve</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button button-ghost min-h-9 px-3 text-sm" type="button" onClick={() => setShowVisible((value) => !value)}>
            {showVisible ? <Eye aria-hidden="true" size={15} /> : <EyeOff aria-hidden="true" size={15} />}
            Visible matter
          </button>
          <button className="button button-ghost min-h-9 px-3 text-sm" type="button" onClick={() => setShowModel((value) => !value)}>
            {showModel ? <Eye aria-hidden="true" size={15} /> : <EyeOff aria-hidden="true" size={15} />}
            Dark matter model
          </button>
        </div>
      </div>
      <div className="visual-frame h-[280px] p-5">
        <svg className="h-full w-full" role="img" aria-label="Conceptual galaxy rotation curve visualization" viewBox="0 0 520 220">
          <line x1="24" x2="500" y1="184" y2="184" stroke="rgba(255,255,255,0.28)" />
          <line x1="24" x2="24" y1="24" y2="184" stroke="rgba(255,255,255,0.28)" />
          <text x="24" y="210" fill="rgba(255,255,255,0.62)" fontSize="12">galactic radius</text>
          <text x="0" y="20" fill="rgba(255,255,255,0.62)" fontSize="12">orbital speed</text>
          {showVisible ? <path d={visibleMatter} fill="none" stroke="var(--red)" strokeWidth="4" strokeLinecap="round" /> : null}
          {showModel ? <path d={darkMatterModel} fill="none" stroke="var(--green)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8" /> : null}
          <path d={observed} fill="none" stroke="var(--cyan)" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-[color:var(--muted)] md:grid-cols-3">
        <span className="flex items-center gap-2">
          <Activity aria-hidden="true" size={15} color="var(--cyan)" /> Observed speeds remain high.
        </span>
        <span>Visible matter alone predicts a stronger decline.</span>
        <span>Dark matter is inferred, not directly identified.</span>
      </div>
    </div>
  );
}
