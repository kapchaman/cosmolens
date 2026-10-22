# CosmoLens 2.0 — The Living Observatory

Prototype scope: Home, Lab and Atlas. The direction combines observed astronomy, a quiet scientific instrument and editorial reading. Existing object, comparison, journey, planner and personal pages retain their workflows; shared shell, typography and contrast improvements apply throughout.

## Foundations

| Token | Value | Purpose |
| --- | --- | --- |
| Void | `#080C14` | Canvas; gives imagery visual space |
| Nebula | `#152537` | Strong instrument surface |
| Ion | `#70D6E8` | Interactive states, measured values, observed curve |
| Solar | `#E2B76F` | Primary CTA, fixed-reference marks, focus |
| Starlight | `#F0F3F7` | Primary text |
| Muted | `#B5C4D3` | Secondary text; never opacity-reduced body copy |
| Muted strong | `#A3B5C7` | Supporting labels |

Definitions live in `src/app/globals.css` and `src/app/observatory.css`. Existing semantic tokens alias the new palette so shared features remain coherent. The darkest supporting text on Nebula exceeds WCAG AA's 4.5:1 normal-text threshold. Fine decorative dividers are not used as the only control boundary.

CSS uses `base` for tokens/reset and `components` for shared patterns. Tailwind utilities retain final precedence: `pt-0`, `pb-10`, `underline` and responsive local layout utilities work again. Do not add unlayered component selectors or hide document overflow to conceal layout errors.

Space Grotesk is the heading face, Inter the reading face and IBM Plex Mono the measurement face. All are self-hosted WOFF2 with bundled OFL licenses. Fallbacks are Arial/system sans-serif and system monospace. Body text is normally 16 px with generous leading; small labels supplement, never replace, readable values. Headings scale with `clamp` and wrap naturally.

Spacing tokens are 4, 8, 12, 16, 24, 32, 48, 64 and 96 px. Values between these steps are reserved for optical alignment and compact instrument frames. Corners are restrained; solid surfaces and rules carry hierarchy. No animated star field, ambient glow stack or decorative orbit ellipses.

## Layout and responsive behavior

| Width | Grid | Behavior |
| --- | --- | --- |
| ≥1280 px | 12 columns | Hero 5/7, archive 3 columns, two-part instrument |
| 768–1279 px | 8 columns | Hero 4/4; instrument stacks at ≤900 px; controls first |
| <768 px | 4 columns | Single-column editorial flow, native category/scenario selects |

Content is capped at 1280 px. Gutters are 40 / 24 / 16 px. The primary Home CTA and Atlas search appear in the initial mobile viewport. Lab exposes scenario selection and the mass slider early; supporting mass input is a labeled disclosure. At 200% browser zoom, the CSS viewport reflows into the narrower layout.

## Components and contracts

- `SectionHeading`, `Readout`, `OfflineAssistantNotice`: repeated editorial and instrument patterns. Numeric outputs use `dl`/`dt`/`dd`, units and plain-language interpretation.
- `AstroImage`: reserved geometry, lazy loading except the hero, explicit loading/error state, cached SSR-image recovery, alt text and source metadata. A failed observation does not erase the record or change the frame size.
- `ArchiveCard`: one object destination, category, title, summary, representative measurement, confidence, source count and separately accessible image attribution. A data-only record explicitly says that no observation image is provided.
- `CosmicScaleExplorer`: keeps all ten stations and URL state. The diagram, navigation and readouts occupy separate normal-flow regions, including at 360 px. Body comparisons use a common linear diameter scale; larger stations show labeled reference spans. Sub-pixel comparisons are disclosed.
- `WhatIfLab` / `ExperimentDiagram`: preserve four scenarios. Earth uses fixed geometry and proportional acceleration arrows; other diagrams identify conceptual relationships rather than fabricated measurements. The existing rotation-curve visualization remains interactive.

## Scientific and interaction rules

Observations, processed mosaics, schematic illustrations and model outputs are explicitly distinguished. Do not infer an object's physical diameter from a viewing span. Do not imply that increasing Earth's mass automatically increases its radius.

The Earth experiment fixes mean radius at 6,371 km and uses `g = g₀ × massRatio / radiusRatio²`, with `g₀ = 9.81 m/s²`; `W = m × g`. Test-body mass stays in kilograms and weight is in newtons. This is a spherical, non-rotating approximation calibrated to a rounded reference gravity, not a geophysical equilibrium model. Density, rotation, atmosphere, habitability and equilibrium radius are not simulated. Invalid test-body input produces guidance and an empty result, never a fabricated number.

Keyboard focus is visible, toggles expose `aria-pressed`, selectors and inputs have explicit labels, outputs announce changes politely, and existing search-dialog focus containment and skip navigation remain intact. Primary controls use at least 44 px target height. Reduced-motion preference disables transitions and smooth scrolling. Do not communicate curve identity by color alone: the model is dashed and HTML labels remain readable.

## Extending the prototype

Use the existing catalog/source model; do not duplicate scientific data inside presentation components. Add image provenance to `observatory-media.ts` and [ASSETS.md](ASSETS.md). Prefer a useful data record over invented photography. Carry this visual language into remaining routes only in a separate reviewed phase. See [audit traceability](AUDIT_TRACEABILITY.md) for the exact boundary.
