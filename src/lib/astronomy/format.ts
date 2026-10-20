import type { MeasurementConfidence, ObjectCategory } from "@/types/astronomy";

export function formatCategory(category: ObjectCategory) {
  const labels: Record<ObjectCategory, string> = {
    planet: "Planet",
    moon: "Moon",
    star: "Star",
    galaxy: "Galaxy",
    nebula: "Nebula",
    "black-hole": "Black hole",
    cluster: "Cluster",
    concept: "Concept",
  };

  return labels[category];
}

export function formatConfidence(confidence: MeasurementConfidence) {
  const labels: Record<MeasurementConfidence, string> = {
    measured: "Measured",
    estimate: "Estimate",
    modeled: "Modeled",
    theoretical: "Theoretical",
    contextual: "Contextual",
  };

  return labels[confidence];
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
