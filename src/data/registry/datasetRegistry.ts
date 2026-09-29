// Dataset registry: metadata only. Values come from src/data/generated/*.json,
// produced read-only from Stage 1 by scripts/build-stage1.mjs. null → shown as UNKNOWN.
import { Provenance } from "../../types/provenance";
import ds01 from "../generated/ds01.json";
import ds02 from "../generated/ds02.json";
import ds03 from "../generated/ds03.json";
import ds04 from "../generated/ds04.json";
import ds05 from "../generated/ds05.json";
import ds07 from "../generated/ds07.json";

export { ds01, ds02, ds03, ds04, ds05, ds07 };

export type DatasetStatus = "INTEGRATED" | "PARTIAL" | "NOT AVAILABLE";

export interface DatasetEntry {
  id: string;
  name: string;
  status: DatasetStatus;
  provenance: Provenance;
  source: string | null;
  pathRef: string | null; // logical Stage 1 folder id, never a filesystem path
  format: string | null;
  records: number | null;
  valid: number | null;
  missing: number | null;
  dateRange: [string, string] | null;
  geography: string | null;
  quality: string | null;
  limitations: string[];
  usage: string | null;
  stage: string; // STAGES[0] for all Stage 1 datasets
  pages: string[];
}

const STAGE = "Data Ingestion, Quality & Governance";
const na = (id: string, name: string): DatasetEntry => ({
  id, name, status: "NOT AVAILABLE", provenance: Provenance.UNKNOWN, source: null, pathRef: null, format: null,
  records: null, valid: null, missing: null, dateRange: null, geography: null, quality: null,
  limitations: ["Data currently unavailable"], usage: null, stage: STAGE, pages: [],
});

const ds05Berths = ds05.berths.length;
const ds05Sourced = ds05.ports.filter((p) => p.port_status === "SOURCED").length;
const ds03Range: [string, string] = [ds03.regions.map((r) => r.first).sort()[0], ds03.regions.map((r) => r.last).sort().slice(-1)[0]];
const ds07Range: [string, string] = [ds07.rows[0][0] as string, ds07.rows[ds07.rows.length - 1][0] as string];

export const DATASETS: DatasetEntry[] = [
  {
    id: "DS01", name: "Commodity Prices", status: "INTEGRATED", provenance: Provenance.REAL,
    source: "World Bank Commodity Price Data (Pink Sheet)", pathRef: "STAGE1/01_COMMODITY_PRICES", format: "JSON",
    records: ds01.records, valid: ds01.valid, missing: ds01.records - ds01.valid, dateRange: ds01.dateRange as [string, string],
    geography: "Global benchmark prices", quality: "Validated; non-VALID values shown as UNKNOWN",
    limitations: ["Monthly benchmarks, not delivered prices to Indian ports", `${Object.keys(ds01.series).length} commodities`],
    usage: "Risk page: commodity price history", stage: STAGE, pages: ["risk"],
  },
  {
    id: "DS02", name: "Macroeconomic Indicators", status: "INTEGRATED", provenance: Provenance.REAL,
    source: "Public statistical agencies (per-record source in dataset)", pathRef: "STAGE1/02_MACROECONOMIC_INDICATORS", format: "JSON",
    records: ds02.records, valid: ds02.valid, missing: ds02.records - ds02.valid, dateRange: ds02.dateRange as [string, string],
    geography: [...new Set(ds02.rows.map((r) => r.country))].join(", "), quality: "Validated; summarised per country × indicator",
    limitations: ["Mixed frequencies", "UI shows latest valid value only"],
    usage: "Risk page: macro context table", stage: STAGE, pages: ["risk"],
  },
  {
    id: "DS03", name: "AIS Vessel Traffic", status: "PARTIAL", provenance: Provenance.REAL,
    source: "NOAA / MarineCadastre AIS", pathRef: "STAGE1/03_AIS_VESSEL_TRAFFIC", format: "JSON",
    records: ds03.records, valid: ds03.valid, missing: ds03.records - ds03.valid, dateRange: ds03Range,
    geography: ds03.regions.map((r) => r.region).join(", "), quality: "Validated; aggregated per region",
    limitations: ["US ports only (Norfolk, Baltimore, Longview)", "Single day of positions", "India AIS: UNAVAILABLE (not zero)"],
    usage: "Vessel page: regional traffic aggregates", stage: STAGE, pages: ["vessel"],
  },
  {
    id: "DS04", name: "Port Statistics", status: "PARTIAL", provenance: Provenance.REAL,
    source: `${ds04.sourcesUsed} public port / ministry sources`, pathRef: "STAGE1/04_PORT_STATISTICS", format: "JSON",
    records: ds04.records, valid: null, missing: null, dateRange: null,
    geography: "Mixed: country, port and port-authority level", quality: `${ds04.failed.length} sources failed`,
    limitations: ["Country aggregates are NOT port-level data", "Year coverage varies per row"],
    usage: "Ports page: throughput table by geographic level", stage: STAGE, pages: ["ports"],
  },
  {
    id: "DS05", name: "India East Coast Port Infrastructure", status: "PARTIAL", provenance: Provenance.REAL,
    source: "Port authority publications", pathRef: "STAGE1/05_INDIA_EAST_COAST_PORT_INFRASTRUCTURE", format: "JSON",
    records: ds05.records, valid: null, missing: null, dateRange: null,
    geography: "India east coast", quality: `${ds05Sourced}/${ds05.ports.length} ports sourced; ${ds05Berths} berths`,
    limitations: ["Kolkata/Haldia: SOURCE FAILED", "Missing fields shown as UNKNOWN, never 0/false"],
    usage: "Ports page: port and berth infrastructure", stage: STAGE, pages: ["ports"],
  },
  na("DS06", "Dataset 06"),
  {
    id: "DS07", name: "Baltic Sub-indices (history)", status: "PARTIAL", provenance: Provenance.REAL,
    source: "Mendeley Data mirror, DOI 10.17632/t76ckh2ygg.1 (original source NOT verified)", pathRef: "STAGE1/07_FREIGHT_RATES", format: "CSV",
    records: ds07.records, valid: null, missing: null, dateRange: ds07Range,
    geography: "Global index (no route detail)", quality: "EXPERIMENTAL / MODEL-DEVELOPMENT",
    limitations: ["INDIA ROUTE DATA: NOT AVAILABLE", "No BDI, no $/day or $/tonne", "History only; no forecasts", "No chartering-suitability or financial-savings claim is supported by DS07."],
    usage: "Forecast page: index history viewer", stage: STAGE, pages: ["forecast"],
  },
  na("DS08", "Dataset 08"),
  na("DS09", "Dataset 09"),
  na("DS10", "Dataset 10"),
];

export const dataset = (id: string) => DATASETS.find((d) => d.id === id)!;
export const show = (v: unknown) => (v === null || v === undefined || v === "" ? "UNKNOWN" : String(v));
