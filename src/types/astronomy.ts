export type ObjectCategory =
  | "planet"
  | "moon"
  | "star"
  | "galaxy"
  | "nebula"
  | "black-hole"
  | "cluster"
  | "concept";

export type MeasurementConfidence =
  | "measured"
  | "estimate"
  | "modeled"
  | "theoretical"
  | "contextual";

export type RelationshipKind =
  | "contains"
  | "contained-by"
  | "orbits"
  | "orbited-by"
  | "near"
  | "compares-with"
  | "evidence-for"
  | "associated-with";

export type Measurement = {
  label: string;
  value: string;
  unit?: string;
  confidence: MeasurementConfidence;
  sourceIds: string[];
  note?: string;
};

export type Coordinates = {
  rightAscension?: string;
  declination?: string;
  constellation?: string;
};

export type Relationship = {
  targetId: string;
  kind: RelationshipKind;
  note?: string;
};

export type MediaAsset = {
  type: "image" | "visualization" | "placeholder";
  src?: string;
  alt: string;
  credit?: string;
  dominantColor?: string;
};

export type AstronomicalObject = {
  id: string;
  name: string;
  aliases: string[];
  category: ObjectCategory;
  summary: string;
  description: string;
  scientificSignificance: string;
  coordinates?: Coordinates;
  measurements: Measurement[];
  composition?: string[];
  sourceIds: string[];
  relationships: Relationship[];
  media: MediaAsset;
  tags: string[];
  featured?: boolean;
};

export type CosmicScaleVisualMode =
  | "body"
  | "orbit"
  | "solar-system"
  | "stellar-neighborhood"
  | "galaxy"
  | "galaxy-group"
  | "cluster"
  | "cosmic-web"
  | "observable-universe";

export type CosmicScaleNode = {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  approximateSizeMeters: number;
  visualMode: CosmicScaleVisualMode;
  objectIds: string[];
  context: string;
  measurements: Measurement[];
};

export type GuidedJourneyStep = {
  id: string;
  title: string;
  summary: string;
  objectIds: string[];
  visualization?: "rotation-curve" | "lensing" | "hubble-diagram" | "hr-diagram";
};

export type GuidedJourney = {
  id: string;
  title: string;
  summary: string;
  status: "mvp" | "planned";
  steps: GuidedJourneyStep[];
};
