# CosmoLens

CosmoLens is a long-term interactive astronomy product: part cosmic atlas, part scientific visualization platform, part AI-assisted exploration system.

This repository starts with a clean Next.js foundation, a sourced astronomy data layer, an application shell, interactive exploration surfaces, contextual AI, and resilient external-data adapters.

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add `OPENAI_API_KEY` before using CosmoLens AI.

Useful checks:

```bash
npm run typecheck
npm run build
npm run visual:smoke
```

## Product Principles

- Scientific claims must be sourced.
- Estimates, observations, and theoretical values must be labeled distinctly.
- AI is contextual and educational, not a generic chatbot.
- Visualizations should clarify scale, evidence, or relationships.
- Complex integrations should degrade gracefully.

## Current Phase

CosmoLens is currently in an MVP-plus foundation stage:

- Phase 0: clean project setup is complete.
- Phase 1: application shell and design foundation are complete enough for iteration.
- Phase 2: sourced astronomical atlas is in progress with 33 curated entries.
- Phase 3: object pages include visual object headers, measurements, relationships, sources, scientific profiles, cosmic-scale context, and save actions.
- Phase 4: Cosmic Scale Explorer exists as a polished 2.5D MVP with linked catalog entries, order-of-magnitude context, and keyboard navigation.
- Phase 5: CosmoLens AI is server-side, context-aware, rate-limited, and requires a valid `OPENAI_API_KEY`.
- Phase 6: conceptual scientific visualizations cover rotation curves, lensing, Hubble diagrams, and HR diagrams.
- Phase 7: guided journeys have dedicated pages with step visualizations and AI research context.
- Phase 8: NASA APOD is integrated through a resilient server adapter with fallback behavior.
- Phase 9: My Cosmos exists as a local-first personal journal and saved-object space.
- Phase 10: performance, accessibility, and visual smoke checks are active but need continuing polish as features expand.
