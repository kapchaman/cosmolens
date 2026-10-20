export type SourceType =
  | "nasa"
  | "esa"
  | "jpl"
  | "simbad"
  | "ned"
  | "paper"
  | "mission"
  | "api-docs";

export type ScientificSource = {
  id: string;
  title: string;
  organization: string;
  year?: number;
  type: SourceType;
  url: string;
  notes?: string;
};
