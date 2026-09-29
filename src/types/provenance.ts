// Every value shown in the UI must eventually carry provenance metadata.
export enum Provenance {
  REAL = "REAL",
  SYNTHETIC = "SYNTHETIC",
  DERIVED = "DERIVED",
  SIMULATED = "SIMULATED",
  ESTIMATED = "ESTIMATED",
  UNKNOWN = "UNKNOWN",
  LIVE = "LIVE",
  UNAVAILABLE = "UNAVAILABLE",
}

// Intentionally unfilled until Stage 1 registers datasets.
export interface DatasetMetadata {
  source: string | null;
  datasetId: string | null;
  provenance: Provenance;
  coverage: string | null;
  dateRange: { start: string; end: string } | null;
  qualityStatus: string | null;
  limitations: string[];
}

export const STAGES = [
  "Data Ingestion, Quality & Governance",
  "Feature Engineering, Baseline Modeling & Forecasting Core",
  "Model Calibration, Uncertainty Quantification & Decision Engine",
  "Scenario Simulation, Stress Testing & Planning/Execution",
  "Operational Monitoring, Control & Performance Attribution",
  "Monitoring, Learning & Feedback",
] as const;
