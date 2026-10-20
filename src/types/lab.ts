export type LabIntegrity = "established-physics" | "modeled-consequence" | "speculative";

export type LabParameter = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit: string;
  assumption: string;
};

export type WhatIfScenario = {
  id: string;
  title: string;
  summary: string;
  parameter?: LabParameter;
  boundary: string;
  outcomes: Array<{
    label: string;
    body: string;
    integrity: LabIntegrity;
  }>;
  aiQuestion: string;
};
