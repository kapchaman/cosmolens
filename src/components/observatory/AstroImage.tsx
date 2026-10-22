"use client";

import { useEffect, useRef, useState } from "react";
import type { ObservatoryMedia } from "@/content/observatory-media";

export function AstroImage({
  media,
  priority = false,
  className = "",
}: {
  media: ObservatoryMedia;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const state =
    failedSrc === media.src
      ? "failed"
      : loadedSrc === media.src
        ? "ready"
        : "loading";
  useEffect(() => {
    const image = ref.current;
    // A cached/eager SSR image may complete before React attaches its load handler.
    if (image?.complete) {
      if (image.naturalWidth > 0) setLoadedSrc(media.src);
      else setFailedSrc(media.src);
    }
  }, [media.src]);
  return (
    <div className={`obs-image ${className}`} data-image-state={state}>
      {state !== "ready" && (
        <div className="obs-image-fallback">
          <span className="obs-kicker">
            {state === "loading"
              ? "Loading observation"
              : "Observation unavailable"}
          </span>
          <span>
            {state === "failed"
              ? "The scientific record is still available below."
              : "Preparing the image…"}
          </span>
        </div>
      )}
      {state !== "failed" && (
        <img
          ref={ref}
          src={media.src}
          alt={media.alt}
          width={1280}
          height={720}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoadedSrc(media.src)}
          onError={() => setFailedSrc(media.src)}
          style={{ objectPosition: media.position }}
        />
      )}
    </div>
  );
}
