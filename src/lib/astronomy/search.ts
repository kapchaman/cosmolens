import { getAllObjects, getCosmicScale, getJourneys } from "@/lib/astronomy/catalog";

export type SearchResult = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  href: string;
  score: number;
};

export function globalSearch(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const scoreFields = (fields: string[]) =>
    fields.reduce((total, field, index) => {
      const lower = field.toLowerCase();
      if (lower === normalized) return total + 50;
      if (lower.startsWith(normalized)) return total + 24 - index;
      if (lower.includes(normalized)) return total + 12 - Math.min(index, 8);
      return total;
    }, 0);

  const objectResults = getAllObjects().map((object) => {
    const score = scoreFields([
      object.name,
      object.category,
      object.summary,
      object.description,
      ...object.aliases,
      ...object.tags,
    ]);

    return {
      id: `object-${object.id}`,
      title: object.name,
      eyebrow: `Object / ${object.category}`,
      summary: object.summary,
      href: `/objects/${object.id}`,
      score,
    };
  });

  const scaleResults = getCosmicScale().map((node) => {
    const score = scoreFields([node.title, node.subtitle, node.context, node.visualMode]);

    return {
      id: `scale-${node.id}`,
      title: node.title,
      eyebrow: "Cosmic scale",
      summary: node.context,
      href: "/#cosmic-scale",
      score,
    };
  });

  const journeyResults = getJourneys().map((journey) => {
    const score = scoreFields([
      journey.title,
      journey.summary,
      journey.status,
      ...journey.steps.flatMap((step) => [step.title, step.summary]),
    ]);

    return {
      id: `journey-${journey.id}`,
      title: journey.title,
      eyebrow: "Guided journey",
      summary: journey.summary,
      href: `/journeys/${journey.id}`,
      score,
    };
  });

  const productResults = [
    {
      id: "page-lab",
      title: "What If Lab",
      eyebrow: "Interactive lab",
      summary: "Hypothetical astronomy scenarios with visible assumptions and uncertainty boundaries.",
      href: "/lab",
      score: scoreFields(["what if lab", "hypothetical", "simulation", "earth mass", "moon disappeared", "red giant"]),
    },
    {
      id: "page-observe",
      title: "Observation Mode",
      eyebrow: "Observing planner",
      summary: "Privacy-first seasonal observing suggestions with ephemeris boundaries.",
      href: "/observe",
      score: scoreFields(["observation", "observe", "sky", "visible planets", "moon", "telescope", "tonight"]),
    },
    {
      id: "page-discoveries",
      title: "Latest Discoveries",
      eyebrow: "Official feeds",
      summary: "Astronomy and space-science updates from official NASA, JPL, and ESA feeds.",
      href: "/discoveries",
      score: scoreFields(["latest discoveries", "news", "nasa", "jpl", "esa", "feed", "research"]),
    },
    {
      id: "page-my-cosmos",
      title: "My Cosmos",
      eyebrow: "Personal space",
      summary: "Saved objects and local exploration notes.",
      href: "/my-cosmos",
      score: scoreFields(["my cosmos", "saved", "bookmarks", "notes", "journal"]),
    },
  ];

  return [...objectResults, ...scaleResults, ...journeyResults, ...productResults]
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
