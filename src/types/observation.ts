export type LatitudeBand = "north" | "equatorial" | "south";

export type ObservationDifficulty = "easy" | "moderate" | "dark-sky";

export type ObservationTarget = {
  id: string;
  name: string;
  category: "moon" | "planet" | "star" | "galaxy" | "nebula" | "cluster" | "milky-way";
  atlasObjectId?: string;
  latitudeBands: LatitudeBand[];
  bestMonths: number[];
  bestTime: string;
  difficulty: ObservationDifficulty;
  opticalAid: "naked-eye" | "binoculars" | "small-telescope" | "ephemeris-required";
  note: string;
  ephemerisRequired?: boolean;
};
