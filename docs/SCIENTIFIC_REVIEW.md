# Scientific review — 2026-10-20

Acceptance: claims link to relevant primary sources; measurement labels state their meaning; models are distinguishable from observations; catalog IDs and units remain internally consistent. This is a review of the current catalog measurements and a complete structural validation, not an independent astronomical measurement campaign.

## Reviewed and corrected

| Area | Finding and action | Evidence |
| --- | --- | --- |
| Planetary sizes | Existing rounded values match NASA's table. The table defines diameter at the equator; updated labels and scale references accordingly. Distances retain their mean/semi-major-axis meaning. | [NASA table](https://nssdc.gsfc.nasa.gov/planetary/factsheet/), [definitions](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planetfact_notes.html) |
| Sun | Radius, mass and effective temperature agree with the cited fact sheet; retained the modeled temperature label. | [Sun fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html) |
| Enceladus | Plume material was sampled, but the global ocean is inferred from gravity, libration and plume observations. Reclassified the ocean entry as modeled and exposed its explanatory note. | [Cassini evidence](https://science.nasa.gov/mission/cassini/science/enceladus/) |
| M87* | The 2019 mass inference uses emission models and adopted distance. Preserved 6.5 billion solar masses; separated ±0.2 billion statistical from ±0.7 billion systematic uncertainty. | [EHT paper VI](https://arxiv.org/abs/1906.11243) |
| Cygnus X-1 | Added the published mass and distance uncertainties and identified the 2021 inference. | [Miller-Jones et al.](https://arxiv.org/abs/2102.09091) |
| Bullet Cluster | Corrected source publication year from 2024 to 2025; retained the distinction between X-ray gas and lensing-inferred mass. | [NASA, June 30, 2025](https://science.nasa.gov/missions/webb/nasa-webb-pierces-bullet-cluster-refines-its-mass/) |
| Dark matter / cosmic web | Replaced an overly narrow shared citation with separate sources for dark-matter evidence and the observed filament/void pattern. Historical “largest structure” records are not imported. | [NASA dark matter](https://science.nasa.gov/dark-matter/), [sheets and voids](https://imagine.gsfc.nasa.gov/features/cosmic/sheets_voids_info.html) |
| Scale explorer | A viewing span is not an object's diameter or its distance from Earth. Every node now describes its scale reference. Neptune's orbit is not the Solar System's outer boundary. | Existing fact-sheet measurements plus explicitly labeled illustrative choices |
| Journeys / graphs | Added directly accessible journey sources, corrected “fusion pressure” wording, labeled drawn rotation curves and synthetic Hubble points. No graph is presented as a fitted dataset. | [stellar evolution](https://science.nasa.gov/exoplanets/stars/), [redshift](https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-cosmological-redshift/) |

## Extended catalog check

The remaining catalog measurement sources were opened and checked against their entries: NASA Uranus/Neptune fact sheets; JPL Europa Clipper quick facts; NASA Ganymede/Titan facts; SIMBAD Sirius/Rigel classifications; NASA Proxima/Betelgeuse pages; Milky Way, Andromeda, M33 and M87 material; Orion/Eagle/Carina/Crab nebula pages; Pleiades, Virgo and Galactic Center pages. Approximate historical distance estimates remain labeled as estimates, not current precision determinations.

Additional corrections: Europa's cited equatorial diameter is 3,122 km; Uranus uses the detailed fact sheet for its 25,559 km equatorial radius and rounded 2.867 billion km semimajor axis; Eagle Nebula distance is about 7,000 light-years in the cited Hubble catalog, consistent with the span attributed to that source; Pleiades source publication date is December 15, 2023. The schematic HR diagram now places B-type Rigel hotter than A-type Sirius A, and the red dwarf Proxima cooler than Betelgeuse; the plotted Sirius component is named explicitly.

## Automated coverage

All 33 objects, ten scale nodes, three journeys and source records are checked for duplicate IDs, unresolved citations, invalid relationship targets, missing scale descriptions and inconsistent diameter conversions. Model-dependent entries must preserve their notes. These integrity tests do not prove that a citation supports every sentence.

## Remaining scientific acceptance

- A final independent editorial review should check explanatory prose, sky-planner seasonal advice and thought experiments. The catalog measurement/source check above does not validate every qualitative statement or establish new precision distance measurements.
- Record source versions and a review date per measurement when the content workflow grows. Avoid changing all dates merely because a build ran.
- The Observation Planner remains seasonal guidance with approximate lunar phase, not a site/time ephemeris or a claim of real-time visibility.
- Lab diagrams are explanatory models; do not infer precision, fitted Hubble parameters, particle identity or exact observing predictions from them.
- An astronomy reviewer should check the November release candidate, especially uncertainty language and distinctions between measured inputs and model-derived quantities.

## Focused editorial continuation — 2026-11-08

This pass reviews the remaining thought-experiment and journey explanations; it does not redo or re-date the 33 catalog measurement reviews above.

- **Point lens:** replaced an arbitrary curved-path illustration with the thin isolated point-mass lens equation. In reference angular units, `beta = theta - m/theta`, `theta± = (beta ± sqrt(beta² + 4m))/2`, and the Einstein radius scales as `sqrt(m)` at fixed distances. Alignment shows a ring; offset shows two image directions. Marker size is explicitly unrelated to flux, magnification or lens radius. Verified against [Swinburne Astronomy](https://astronomy.swin.edu.au/cosmos/S/Schwarzschild+Lens); numerical tests check both roots against the equation over all parameter bounds. This is not a Bullet Cluster mass reconstruction.
- **Expansion:** six synthetic points follow a stated illustrative slope of 70 km/s/Mpc with alternating offsets. Distances, velocities and scatter have visible units. These are not real measurements, fitted H0, error bars or inferred expansion history. [NASA redshift background](https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-cosmological-redshift/).
- **Stellar diagrams and journey prose:** kept HR temperature direction and schematic positions, removed misleading generic diagrams, and distinguished observations from model inference and uncertainty for all nine steps. The HR sequence is not a universal life track. The Crab's pulsar/remnant and the mass-dependent stellar outcomes retain their existing NASA source chain. No new catalog values or images were invented.
- **Moon thought experiment:** solar tides remain ([NASA Tides](https://science.nasa.gov/moon/tides/)); local heights are not computed. Reworded the axial-tilt outcome to avoid implying inevitable chaotic climate on a moonless Earth. Dependence on initial conditions and possibly bounded tilt histories is supported by [Lissauer, Barnes & Chambers, Icarus 217, 77–87](https://doi.org/10.1016/j.icarus.2011.10.013). The new paper link is visible in Lab. Clarified that only eclipses involving the Moon disappear and darker skies improve faint-object visibility, not that every planet intrinsically becomes brighter.
- **Sun thought experiment:** the existing impossible-timescale boundary remains. The expanded, cooler-surface/larger-luminous-area interpretation and dependence on stellar mass loss remain qualitative. [NASA Sun facts](https://science.nasa.gov/sun/facts/) supports the far-future red-giant context; no sudden transformation or exact Earth engulfment outcome is predicted.
- **Planner:** strengthened the visible boundary: month ranges are editorial seasonal shortlists, not validated rising/setting windows. Time, horizon, weather, moonlight and equipment are not computed. Added primary-source seasonal background for [Pleiades/Orion](https://science.nasa.gov/solar-system/skywatching/night-sky-network/spot-the-young-stars-of-the-hyades-and-pleiades/) and [northern-autumn Andromeda](https://science.nasa.gov/solar-system/skywatching/night-sky-network/catch-andromeda-rising/). Broad latitude exclusions and exact month endpoints are not ephemeris-validated and must not be represented as exhaustive visibility predictions.
- **Comparisons:** grouping a general and an equatorial diameter helps find related quantities but does not make their definitions identical. Each cell retains its original label, source, unit and confidence. Radius is never converted to diameter; different distance origins remain separate; missing values are never zero.

Remaining release limitation: an independent astronomy editor has not signed off the complete product. This source-backed engineering/editorial pass is not a substitute for that human review or a site/time-specific observing ephemeris.
