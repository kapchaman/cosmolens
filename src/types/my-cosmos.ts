import type { ObjectCategory } from "@/types/astronomy";

export type SavedCosmosObject = {
  id: string;
  name: string;
  category: ObjectCategory;
  summary: string;
  savedAt: string;
};

export type CosmosNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};
