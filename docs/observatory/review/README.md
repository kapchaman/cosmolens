# Before / after review

The baseline is main `f30d536e222eb6fe6272181c9db2bb63ee97eab0`. Capture conditions are identical: local production build, Chromium, reduced motion, deterministic APOD/news fallback fixtures, loaded local fonts and images.

The complete matrix has viewport and full-page PNGs at 1440×900, 1024×768, 390×844, 360×800, 768×1024 and 1280×900 for Home, Lab and Atlas. Before and after manifests record capture dimensions and exceptions. The PR's `browser-results` CI artifact also includes the current after matrix and genuine 200% browser zoom evidence.

Review priority: the first viewport on mobile; Scale diagram/readout separation; Lab at 1024 px; readable Atlas search, filters, metadata and source credits. Live feeds are intentionally not used for a reproducible visual comparison.

## Home

![Home before and after at 1440×900](home-1440x900.jpg)

![Home before and after at 390×844](home-390x844.jpg)

## Lab

![Lab before and after at 1440×900](lab-1440x900.jpg)

![Lab before and after at 390×844](lab-390x844.jpg)

## Atlas

![Atlas before and after at 1440×900](atlas-1440x900.jpg)

![Atlas before and after at 390×844](atlas-390x844.jpg)
