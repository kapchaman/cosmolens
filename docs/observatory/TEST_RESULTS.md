# Prototype verification

Baseline: main `f30d536e222eb6fe6272181c9db2bb63ee97eab0`. The feature branch is reviewed through a pull request; no deployment, merge or paid AI activation is part of this work.

## Reproducible checks

```sh
npm ci
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

The Quality gates workflow additionally runs the existing six Redis integration tests against an ephemeral Redis service. Unit/API tests never invoke a paid provider; browser tests use deterministic route fixtures. The AI route remains disabled.

## Visual matrix

Home, Lab and Atlas are captured at **1440×900, 1024×768, 390×844, 360×800, 768×1024 and 1280×900**. `scripts/capture-observatory.mjs before|after` records viewport and full-page PNGs plus a manifest of dimensions, broken-image checks and browser exceptions. Run it against a local production server on port 3100; `CAPTURE_OUTPUT` and `PLAYWRIGHT_BASE_URL` can point at an isolated local capture directory/server.

The new Playwright coverage checks overflow at every requested width, early mobile primary controls, 33 Atlas records, all ten Scale stations without metric overlap, URL state, all four Lab scenarios, fixed-radius gravity/weight outputs, input validation, media failures and CSS cascade regressions. Existing navigation, search keyboard/focus, persistence, comparison, API, content-integrity and release tests remain in place.

`scripts/capture-zoom.mjs` uses a temporary Chromium extension and `chrome.tabs.setZoom(tabId, 2)`. It verifies the actual zoom factor, 720 px CSS viewport and DPR 2 from a 1440×900 browser viewport, captures all three pages and checks reflow and operable controls. This is not CSS `zoom`, a screenshot resize or a device-scale-factor substitute. The extension is never shipped in the app. It runs only against localhost in CI.

Local visual QA uses Chromium headless shell. The local execution environment prohibits the socket operation needed by full Chromium; actual browser zoom therefore runs in GitHub Actions. CI artifacts include the complete after-capture matrix, zoom evidence, manifests and Playwright report; retained for 30 days. Selected durable before/after comparisons are committed under [review](review/README.md).

## Limits

- This phase redesigns three pages, not the entire application. Open audit findings are listed in [AUDIT_TRACEABILITY.md](AUDIT_TRACEABILITY.md).
- Five objects have bundled observation imagery; 28 retain explicit data-record fallbacks. Catalog IDs, measurements, sources and deep links are preserved.
- The Earth calculation is quantitative within its stated fixed-radius approximation. Moon, solar evolution and galaxy scenarios are conceptual teaching tools, not numerical forecasts.
- Browser coverage is Chromium. Keyboard, focus, semantic labels, contrast and reduced motion are checked; a complete assistive-technology and cross-browser certification is not claimed.
- Feed captures use controlled fallbacks. Network-dependent NASA/ESA/JPL uptime and changing APOD content are not guaranteed by a screenshot test.
- No public deployment is created, and no OpenAI API credits or external paid services are used.
