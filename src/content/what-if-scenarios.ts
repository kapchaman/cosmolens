import type { WhatIfScenario } from "@/types/lab";

export const whatIfScenarios: WhatIfScenario[] = [
  {
    id: "earth-double-mass",
    title: "What if Earth had twice the mass?",
    summary: "A planetary-physics thought experiment about gravity, atmosphere, geology, and habitability.",
    parameter: {
      id: "massMultiplier",
      label: "Earth mass multiplier",
      min: 1,
      max: 3,
      step: 0.25,
      initial: 2,
      unit: "x Earth",
      assumption: "The quick estimate assumes Earth's radius is held fixed, so surface gravity scales with mass.",
    },
    boundary:
      "This is a hypothetical model. Real planets with more mass may also have different radius, composition, atmosphere, and formation history.",
    outcomes: [
      {
        label: "Surface gravity",
        body: "If radius stayed the same, surface gravity would scale upward with mass. Biology, flight, mountains, and launch energy would all be affected.",
        integrity: "modeled-consequence",
      },
      {
        label: "Atmosphere",
        body: "A stronger gravitational field would make atmospheric escape harder, but the final atmosphere would still depend on chemistry, impacts, volcanism, and stellar radiation.",
        integrity: "modeled-consequence",
      },
      {
        label: "Habitability",
        body: "Higher mass alone does not determine habitability. Water, climate feedbacks, magnetic environment, and orbital history would still matter.",
        integrity: "established-physics",
      },
    ],
    aiQuestion:
      "Explain the hypothetical scenario 'Earth has twice the mass' without pretending it is a prediction. Separate fixed-radius assumptions from more realistic planet-formation uncertainty.",
  },
  {
    id: "moon-disappears",
    title: "What if the Moon disappeared?",
    summary: "A lunar-system scenario about tides, orbital dynamics, night sky brightness, and long-term axial stability.",
    boundary:
      "The Moon cannot simply vanish under known physics. Consequences depend on how mass and angular momentum are removed, so this is a deliberately artificial scenario.",
    outcomes: [
      {
        label: "Tides",
        body: "Solar tides would remain, but the dominant lunar contribution to ocean tides would be lost. Local coastlines would respond differently.",
        integrity: "established-physics",
      },
      {
        label: "Axial stability",
        body: "The Moon helps stabilize Earth's axial tilt over long timescales. Without it, climate variability could become more chaotic over geological time.",
        integrity: "modeled-consequence",
      },
      {
        label: "Night environment",
        body: "Moonlit nights, eclipses, and many ecological light cues would disappear, but stars and planets would become more visible.",
        integrity: "established-physics",
      },
    ],
    aiQuestion:
      "Explain what would happen if the Moon disappeared. Clearly label the scenario as artificial and distinguish immediate effects from long-term dynamical effects.",
  },
  {
    id: "sun-red-giant-today",
    title: "What if the Sun became a red giant today?",
    summary: "A stellar-evolution scenario that is physically useful but deliberately impossible on human timescales.",
    boundary:
      "The Sun will not become a red giant today. Stellar evolution operates over billions of years, so this scenario compresses an impossible timescale.",
    outcomes: [
      {
        label: "Energy balance",
        body: "A greatly expanded, more luminous Sun would destroy present-day habitability in the inner Solar System.",
        integrity: "established-physics",
      },
      {
        label: "Orbital environment",
        body: "The Sun's mass loss and expansion would alter planetary conditions, but exact outcomes require stellar-evolution and orbital models.",
        integrity: "modeled-consequence",
      },
      {
        label: "Scientific boundary",
        body: "This is useful for understanding red giants, not for forecasting an actual sudden solar transformation.",
        integrity: "established-physics",
      },
    ],
    aiQuestion:
      "Explain the red-giant Sun thought experiment. Emphasize that it cannot happen today and use it only to teach stellar evolution and habitability.",
  },
  {
    id: "milky-way-no-dark-matter",
    title: "What if the Milky Way had no dark matter?",
    summary: "A galaxy-dynamics scenario about rotation curves, mass models, and why dark matter is inferred.",
    boundary:
      "Dark matter is inferred from multiple observations. Removing it from a galaxy is a conceptual model, not a known physical process.",
    outcomes: [
      {
        label: "Rotation curve",
        body: "Visible matter alone would predict a stronger decline in orbital speeds at large radius than astronomers observe in many spiral galaxies.",
        integrity: "established-physics",
      },
      {
        label: "Galaxy structure",
        body: "The disk's long-term stability and satellite dynamics would be different, but the exact galaxy would require a numerical simulation.",
        integrity: "modeled-consequence",
      },
      {
        label: "Evidence chain",
        body: "This scenario connects to rotation curves, lensing, cluster collisions, and large-scale structure rather than proving the particle identity of dark matter.",
        integrity: "established-physics",
      },
    ],
    aiQuestion:
      "Explain what a Milky Way without dark matter would imply. Do not claim dark matter's particle identity is known; focus on evidence and uncertainty.",
  },
];
