import { cosmicScale } from "@/content/cosmic-scale";
import { journeys } from "@/content/journeys";
import { objects } from "@/content/objects";
import { sourceById, sources } from "@/content/sources";
import type { AstronomicalObject, ObjectCategory } from "@/types/astronomy";
import type { ScientificSource } from "@/types/sources";

export function getAllObjects() {
  return objects;
}

export function getObjectById(id: string) {
  return objects.find((object) => object.id === id);
}

export function getFeaturedObjects() {
  return objects.filter((object) => object.featured);
}

export function getObjectsByCategory(category: ObjectCategory) {
  return objects.filter((object) => object.category === category);
}

export function getRelatedObjects(object: AstronomicalObject) {
  return object.relationships
    .map((relationship) => {
      const target = getObjectById(relationship.targetId);
      return target ? { relationship, target } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function getSourcesForObject(object: AstronomicalObject) {
  const ids = new Set([
    ...object.sourceIds,
    ...object.measurements.flatMap((measurement) => measurement.sourceIds),
  ]);

  return [...ids]
    .map((id) => sourceById.get(id))
    .filter((source): source is ScientificSource => Boolean(source));
}

export function getSourceById(id: string) {
  return sourceById.get(id);
}

export function getAllSources() {
  return sources;
}

export function getCosmicScale() {
  return [...cosmicScale].sort((a, b) => a.order - b.order);
}

export function getScaleNodeById(id: string) {
  return cosmicScale.find((node) => node.id === id);
}

export function getJourneys() {
  return journeys;
}

export function getJourneyById(id: string) {
  return journeys.find((journey) => journey.id === id);
}

export function searchCatalog(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return objects;
  }

  return objects.filter((object) => {
    const haystack = [
      object.name,
      object.category,
      object.summary,
      object.description,
      ...object.aliases,
      ...object.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
