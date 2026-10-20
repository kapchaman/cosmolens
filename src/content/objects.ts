import type { AstronomicalObject } from "@/types/astronomy";

const planetarySource = "nasa-planetary-fact-sheet";
const sunSource = "nasa-sun-fact-sheet";

export const objects: AstronomicalObject[] = [
  {
    id: "mercury",
    name: "Mercury",
    aliases: [],
    category: "planet",
    summary: "The innermost planet, heavily cratered and strongly shaped by the Sun.",
    description:
      "Mercury is a small rocky planet with extreme temperature swings, a large metallic core, and a surface that preserves a long record of impacts.",
    scientificSignificance:
      "Mercury helps constrain models of terrestrial planet formation close to a star and the evolution of airless rocky bodies.",
    measurements: [
      { label: "Equatorial diameter", value: "4,879", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "0.330 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Sun", value: "57.9", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["silicate rock", "metallic core"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "sun", kind: "orbits" },
      { targetId: "earth", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "Mercury represented as a cratered inner planet." },
    tags: ["inner solar system", "terrestrial planet"],
  },
  {
    id: "venus",
    name: "Venus",
    aliases: [],
    category: "planet",
    summary: "A rocky world with a dense atmosphere and runaway greenhouse climate.",
    description:
      "Venus is similar to Earth in size but has an atmosphere dominated by carbon dioxide, high surface pressure, and surface temperatures hot enough to melt lead.",
    scientificSignificance:
      "Venus is essential for studying climate feedback, planetary habitability, and divergent evolution among Earth-sized worlds.",
    measurements: [
      { label: "Equatorial diameter", value: "12,104", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "4.87 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Sun", value: "108.2", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["silicate rock", "carbon dioxide atmosphere", "sulfuric acid clouds"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "earth", kind: "compares-with", note: "Similar size, radically different climate." },
      { targetId: "sun", kind: "orbits" },
    ],
    media: { type: "placeholder", alt: "Venus represented as a cloud-covered rocky planet." },
    tags: ["terrestrial planet", "greenhouse effect"],
  },
  {
    id: "earth",
    name: "Earth",
    aliases: ["Terra"],
    category: "planet",
    summary: "The only known world with persistent surface liquid water and life.",
    description:
      "Earth is a differentiated rocky planet with oceans, a nitrogen-oxygen atmosphere, active geology, and a biosphere that strongly affects its surface chemistry.",
    scientificSignificance:
      "Earth is the reference point for habitability, planetary atmospheres, climate dynamics, and comparative planetology.",
    measurements: [
      { label: "Equatorial diameter", value: "12,756", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "5.97 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Sun", value: "149.6", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["silicate rock", "iron-rich core", "water", "nitrogen-oxygen atmosphere"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "moon", kind: "orbited-by" },
      { targetId: "sun", kind: "orbits" },
    ],
    media: { type: "placeholder", alt: "Earth represented as an ocean-bearing rocky planet." },
    tags: ["habitable world", "terrestrial planet"],
    featured: true,
  },
  {
    id: "moon",
    name: "Moon",
    aliases: ["Luna"],
    category: "moon",
    summary: "Earth's natural satellite and the nearest major astronomical body.",
    description:
      "The Moon is an airless rocky body whose craters, basins, and ancient volcanic plains record the early impact history of the inner Solar System.",
    scientificSignificance:
      "The Moon anchors lunar chronology, helps test impact history models, and remains a key target for human and robotic exploration.",
    measurements: [
      { label: "Equatorial diameter", value: "3,475", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "0.073 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Earth", value: "0.384", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["silicate rock", "regolith"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "earth", kind: "orbits" },
      { targetId: "mars", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "The Moon represented as an airless cratered satellite." },
    tags: ["satellite", "lunar science"],
  },
  {
    id: "mars",
    name: "Mars",
    aliases: ["Red Planet"],
    category: "planet",
    summary: "A cold desert world with evidence for a wetter ancient past.",
    description:
      "Mars has volcanoes, canyons, polar deposits, dust storms, and surface minerals that preserve evidence of past water activity.",
    scientificSignificance:
      "Mars is a major target for understanding planetary habitability, climate loss, and whether life could have emerged beyond Earth.",
    measurements: [
      { label: "Equatorial diameter", value: "6,792", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "0.642 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Sun", value: "228.0", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["silicate rock", "iron oxide dust", "thin carbon dioxide atmosphere"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "earth", kind: "compares-with" },
      { targetId: "sun", kind: "orbits" },
    ],
    media: { type: "placeholder", alt: "Mars represented as a red rocky planet." },
    tags: ["terrestrial planet", "astrobiology"],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    aliases: [],
    category: "planet",
    summary: "The largest planet in the Solar System and a dominant gravitational presence.",
    description:
      "Jupiter is a gas giant with a deep atmosphere, strong magnetic field, complex weather systems, rings, and many moons.",
    scientificSignificance:
      "Jupiter preserves clues about Solar System formation and strongly shapes the orbital architecture of smaller bodies.",
    measurements: [
      { label: "Equatorial diameter", value: "142,984", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "1,898 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Sun", value: "778.5", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["hydrogen", "helium", "trace compounds"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "sun", kind: "orbits" },
      { targetId: "earth", kind: "compares-with" },
      { targetId: "europa", kind: "orbited-by" },
      { targetId: "ganymede", kind: "orbited-by" },
    ],
    media: { type: "placeholder", alt: "Jupiter represented as a banded gas giant." },
    tags: ["gas giant", "magnetosphere"],
    featured: true,
  },
  {
    id: "saturn",
    name: "Saturn",
    aliases: [],
    category: "planet",
    summary: "A gas giant with the Solar System's most prominent ring system.",
    description:
      "Saturn is a low-density gas giant whose rings and icy moons provide a natural laboratory for disk dynamics and planetary satellite systems.",
    scientificSignificance:
      "Saturn connects planetary atmospheres, ring physics, and ocean-world astrobiology through moons such as Titan and Enceladus.",
    measurements: [
      { label: "Equatorial diameter", value: "120,536", unit: "km", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mass", value: "568 x 10^24", unit: "kg", confidence: "measured", sourceIds: [planetarySource] },
      { label: "Mean distance from Sun", value: "1,432.0", unit: "million km", confidence: "measured", sourceIds: [planetarySource] },
    ],
    composition: ["hydrogen", "helium", "water ice rings"],
    sourceIds: [planetarySource],
    relationships: [
      { targetId: "jupiter", kind: "compares-with" },
      { targetId: "sun", kind: "orbits" },
      { targetId: "titan", kind: "orbited-by" },
      { targetId: "enceladus", kind: "orbited-by" },
    ],
    media: { type: "placeholder", alt: "Saturn represented as a ringed gas giant." },
    tags: ["gas giant", "rings"],
  },
  {
    id: "uranus",
    name: "Uranus",
    aliases: [],
    category: "planet",
    summary: "An ice giant with an extreme axial tilt and an unusual magnetic field.",
    description:
      "Uranus is an ice giant whose rotation axis is tilted so far that the planet effectively rolls around the Sun. Its magnetic field is tilted and offset from the planet's center.",
    scientificSignificance:
      "Uranus is central to understanding ice giant interiors, tilted magnetospheres, seasonal extremes, and a common class of planets around other stars.",
    measurements: [
      { label: "Equatorial radius", value: "25,559", unit: "km", confidence: "measured", sourceIds: ["nasa-uranus-facts"] },
      { label: "Mean distance from Sun", value: "2.871", unit: "billion km", confidence: "measured", sourceIds: ["nasa-uranus-facts"] },
      { label: "Magnetic axis tilt", value: "nearly 60", unit: "degrees", confidence: "measured", sourceIds: ["nasa-uranus-facts"] },
    ],
    composition: ["hydrogen", "helium", "water/ammonia/methane ices", "rocky material"],
    sourceIds: ["nasa-uranus-facts"],
    relationships: [
      { targetId: "neptune", kind: "compares-with" },
      { targetId: "sun", kind: "orbits" },
    ],
    media: { type: "placeholder", alt: "Uranus represented as a pale cyan tilted ice giant." },
    tags: ["ice giant", "tilted planet", "magnetosphere"],
  },
  {
    id: "neptune",
    name: "Neptune",
    aliases: [],
    category: "planet",
    summary: "The outermost major planet, an ice giant with dynamic winds and storms.",
    description:
      "Neptune is a cold ice giant with a deep atmosphere, strong winds, faint rings, and a magnetosphere that is tilted relative to its rotation.",
    scientificSignificance:
      "Neptune helps astronomers understand ice giant physics, atmospheric dynamics far from the Sun, and planets discovered through gravitational prediction.",
    measurements: [
      { label: "Equatorial radius", value: "24,764", unit: "km", confidence: "measured", sourceIds: ["nasa-neptune-facts"] },
      { label: "Mass", value: "102.4 x 10^24", unit: "kg", confidence: "measured", sourceIds: ["nasa-neptune-facts"] },
      { label: "Mean distance from Sun", value: "4,515", unit: "million km", confidence: "measured", sourceIds: ["nasa-neptune-facts"] },
    ],
    composition: ["hydrogen", "helium", "methane", "water/ammonia ices"],
    sourceIds: ["nasa-neptune-facts"],
    relationships: [
      { targetId: "uranus", kind: "compares-with" },
      { targetId: "sun", kind: "orbits" },
    ],
    media: { type: "placeholder", alt: "Neptune represented as a deep blue ice giant." },
    tags: ["ice giant", "outer solar system", "atmospheric dynamics"],
  },
  {
    id: "europa",
    name: "Europa",
    aliases: ["Jupiter II"],
    category: "moon",
    summary: "An icy moon of Jupiter with strong evidence for a subsurface ocean.",
    description:
      "Europa is a bright, fractured icy world. Its global ocean hypothesis and chemically active surface make it one of the most important astrobiology targets in the Solar System.",
    scientificSignificance:
      "Europa connects orbital tides, ocean-world habitability, surface chemistry, and mission-driven exploration through NASA's Europa Clipper.",
    measurements: [
      { label: "Diameter", value: "3,100", unit: "km", confidence: "measured", sourceIds: ["jpl-europa-clipper-quick-facts"] },
      { label: "Orbital distance from Jupiter", value: "671,000", unit: "km", confidence: "measured", sourceIds: ["jpl-europa-clipper-quick-facts"] },
      { label: "Orbital period", value: "3.55", unit: "Earth days", confidence: "measured", sourceIds: ["jpl-europa-clipper-quick-facts"] },
    ],
    composition: ["water ice", "silicate rock", "possible salty ocean"],
    sourceIds: ["jpl-europa-clipper-quick-facts"],
    relationships: [
      { targetId: "jupiter", kind: "orbits" },
      { targetId: "ganymede", kind: "compares-with" },
      { targetId: "enceladus", kind: "compares-with", note: "Both are ocean-world candidates with astrobiological interest." },
    ],
    media: { type: "placeholder", alt: "Europa represented as a fractured icy moon." },
    tags: ["ocean world", "astrobiology", "jupiter moon"],
    featured: true,
  },
  {
    id: "ganymede",
    name: "Ganymede",
    aliases: ["Jupiter III"],
    category: "moon",
    summary: "The largest moon in the Solar System and the only moon known to have its own magnetic field.",
    description:
      "Ganymede is larger than Mercury and has a complex icy surface. Its intrinsic magnetic field sets it apart from every other known moon.",
    scientificSignificance:
      "Ganymede gives scientists a rare natural laboratory for icy satellite interiors, magnetospheres, and Jovian system evolution.",
    measurements: [
      { label: "Status", value: "largest moon in the Solar System", confidence: "measured", sourceIds: ["nasa-ganymede-facts"] },
      { label: "Magnetic field", value: "intrinsic field detected", confidence: "measured", sourceIds: ["nasa-ganymede-facts"] },
    ],
    composition: ["water ice", "silicate rock", "metallic core"],
    sourceIds: ["nasa-ganymede-facts"],
    relationships: [
      { targetId: "jupiter", kind: "orbits" },
      { targetId: "europa", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "Ganymede represented as a large grooved icy moon." },
    tags: ["jupiter moon", "largest moon", "magnetic field"],
  },
  {
    id: "titan",
    name: "Titan",
    aliases: ["Saturn VI"],
    category: "moon",
    summary: "Saturn's largest moon, with a dense atmosphere and surface liquids.",
    description:
      "Titan is an icy world hidden beneath a golden haze. It has a dense nitrogen-rich atmosphere and liquid hydrocarbons on its surface.",
    scientificSignificance:
      "Titan expands habitability thinking beyond water-rich worlds by combining atmospheric chemistry, surface liquids, and organic molecules.",
    measurements: [
      { label: "Radius", value: "2,575", unit: "km", confidence: "measured", sourceIds: ["nasa-titan-facts"] },
      { label: "Surface pressure", value: "about 60% greater than Earth", confidence: "measured", sourceIds: ["nasa-titan-facts"] },
    ],
    composition: ["water ice", "rock", "nitrogen atmosphere", "methane and hydrocarbons"],
    sourceIds: ["nasa-titan-facts"],
    relationships: [
      { targetId: "saturn", kind: "orbits" },
      { targetId: "enceladus", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "Titan represented as a hazy orange moon." },
    tags: ["saturn moon", "atmosphere", "organic chemistry"],
    featured: true,
  },
  {
    id: "enceladus",
    name: "Enceladus",
    aliases: [],
    category: "moon",
    summary: "A small icy moon of Saturn with plumes connected to a subsurface ocean.",
    description:
      "Enceladus ejects icy material from its south polar region. Cassini measurements link the plumes to a global subsurface saltwater ocean and possible hydrothermal activity.",
    scientificSignificance:
      "Enceladus is one of the most compelling astrobiology targets because spacecraft have directly sampled material from an ocean-world plume.",
    measurements: [
      { label: "Diameter", value: "about 500", unit: "km", confidence: "estimate", sourceIds: ["nasa-enceladus-cassini"] },
      { label: "Ocean evidence", value: "global subsurface saltwater ocean", confidence: "modeled", sourceIds: ["nasa-enceladus-cassini"], note: "Inferred from Cassini gravity, libration and plume measurements; the ocean interior was not directly imaged." },
    ],
    composition: ["water ice", "salty ocean", "rocky core", "organic compounds"],
    sourceIds: ["nasa-enceladus-cassini"],
    relationships: [
      { targetId: "saturn", kind: "orbits" },
      { targetId: "europa", kind: "compares-with" },
      { targetId: "titan", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "Enceladus represented as a bright icy moon with plumes." },
    tags: ["saturn moon", "ocean world", "plumes", "astrobiology"],
    featured: true,
  },
  {
    id: "sun",
    name: "Sun",
    aliases: ["Sol"],
    category: "star",
    summary: "A main-sequence star that contains nearly all mass in the Solar System.",
    description:
      "The Sun is a magnetically active star powered by nuclear fusion in its core. Its radiation and solar wind shape the environments of all Solar System bodies.",
    scientificSignificance:
      "The Sun is the nearest laboratory for stellar physics and the energy source for Earth's climate system.",
    measurements: [
      { label: "Mean radius", value: "695,700", unit: "km", confidence: "measured", sourceIds: [sunSource] },
      { label: "Mass", value: "1.9884 x 10^30", unit: "kg", confidence: "measured", sourceIds: [sunSource] },
      { label: "Effective temperature", value: "5,772", unit: "K", confidence: "modeled", sourceIds: [sunSource] },
    ],
    composition: ["hydrogen", "helium", "trace heavier elements"],
    sourceIds: [sunSource],
    relationships: [
      { targetId: "earth", kind: "orbited-by" },
      { targetId: "jupiter", kind: "orbited-by" },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "The Sun represented as a magnetically active star." },
    tags: ["star", "solar physics", "fusion"],
    featured: true,
  },
  {
    id: "sirius",
    name: "Sirius",
    aliases: ["Alpha Canis Majoris", "Dog Star"],
    category: "star",
    coordinates: { constellation: "Canis Major" },
    summary: "The brightest star in Earth's night sky, seen as a nearby binary system.",
    description:
      "Sirius appears extraordinarily bright from Earth because it is both intrinsically luminous and relatively nearby. The system includes Sirius A and the faint white dwarf companion Sirius B.",
    scientificSignificance:
      "Sirius is important for stellar astronomy because it combines naked-eye prominence, binary-star dynamics, and white dwarf evolution in a nearby system.",
    measurements: [
      { label: "Spectral type", value: "A0mA1Va", confidence: "measured", sourceIds: ["simbad-sirius"] },
      { label: "Visual status", value: "brightest star in Earth's night sky", confidence: "contextual", sourceIds: ["nasa-apod-sirius"] },
      { label: "Companion", value: "Sirius B, a faint white dwarf", confidence: "measured", sourceIds: ["nasa-apod-sirius"] },
    ],
    composition: ["hydrogen", "helium", "white dwarf companion"],
    sourceIds: ["simbad-sirius", "nasa-apod-sirius"],
    relationships: [
      { targetId: "sun", kind: "near" },
      { targetId: "proxima-centauri", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "Sirius represented as a brilliant blue-white binary star." },
    tags: ["binary star", "bright star", "white dwarf"],
  },
  {
    id: "rigel",
    name: "Rigel",
    aliases: ["Beta Orionis"],
    category: "star",
    coordinates: { constellation: "Orion" },
    summary: "A luminous blue supergiant system in Orion.",
    description:
      "Rigel is one of Orion's brightest stars and is cataloged as a blue supergiant. Its high luminosity and evolved state make it a useful comparison point for massive-star evolution.",
    scientificSignificance:
      "Rigel helps illustrate how massive stars differ from Sun-like stars: they are brighter, shorter-lived, and evolve toward dramatic late-stage outcomes.",
    measurements: [
      { label: "Spectral type", value: "B8Ia", confidence: "measured", sourceIds: ["simbad-rigel"] },
      { label: "Evolutionary class", value: "blue supergiant", confidence: "measured", sourceIds: ["simbad-rigel"] },
    ],
    composition: ["hydrogen", "helium", "heavier elements"],
    sourceIds: ["simbad-rigel"],
    relationships: [
      { targetId: "betelgeuse", kind: "compares-with", note: "Both are luminous evolved stars in Orion, but with different colors and temperatures." },
      { targetId: "orion-nebula", kind: "associated-with" },
    ],
    media: { type: "placeholder", alt: "Rigel represented as a blue supergiant star." },
    tags: ["blue supergiant", "massive star", "orion"],
  },
  {
    id: "proxima-centauri",
    name: "Proxima Centauri",
    aliases: ["Alpha Centauri C"],
    category: "star",
    summary: "The closest known star to the Sun, a faint red dwarf and flare star.",
    description:
      "Proxima Centauri is a low-mass red dwarf in the Alpha Centauri system. Its flare activity matters for interpreting planets in its habitable zone.",
    scientificSignificance:
      "As the nearest stellar neighbor, Proxima is central to exoplanet habitability studies and future interstellar mission concepts.",
    measurements: [
      { label: "Distance from Earth", value: "just over 4", unit: "light-years", confidence: "measured", sourceIds: ["nasa-proxima-centauri"] },
      { label: "Mass", value: "about 1/8", unit: "solar masses", confidence: "estimate", sourceIds: ["nasa-proxima-centauri"] },
    ],
    composition: ["hydrogen", "helium"],
    sourceIds: ["nasa-proxima-centauri"],
    relationships: [
      { targetId: "sun", kind: "near" },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "Proxima Centauri represented as a small red dwarf star." },
    tags: ["red dwarf", "flare star", "nearest stars"],
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    aliases: ["Alpha Orionis"],
    category: "star",
    coordinates: { constellation: "Orion" },
    summary: "A massive red supergiant in Orion nearing the late stages of stellar evolution.",
    description:
      "Betelgeuse is a variable red supergiant whose size, brightness changes, and mass loss help astronomers study the final stages of massive stars.",
    scientificSignificance:
      "Betelgeuse is a nearby case study for red supergiant physics and the uncertain path toward core-collapse supernovae.",
    measurements: [
      { label: "Distance", value: "about 700", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-betelgeuse"] },
      { label: "Age", value: "roughly 10 million", unit: "years", confidence: "estimate", sourceIds: ["nasa-betelgeuse"] },
      { label: "Mass", value: "around 15", unit: "solar masses", confidence: "estimate", sourceIds: ["nasa-betelgeuse"] },
    ],
    composition: ["hydrogen", "helium", "heavier fusion products"],
    sourceIds: ["nasa-betelgeuse"],
    relationships: [
      { targetId: "orion-nebula", kind: "associated-with" },
      { targetId: "sun", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "Betelgeuse represented as a swollen red supergiant." },
    tags: ["red supergiant", "stellar evolution", "variable star"],
  },
  {
    id: "milky-way",
    name: "Milky Way",
    aliases: ["The Galaxy"],
    category: "galaxy",
    summary: "Our home barred spiral galaxy, containing the Solar System.",
    description:
      "The Milky Way is a barred spiral galaxy made of stars, gas, dust, dark matter, and stellar remnants. Because we live inside it, its full structure is inferred from many indirect measurements.",
    scientificSignificance:
      "The Milky Way is the benchmark for galactic structure, stellar populations, dark matter mapping, and the connection between galaxies and their central black holes.",
    measurements: [
      { label: "Disk diameter", value: "about 100,000", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-milky-way-imagine"] },
      { label: "Stars", value: "approximately 100 billion", confidence: "estimate", sourceIds: ["nasa-milky-way-imagine"] },
      { label: "Solar distance from center", value: "about 25,000", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-milky-way-imagine"] },
    ],
    composition: ["stars", "gas", "dust", "dark matter", "stellar remnants"],
    sourceIds: ["nasa-milky-way-imagine"],
    relationships: [
      { targetId: "sun", kind: "contains" },
      { targetId: "sagittarius-a-star", kind: "contains" },
      { targetId: "andromeda", kind: "associated-with", note: "Both are major galaxies in the Local Group." },
      { targetId: "sirius", kind: "contains" },
      { targetId: "cygnus-x-1", kind: "contains" },
      { targetId: "eagle-nebula", kind: "contains" },
    ],
    media: { type: "placeholder", alt: "The Milky Way represented as a barred spiral galaxy." },
    tags: ["barred spiral galaxy", "local group", "dark matter"],
    featured: true,
  },
  {
    id: "andromeda",
    name: "Andromeda Galaxy",
    aliases: ["M31", "Messier 31"],
    category: "galaxy",
    coordinates: { constellation: "Andromeda" },
    summary: "The nearest large galaxy to the Milky Way and a major Local Group member.",
    description:
      "Andromeda is a large spiral galaxy seen almost edge-on from Earth. It provides an external view of a galaxy broadly comparable to the Milky Way.",
    scientificSignificance:
      "Andromeda is crucial for studying galaxy structure, stellar halos, galaxy evolution, and the future interaction of the Local Group.",
    measurements: [
      { label: "Distance", value: "approximately 2.5 million", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-andromeda-hubble-history"] },
      { label: "Span", value: "about 260,000", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-andromeda-photojournal"] },
    ],
    composition: ["stars", "gas", "dust", "dark matter"],
    sourceIds: ["nasa-andromeda-hubble-history", "nasa-andromeda-photojournal"],
    relationships: [
      { targetId: "milky-way", kind: "associated-with" },
      { targetId: "triangulum-galaxy", kind: "near" },
    ],
    media: { type: "placeholder", alt: "Andromeda represented as an inclined spiral galaxy." },
    tags: ["spiral galaxy", "local group", "galaxy evolution"],
    featured: true,
  },
  {
    id: "triangulum-galaxy",
    name: "Triangulum Galaxy",
    aliases: ["M33", "Messier 33"],
    category: "galaxy",
    coordinates: { constellation: "Triangulum" },
    summary: "A nearby spiral galaxy and one of the major members of the Local Group.",
    description:
      "The Triangulum Galaxy is a spiral galaxy near Andromeda and the Milky Way. Observations of variable stars in M33 helped establish that it lies outside the Milky Way.",
    scientificSignificance:
      "M33 is a key Local Group galaxy for distance-scale work, star formation studies, and comparisons among spiral galaxies of different masses.",
    measurements: [
      { label: "Galaxy type", value: "spiral galaxy", confidence: "measured", sourceIds: ["nasa-triangulum-m33"] },
      { label: "Historical role", value: "helped establish extragalactic distances", confidence: "contextual", sourceIds: ["nasa-triangulum-m33"] },
    ],
    composition: ["stars", "gas", "dust", "dark matter"],
    sourceIds: ["nasa-triangulum-m33"],
    relationships: [
      { targetId: "andromeda", kind: "near" },
      { targetId: "milky-way", kind: "associated-with" },
    ],
    media: { type: "placeholder", alt: "The Triangulum Galaxy represented as a face-on spiral galaxy." },
    tags: ["spiral galaxy", "local group", "distance scale"],
    featured: true,
  },
  {
    id: "m87",
    name: "M87",
    aliases: ["Messier 87", "Virgo A"],
    category: "galaxy",
    coordinates: { constellation: "Virgo" },
    summary: "A giant elliptical galaxy near the center of the Virgo Cluster.",
    description:
      "M87 is a massive elliptical galaxy with a relativistic jet and a central supermassive black hole imaged by the Event Horizon Telescope.",
    scientificSignificance:
      "M87 links galaxy cluster environments, jet physics, and direct observations of strong gravity near a supermassive black hole.",
    measurements: [
      { label: "Distance", value: "54 million", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-m87-hubble-catalog"] },
    ],
    composition: ["old stars", "globular clusters", "hot gas", "dark matter"],
    sourceIds: ["nasa-m87-hubble-catalog", "nasa-virgo-cluster", "eht-m87-paper"],
    relationships: [
      { targetId: "m87-star", kind: "contains" },
      { targetId: "virgo-cluster", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "M87 represented as a giant elliptical galaxy with a jet." },
    tags: ["elliptical galaxy", "relativistic jet", "virgo cluster"],
  },
  {
    id: "orion-nebula",
    name: "Orion Nebula",
    aliases: ["M42", "Messier 42"],
    category: "nebula",
    coordinates: { constellation: "Orion" },
    summary: "A nearby stellar nursery rich in gas, dust, and newborn stars.",
    description:
      "The Orion Nebula is a turbulent star-forming region where young massive stars sculpt surrounding clouds of gas and dust.",
    scientificSignificance:
      "It is a key laboratory for studying star formation, protoplanetary disks, and how radiation from young stars reshapes molecular clouds.",
    measurements: [
      { label: "Distance", value: "1,500", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-orion-nebula-hubble"] },
    ],
    composition: ["hydrogen gas", "dust", "young stars"],
    sourceIds: ["nasa-orion-nebula-hubble"],
    relationships: [
      { targetId: "betelgeuse", kind: "associated-with" },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "The Orion Nebula represented as a luminous star-forming cloud." },
    tags: ["nebula", "star formation", "hubble"],
  },
  {
    id: "eagle-nebula",
    name: "Eagle Nebula",
    aliases: ["M16", "Messier 16", "Pillars of Creation"],
    category: "nebula",
    coordinates: { constellation: "Serpens" },
    summary: "A star-forming nebula famous for the Pillars of Creation.",
    description:
      "The Eagle Nebula is a large star-forming region containing the Pillars of Creation, dense columns of gas and dust sculpted by nearby young stars.",
    scientificSignificance:
      "M16 is an iconic laboratory for triggered star formation, stellar feedback, and the way massive young stars reshape molecular clouds.",
    measurements: [
      { label: "Nebula span", value: "70 by 55", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-eagle-nebula-m16"] },
      { label: "Pillars height", value: "roughly 4 to 5", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-eagle-nebula-m16"] },
      { label: "Distance", value: "about 5,700", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-eagle-nebula-m16"] },
    ],
    composition: ["hydrogen gas", "dust", "young stars"],
    sourceIds: ["nasa-eagle-nebula-m16"],
    relationships: [
      { targetId: "orion-nebula", kind: "compares-with" },
      { targetId: "carina-nebula", kind: "compares-with" },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "The Eagle Nebula represented as pillar-like clouds of gas and dust." },
    tags: ["nebula", "star formation", "pillars of creation", "hubble", "webb"],
    featured: true,
  },
  {
    id: "carina-nebula",
    name: "Carina Nebula",
    aliases: ["NGC 3372", "Great Nebula in Carina"],
    category: "nebula",
    coordinates: { constellation: "Carina" },
    summary: "A massive star-forming complex shaped by young stars and stellar feedback.",
    description:
      "The Carina Nebula is an immense cloud of gas and dust where star birth and stellar feedback occur together, including regions carved by radiation and winds from massive stars.",
    scientificSignificance:
      "Carina is a nearby high-mass star formation laboratory, useful for studying how massive stars form, disrupt their surroundings, and trigger later generations of star formation.",
    measurements: [
      { label: "Distance", value: "7,500", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-carina-nebula"] },
      { label: "Environment", value: "star birth and death in a massive cloud", confidence: "contextual", sourceIds: ["nasa-carina-nebula"] },
    ],
    composition: ["hydrogen gas", "dust", "massive young stars"],
    sourceIds: ["nasa-carina-nebula"],
    relationships: [
      { targetId: "eagle-nebula", kind: "compares-with" },
      { targetId: "orion-nebula", kind: "compares-with" },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "The Carina Nebula represented as a turbulent star-forming cloud." },
    tags: ["nebula", "massive star formation", "stellar feedback", "hubble"],
    featured: true,
  },
  {
    id: "crab-nebula",
    name: "Crab Nebula",
    aliases: ["M1", "Messier 1"],
    category: "nebula",
    coordinates: { constellation: "Taurus" },
    summary: "A supernova remnant powered by a rapidly rotating neutron star.",
    description:
      "The Crab Nebula is the expanding remnant of a supernova observed in 1054. Its central pulsar drives high-energy emission and moving wisps.",
    scientificSignificance:
      "The Crab is a benchmark for supernova remnants, pulsar wind nebulae, and multi-wavelength high-energy astrophysics.",
    measurements: [
      { label: "Distance", value: "6,500", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-crab-nebula"] },
      { label: "Apparent magnitude", value: "8.4", confidence: "measured", sourceIds: ["nasa-crab-nebula"] },
    ],
    composition: ["ionized gas", "dust", "pulsar wind"],
    sourceIds: ["nasa-crab-nebula"],
    relationships: [
      { targetId: "betelgeuse", kind: "compares-with", note: "Both connect to massive-star death, but at different evolutionary stages." },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "The Crab Nebula represented as an expanding supernova remnant." },
    tags: ["supernova remnant", "pulsar", "high-energy astronomy"],
  },
  {
    id: "sagittarius-a-star",
    name: "Sagittarius A*",
    aliases: ["Sgr A*"],
    category: "black-hole",
    coordinates: { constellation: "Sagittarius" },
    summary: "The compact radio source associated with the Milky Way's central supermassive black hole.",
    description:
      "Sagittarius A* sits at the dynamical center of the Milky Way. Its mass is inferred from stellar orbits and its immediate environment has been imaged at event-horizon scales.",
    scientificSignificance:
      "It is the nearest supermassive black hole and a precision laboratory for stellar dynamics, accretion physics, and strong gravity.",
    measurements: [
      { label: "Mass", value: "about 4 million", unit: "solar masses", confidence: "measured", sourceIds: ["nasa-galactic-center-webb"] },
    ],
    composition: ["black hole", "accretion environment"],
    sourceIds: ["nasa-galactic-center-webb"],
    relationships: [
      { targetId: "milky-way", kind: "contained-by" },
      { targetId: "m87-star", kind: "compares-with" },
      { targetId: "cygnus-x-1", kind: "compares-with", note: "A stellar-mass black hole contrasts with the Milky Way's central supermassive black hole." },
    ],
    media: { type: "placeholder", alt: "Sagittarius A* represented as a compact gravitational center." },
    tags: ["supermassive black hole", "galactic center", "event horizon telescope"],
    featured: true,
  },
  {
    id: "m87-star",
    name: "M87*",
    aliases: ["M87 black hole"],
    category: "black-hole",
    coordinates: { constellation: "Virgo" },
    summary: "The supermassive black hole in M87, first imaged by the Event Horizon Telescope.",
    description:
      "M87* is a supermassive black hole whose shadow and surrounding emission ring were reconstructed from global very-long-baseline radio observations.",
    scientificSignificance:
      "M87* provides a direct observational testbed for black hole imaging, jet launching, and general relativity in the strong-field regime.",
    measurements: [
      { label: "Mass", value: "6.5 x 10^9", unit: "solar masses", confidence: "modeled", sourceIds: ["eht-m87-paper"], note: "2019 EHT inference: ±0.2 billion statistical and ±0.7 billion systematic uncertainty, using emission models and an adopted distance." },
      { label: "Galaxy distance", value: "54 million", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-m87-hubble-catalog"] },
    ],
    composition: ["black hole", "accretion flow", "relativistic jet environment"],
    sourceIds: ["eht-m87-paper", "nasa-m87-hubble-catalog"],
    relationships: [
      { targetId: "m87", kind: "contained-by" },
      { targetId: "sagittarius-a-star", kind: "compares-with" },
      { targetId: "cygnus-x-1", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "M87* represented as a black hole shadow and emission ring." },
    tags: ["supermassive black hole", "event horizon telescope", "relativistic jet"],
  },
  {
    id: "cygnus-x-1",
    name: "Cygnus X-1",
    aliases: ["Cyg X-1"],
    category: "black-hole",
    coordinates: { constellation: "Cygnus" },
    summary: "A famous X-ray binary containing a stellar-mass black hole candidate.",
    description:
      "Cygnus X-1 is a high-mass X-ray binary where a compact object accretes material from a massive companion star. Modern measurements support a stellar-mass black hole interpretation.",
    scientificSignificance:
      "Cygnus X-1 is historically important for black hole astronomy and remains a benchmark system for studying accretion, massive stars, and stellar-mass black hole formation.",
    measurements: [
      { label: "Black hole mass", value: "21.2 +/- 2.2", unit: "solar masses", confidence: "modeled", sourceIds: ["cygnus-x1-mass-paper"], note: "2021 inference combining radio astrometry and optical binary data." },
      { label: "Distance", value: "2.22 (+0.18 / -0.17)", unit: "kiloparsecs", confidence: "measured", sourceIds: ["cygnus-x1-mass-paper"] },
      { label: "System type", value: "high-mass X-ray binary", confidence: "measured", sourceIds: ["cygnus-x1-mass-paper"] },
    ],
    composition: ["black hole", "massive companion star", "accretion flow"],
    sourceIds: ["cygnus-x1-mass-paper"],
    relationships: [
      { targetId: "sagittarius-a-star", kind: "compares-with" },
      { targetId: "m87-star", kind: "compares-with" },
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "Cygnus X-1 represented as a black hole accreting from a massive companion star." },
    tags: ["stellar-mass black hole", "x-ray binary", "accretion", "massive star"],
    featured: true,
  },
  {
    id: "pleiades",
    name: "Pleiades",
    aliases: ["M45", "Seven Sisters"],
    category: "cluster",
    coordinates: { constellation: "Taurus" },
    summary: "A nearby young open star cluster visible to the unaided eye.",
    description:
      "The Pleiades is an open cluster of young stars whose distance and age have made it important for calibrating stellar evolution models.",
    scientificSignificance:
      "Its proximity and youth make it a benchmark for stellar ages, cluster dynamics, and observational calibration.",
    measurements: [
      { label: "Distance", value: "about 440", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-pleiades-distance"] },
    ],
    composition: ["young stars", "reflection nebulosity"],
    sourceIds: ["nasa-pleiades-distance"],
    relationships: [
      { targetId: "milky-way", kind: "contained-by" },
    ],
    media: { type: "placeholder", alt: "The Pleiades represented as a compact blue star cluster." },
    tags: ["open cluster", "stellar evolution", "calibration"],
  },
  {
    id: "virgo-cluster",
    name: "Virgo Cluster",
    aliases: [],
    category: "cluster",
    coordinates: { constellation: "Virgo" },
    summary: "The nearest large galaxy cluster and home to M87.",
    description:
      "The Virgo Cluster is a rich nearby collection of galaxies whose gravity shapes the local cosmic environment.",
    scientificSignificance:
      "It anchors studies of galaxy clusters, intracluster gas, galaxy evolution in dense environments, and local large-scale structure.",
    measurements: [
      { label: "Distance", value: "about 54 million", unit: "light-years", confidence: "estimate", sourceIds: ["nasa-virgo-cluster"] },
    ],
    composition: ["galaxies", "hot intracluster gas", "dark matter"],
    sourceIds: ["nasa-virgo-cluster"],
    relationships: [
      { targetId: "m87", kind: "contains" },
      { targetId: "bullet-cluster", kind: "compares-with" },
    ],
    media: { type: "placeholder", alt: "The Virgo Cluster represented as many galaxies in a gravitational structure." },
    tags: ["galaxy cluster", "large-scale structure", "dark matter"],
  },
  {
    id: "bullet-cluster",
    name: "Bullet Cluster",
    aliases: ["1E 0657-56"],
    category: "cluster",
    summary: "A collision of galaxy clusters famous for separating hot gas from inferred mass.",
    description:
      "The Bullet Cluster is a merging cluster system where X-ray emitting gas and gravitational-lensing mass distributions are offset.",
    scientificSignificance:
      "It is one of the strongest observational examples used to study dark matter because lensing maps trace mass differently from the hot ordinary gas.",
    measurements: [
      { label: "Evidence type", value: "gravitational lensing plus X-ray gas mapping", confidence: "measured", sourceIds: ["nasa-bullet-cluster-webb"] },
    ],
    composition: ["galaxies", "hot gas", "dark matter inferred from lensing"],
    sourceIds: ["nasa-bullet-cluster-webb"],
    relationships: [
      { targetId: "virgo-cluster", kind: "compares-with" },
      { targetId: "dark-matter", kind: "evidence-for" },
    ],
    media: { type: "placeholder", alt: "The Bullet Cluster represented as separated gas and mass distributions." },
    tags: ["dark matter", "gravitational lensing", "galaxy cluster"],
    featured: true,
  },
  {
    id: "dark-matter",
    name: "Dark Matter",
    aliases: [],
    category: "concept",
    summary: "An inferred form of matter used to explain multiple gravitational observations.",
    description:
      "Dark matter is not directly identified. It is inferred from galaxy rotation, gravitational lensing, cluster dynamics, cosmic microwave background structure, and large-scale structure.",
    scientificSignificance:
      "Dark matter is one of the central unsolved problems in astrophysics. Current observations strongly constrain its gravitational role but not its particle identity.",
    measurements: [
      { label: "Status", value: "inferred, not directly identified", confidence: "contextual", sourceIds: ["nasa-dark-matter", "nasa-bullet-cluster-webb"] },
    ],
    composition: ["unknown"],
    sourceIds: ["nasa-dark-matter", "nasa-bullet-cluster-webb"],
    relationships: [
      { targetId: "bullet-cluster", kind: "associated-with" },
      { targetId: "milky-way", kind: "associated-with" },
    ],
    media: { type: "placeholder", alt: "Dark matter represented as an inferred gravitational structure." },
    tags: ["cosmology", "uncertainty", "lensing"],
  },
];
