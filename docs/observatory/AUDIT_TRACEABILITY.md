# Audit traceability — A01–A19

Source: the existing **CosmoLens_Visual_Audit_2026-10-21.pdf**, all 19 findings and its screenshot evidence. This implementation reuses that audit; it is not a repeat discovery audit. Baseline is main at `f30d536e222eb6fe6272181c9db2bb63ee97eab0`. New screenshots compare the same local production routes with deterministic feed responses.

“Addressed” means the relevant implementation and regression checks are present, not that every route has been redesigned. Deferred findings remain explicitly open.

| ID | Finding | Prototype response / status |
| --- | --- | --- |
| A01 | Mobile primary actions too far down | **Partial:** Home CTA, Atlas search and Lab controls raised. My Cosmos is outside this phase. |
| A02 | Cascade overrides local spacing utilities | **Addressed globally:** layered reset/components; regression checks for `pt-0`, `pb-10`, underlined source links. |
| A03 | Weak secondary-text contrast | **Addressed shared tokens and prototypes:** stronger muted palette on solid surfaces; focus and control borders retained. Not a certification of every legacy visual. |
| A04 | Placeholder-like visualizations | **Partial:** useful Scale size/span comparisons and Lab schematics; existing rotation curve retained and clarified. Remaining Journey diagrams deferred. |
| A05 | Lab too narrow at 1024 px | **Addressed:** full-width instrument, balanced two-column control layout, separately readable explanation; tablet stacking at 900 px. |
| A06 | Tiny scientific labels | **Partial:** rotation-curve axes and legend moved to HTML; Scale readouts use normal text. Other Journey plots deferred. |
| A07 | Compare controls/results require excessive scrolling | **Deferred:** Compare redesign is outside the three-page prototype. Existing comparison regression tests retained. |
| A08 | Journey navigation/CTA visibility | **Partial:** direct Home journey entries; detailed Journey route layout deferred. |
| A09 | Large unavailable-AI panels | **Partial:** compact notices on Home/Lab. Endpoint remains disabled. Other routes retain existing behavior. |
| A10 | Note editor lacks persistent visible label | **Deferred:** My Cosmos editing is outside scope. |
| A11 | Destructive note action needs recovery | **Deferred:** no real user notes modified; existing persistence behavior preserved. |
| A12 | Atlas navigation loses active state on object pages | **Addressed:** Atlas active for `/objects/*`. |
| A13 | Home discovery feed breaks content alignment | **Addressed:** feed now shares the bounded observatory content frame. |
| A14 | Duplicate discovery heading / unclear source degradation | **Partial:** shared feed identifies failing providers; dedicated Discoveries heading redesign deferred. |
| A15 | APOD image and error-state resilience | **Addressed:** stable image frame, cached-load recovery, accessible failure state, source access, retry on data fallback, expandable full description. |
| A16 | Scale metric cards obscure mobile visualization | **Addressed:** diagram, controls and metrics never overlap; all ten stations tested at 360 px. |
| A17 | News summaries include site/navigation debris | **Addressed:** remove script/style content, preserve paragraph word boundaries, reject navigation-only snippets and strip reading-time prefixes. Focused parser regression coverage. |
| A18 | Compare fields need clearer matching/labels | **Deferred:** existing comparison and deep links retained. |
| A19 | Earth experiment title/copy disagree with selected mass | **Addressed:** neutral title, live parameter-linked interpretation, fixed radius, explicit acceleration and weight, independent test-body mass. |

## Evidence and remaining work

The screenshot matrix covers Home, Lab and Atlas at 1440×900, 1024×768, 390×844, 360×800, 768×1024 and 1280×900. See [review](review/README.md) and [verification](TEST_RESULTS.md). Before captures are from the unmodified baseline; after captures are from the feature implementation. API fallbacks are deliberately stable in both sets so feed timing does not distort the comparison.

Phase 2 should prioritize Compare task flow, My Cosmos notes and Journey-specific visualizations. Those changes are intentionally not claimed as completed here.
