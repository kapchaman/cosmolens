# Audit traceability — A01–A19

Source: the existing **CosmoLens_Visual_Audit_2026-10-21.pdf**, all 19 findings and its screenshot evidence. This implementation reuses that audit; it is not a repeat discovery audit. Baseline is main at `f30d536e222eb6fe6272181c9db2bb63ee97eab0`. New screenshots compare the same local production routes with deterministic feed responses.

“Addressed” means the relevant implementation and regression checks are present, not that every route has been redesigned. The November 8 continuation closes the previously deferred implementation work; human accessibility review remains a release gate.

| ID | Finding | Prototype response / status |
| --- | --- | --- |
| A01 | Mobile primary actions too far down | **Addressed:** Home/Atlas/Lab actions retained; My Cosmos now places Write a note and section navigation before saved objects, with the composer first on mobile. |
| A02 | Cascade overrides local spacing utilities | **Addressed globally:** layered reset/components; regression checks for `pt-0`, `pb-10`, underlined source links. |
| A03 | Weak secondary-text contrast | **Addressed shared tokens and prototypes:** stronger muted palette on solid surfaces; focus and control borders retained. Not a certification of every legacy visual. |
| A04 | Placeholder-like visualizations | **Addressed:** Scale/Lab diagrams retained; Journey placeholders replaced by observation–interpretation–limitation evidence panels. Point-lens geometry now follows a stated equation; HR and expansion plots remain explicitly schematic/synthetic. |
| A05 | Lab too narrow at 1024 px | **Addressed:** full-width instrument, balanced two-column control layout, separately readable explanation; tablet stacking at 900 px. |
| A06 | Tiny scientific labels | **Addressed:** HTML axes/legends on all Journey plots. HR uses normal-sized named buttons instead of tiny SVG click targets. Hubble displays units and labeled scale; lens controls expose numerical outputs. |
| A07 | Compare controls/results require excessive scrolling | **Addressed:** compact Compare selectors lead directly to a responsive, three-column semantic data table; contextual biographies follow results. No forced 720 px table. |
| A08 | Journey navigation/CTA visibility | **Addressed:** Journey Start CTA precedes map/details; numbered map and preserved step anchors; sources remain accessible in a labeled disclosure. Directory uses compact editorial rows. |
| A09 | Large unavailable-AI panels | **Addressed:** all unavailable AssistantPanel states collapse to a status and useful atlas link. No disabled form stack. Available behavior is preserved with mocked tests; real endpoint remains 503. |
| A10 | Note editor lacks persistent visible label | **Addressed:** persistent visible Note title / Note body labels, explicit on-device storage notice and visible keyboard focus. |
| A11 | Destructive note action needs recovery | **Addressed:** soft removal stores original note plus removedAt in one localStorage write. Undo and Removed notes restore across reload. Permanent deletion requires confirmation; storage failures retain recovery. |
| A12 | Atlas navigation loses active state on object pages | **Addressed:** Atlas active for `/objects/*`. |
| A13 | Home discovery feed breaks content alignment | **Addressed:** feed now shares the bounded observatory content frame. |
| A14 | Duplicate discovery heading / unclear source degradation | **Addressed:** one introduction on Discoveries; shared component can omit its heading, with a named section retained. Provider degradation feedback unchanged. |
| A15 | APOD image and error-state resilience | **Addressed:** stable image frame, cached-load recovery, accessible failure state, source access, retry on data fallback, expandable full description. |
| A16 | Scale metric cards obscure mobile visualization | **Addressed:** diagram, controls and metrics never overlap; all ten stations tested at 360 px. |
| A17 | News summaries include site/navigation debris | **Addressed:** remove script/style content, preserve paragraph word boundaries, reject navigation-only snippets and strip reading-time prefixes. Focused parser regression coverage. |
| A18 | Compare fields need clearer matching/labels | **Addressed:** explicit diameter grouping retains equatorial/general qualifiers, units, confidence and per-measurement source links. Missing values remain unknown; radius, distance definitions and units are never silently converted. |
| A19 | Earth experiment title/copy disagree with selected mass | **Addressed:** neutral title, live parameter-linked interpretation, fixed radius, explicit acceleration and weight, independent test-body mass. |

## Evidence and remaining work

The screenshot matrix covers Home, Lab and Atlas at 1440×900, 1024×768, 390×844, 360×800, 768×1024 and 1280×900. See [review](review/README.md) and [verification](TEST_RESULTS.md). Before captures are from the unmodified baseline; after captures are from the feature implementation. API fallbacks are deliberately stable in both sets so feed timing does not distort the comparison.

The November 8 continuation starts at PR #10 head `4e09f7305133965e9b3ecc983b236d3103d71598`. Its separate before/after matrix covers Compare, My Cosmos, all three detailed Journeys and Discoveries at those same six viewports. See [continuation report](COMPLETION_REPORT.md). The original Home/Lab/Atlas evidence is retained above. This table describes implementation coverage, not a claim of independent human accessibility certification.
