export type ObservatoryMedia = {
  src: string;
  alt: string;
  credit: string;
  source: string;
  kind: string;
  position?: string;
};

// See docs/observatory/ASSETS.md for originals, processing and usage conditions.
export const observatoryMedia: Record<string, ObservatoryMedia> = {
  andromeda: {
    src: "/images/observatory/andromeda.webp",
    alt: "Hubble's mosaic of Andromeda: a bright central bulge, dark dust lanes and a blue outer stellar disk.",
    credit:
      "NASA, ESA, B. Williams, Z. Chen, L. C. Johnson; processing: J. DePasquale (STScI)",
    source:
      "https://science.nasa.gov/asset/hubble/hubble-m31-phatphast-mosaic/",
    kind: "Hubble observation mosaic",
  },
  earth: {
    src: "/images/observatory/earth.webp",
    alt: "The Americas, oceans and cloud cover in NASA's Blue Marble satellite composite.",
    credit: "NASA Earth Observatory",
    source: "https://science.nasa.gov/resource/blue-marble-2002/",
    kind: "Satellite composite",
  },
  moon: {
    src: "/images/observatory/moon.webp",
    alt: "The Moon's near side, with dark maria and bright cratered highlands.",
    credit: "NASA/GSFC/Arizona State University",
    source: "https://science.nasa.gov/photojournal/nearside-spectacular/",
    kind: "LRO observation mosaic",
  },
  mars: {
    src: "/images/observatory/mars.webp",
    alt: "Viking Orbiter global view of Mars showing the Valles Marineris region.",
    credit: "NASA/JPL-Caltech",
    source: "https://science.nasa.gov/mars/",
    kind: "Viking observation mosaic",
  },
  jupiter: {
    src: "/images/observatory/jupiter.webp",
    alt: "Jupiter's banded cloud tops against black space.",
    credit: "NASA/JPL/Space Science Institute",
    source: "https://science.nasa.gov/photojournal/cassini-jupiter-portrait/",
    kind: "Cassini observation mosaic",
  },
};
