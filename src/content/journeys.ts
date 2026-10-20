import type { GuidedJourney } from "@/types/astronomy";

export const journeys: GuidedJourney[] = [
  {
    id: "dark-matter-evidence",
    conclusion: { title: "Independent evidence matters.", body: "Orbital motion and gravitational lensing provide independent ways to infer mass. In merging clusters, lensing maps can be offset from the X-ray-emitting gas. Together these observations support dark matter, but they do not identify its particle nature." },
    atlasQuery: "dark matter",
    comparison: { left: "bullet-cluster", right: "virgo-cluster" },
    suggestedQuestion: "Compare the evidence from rotation curves and cluster lensing. What does it tell us about mass, and what does it leave unknown about dark matter?",
    title: "How do we know dark matter exists?",
    summary:
      "Follow several independent lines of evidence: galaxy rotation, lensing, cluster collisions, and large-scale structure.",
    status: "mvp",
    steps: [
      {
        id: "rotation-curves",
        title: "Galaxy rotation curves",
        summary: "Observed orbital speeds stay higher than visible matter alone predicts.",
        objectIds: ["milky-way", "dark-matter"],
        visualization: "rotation-curve",
      },
      {
        id: "lensing",
        title: "Gravitational lensing",
        summary: "Mass bends light, allowing astronomers to map matter that is not directly luminous.",
        objectIds: ["bullet-cluster", "dark-matter"],
        visualization: "lensing",
      },
      {
        id: "bullet-cluster",
        title: "Bullet Cluster",
        summary: "A cluster collision separates hot ordinary gas from the inferred gravitational mass.",
        objectIds: ["bullet-cluster"],
      },
    ],
  },
  {
    id: "life-of-a-star",
    conclusion: { title: "A star’s mass shapes its evolution.", body: "Stars form in collapsing gas clouds and spend their main-sequence lives fusing hydrogen. Their later evolution depends strongly on mass: a Sun-like star leaves a white dwarf, while massive stars can undergo core collapse. An HR diagram compares stellar properties; it is not a single life track followed by every star." },
    atlasQuery: "star",
    comparison: { left: "sun", right: "betelgeuse" },
    suggestedQuestion: "Compare the evolution of the Sun and a massive star such as Betelgeuse. Separate observations from stellar models, and explain what an HR diagram can tell us.",
    title: "The life of a star",
    summary: "From stellar nurseries to main-sequence stars, red supergiants, and stellar remnants.",
    status: "mvp",
    steps: [
      {
        id: "stellar-nursery",
        title: "Birth in nebulae",
        summary: "Dense gas and dust collapse into new stars.",
        objectIds: ["orion-nebula", "eagle-nebula", "carina-nebula"],
      },
      {
        id: "main-sequence",
        title: "Long nuclear balance",
        summary: "Stars spend most of their lives balancing gravity and fusion pressure.",
        objectIds: ["sun", "proxima-centauri"],
        visualization: "hr-diagram",
      },
      {
        id: "massive-star-death",
        title: "Massive-star endings",
        summary: "Massive stars evolve quickly and can end as supernovae.",
        objectIds: ["betelgeuse", "rigel", "crab-nebula", "cygnus-x-1"],
      },
    ],
  },
  {
    id: "universe-expansion",
    conclusion: { title: "Expansion emerges on large scales.", body: "The large-scale distance–redshift trend supports an expanding universe. Local gravitational motion can dominate nearby, so Andromeda approaching the Milky Way is not a contradiction. Measuring expansion history requires calibrated distances and models, not a straight line alone." },
    atlasQuery: "galaxy",
    comparison: { left: "andromeda", right: "milky-way" },
    suggestedQuestion: "How does the distance–redshift relation support cosmic expansion, and why can Andromeda approach the Milky Way? Distinguish observations, distance calibration, and model assumptions.",
    title: "How do we know the universe is expanding?",
    summary:
      "Explore recession velocities, distance indicators, Hubble-Lemaitre expansion, and why local motion can differ from cosmic expansion.",
    status: "mvp",
    steps: [
      {
        id: "distance-velocity",
        title: "Distance versus recession velocity",
        summary: "On large scales, more distant galaxies tend to show larger recession velocities.",
        objectIds: ["virgo-cluster", "m87"],
        visualization: "hubble-diagram",
      },
      {
        id: "local-motion",
        title: "Local motion still matters",
        summary: "Nearby systems can move toward each other even while the universe expands on larger scales.",
        objectIds: ["andromeda", "milky-way"],
      },
      {
        id: "cosmic-model",
        title: "From observation to model",
        summary: "Expansion history is inferred by combining multiple observations with cosmological models.",
        objectIds: ["dark-matter", "virgo-cluster"],
      },
    ],
  },
];
