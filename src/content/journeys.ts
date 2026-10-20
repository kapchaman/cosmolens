import type { GuidedJourney } from "@/types/astronomy";

export const journeys: GuidedJourney[] = [
  {
    id: "dark-matter-evidence",
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
