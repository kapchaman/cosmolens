# Observation and font provenance

No generated astronomy photography is used. The five bundled WebP files are resized/compressed versions of credited scientific images; CSS may crop the hero. The Andromeda caption explicitly identifies the crop. Lab/Scale SVGs are authored explanatory diagrams, visibly labeled as schematics, size comparisons or model outputs.

| Asset | Observation / processing | Credit and source |
| --- | --- | --- |
| `andromeda.webp` | Hubble PHAT/PHAST observation mosaic, 1280×299 source rendition; hero displays a cropped detail | NASA, ESA, B. Williams, Z. Chen, L. C. Johnson; processing J. DePasquale (STScI). [Release and image](https://science.nasa.gov/asset/hubble/hubble-m31-phatphast-mosaic/) |
| `earth.webp` | Blue Marble 2002 satellite composite, resized to 720×720; not a single exposure | NASA Earth Observatory. [Source](https://science.nasa.gov/resource/blue-marble-2002/) |
| `moon.webp` | LRO near-side observation mosaic PIA14011, resized to 720×720 | NASA/GSFC/Arizona State University. [Nearside Spectacular](https://science.nasa.gov/photojournal/nearside-spectacular/) |
| `mars.webp` | Viking global observation mosaic, Valles Marineris, PIA04304, resized to 720×682 | NASA/JPL-Caltech. [NASA Mars source page](https://science.nasa.gov/mars/) |
| `jupiter.webp` | Cassini true-color observation mosaic PIA04866, resized to 720×720 | NASA/JPL/Space Science Institute. [Cassini Jupiter Portrait](https://science.nasa.gov/photojournal/cassini-jupiter-portrait/) |

Files are in `public/images/observatory/`; alt text, processing type, credits and original-page links are centralized in `src/content/observatory-media.ts`. Image credit is visible on archive records, not dependent on a tooltip. The other 28 objects deliberately use a data-record fallback; no objects or source references were removed.

Use follows [NASA's images and media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/) and the credits of the linked releases. Attribution is retained, no NASA logo is used as product branding and no endorsement is implied. Image availability on a NASA site is not a blanket license for unrelated third-party material; preserve these specific source records when replacing assets.

## Fonts

Self-hosted files in `public/fonts/`, obtained from the corresponding Fontsource npm distributions:

| Family | Distribution | File |
| --- | --- | --- |
| Space Grotesk | `@fontsource-variable/space-grotesk` 5.3.0 | `space-grotesk-latin-wght-normal.woff2` |
| Inter | `@fontsource-variable/inter` 5.3.0 | `inter-latin-wght-normal.woff2` |
| IBM Plex Mono | `@fontsource/ibm-plex-mono` 5.3.0 | `ibm-plex-mono-latin-400-normal.woff2` |

Each is distributed under the SIL Open Font License; the full family-specific license is bundled alongside the file. Fonts are Latin subsets matching the current English interface. Other scripts use the configured system fallback. `next/font/local` supplies stable fallback behavior without runtime requests to Google Fonts or another font service.
