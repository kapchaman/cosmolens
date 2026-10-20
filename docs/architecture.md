# CosmoLens Architecture

## Product Shape

CosmoLens is organized as a scientific exploration instrument rather than a static educational site. The first product slice focuses on:

- a durable application shell;
- a sourced astronomy content model;
- an object atlas;
- object pages;
- a cosmic scale explorer preview;
- a server-side AI endpoint;
- guided scientific visualizations;
- a resilient NASA APOD adapter;
- local-first personal exploration state.

## Domains

- `content`: curated astronomy data, source records, scale nodes, and journeys.
- `lib/astronomy`: query helpers and domain logic around objects, sources, and relationships.
- `lib/ai`: prompt construction, request validation, and rate limiting.
- `lib/my-cosmos`: browser-local persistence helpers for saved objects and notes.
- `components`: reusable UI grouped by product area.
- `app/api`: server-only integrations for AI and astronomy APIs.

## Data Policy

The MVP uses local TypeScript content because the scientific dataset is small and benefits from code review. A later persistent layer can move object metadata into PostgreSQL while preserving the same public TypeScript types.

## AI Boundary

Client components never call OpenAI directly. The browser sends mode, question, selected object, and current scale to `/api/ai`; the server injects curated metadata and source context before calling OpenAI.

## External Data Boundary

Client components never call NASA APIs directly. The browser calls CosmoLens API routes, and those routes normalize external payloads, apply timeouts, cache responses, and return polished fallback states when services are unavailable.

## Personalization Boundary

`My Cosmos` is intentionally local-first in the MVP. Saved objects and notes live in `localStorage`; authentication and database-backed sync can be added later without changing the object-page save affordance.

## Future Migration Points

- Replace local search with full-text PostgreSQL or a vector index.
- Add Redis-backed rate limiting for production deployments.
- Add cached NASA/SIMBAD/NED adapters behind typed service interfaces.
- Move large visualizations into lazy-loaded client bundles.
