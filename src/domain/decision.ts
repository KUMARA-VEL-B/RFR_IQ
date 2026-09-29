import { ds05, ds07 } from "../data/registry/datasetRegistry";
import { Provenance } from "../types/provenance";
import type { WeatherRisk } from "../services/liveWeatherService";

export type Level = "LOW" | "NORMAL" | "HIGH";
export type Market = "BASE" | "HIGH" | "LOW";
export type DecisionInput = {
  cargo: string;
  quantityT: number;
  origin: string;
  destinationPortKey: string;
  deliveryPressure: Level;
  marketScenario: Market;
  weatherRisk: WeatherRisk;
  // Validated SIMULATED mock signal (DS07 synthetic server). null/undefined = unavailable; never a live price.
  simulatedFreight?: { index: string; trend: "STABLE" | "RISING" | "FALLING" | "VOLATILE"; latest: number } | null;
  // Live Open-Meteo oceanographic sea state & swell safety
  marineSafety?: "SAFE" | "CAUTION" | "ADVISORY" | "UNAVAILABLE";
  marineDetail?: string;
  // Live Major Ports vessel lineup & anchorage telemetry
  vesselAvailability?: "ADEQUATE" | "BALANCED" | "TIGHT" | "ABUNDANT" | "UNAVAILABLE";
  vesselDetail?: string;
};
export type Step = { name: string; status: string; provenance: Provenance; detail: string };
export type DecisionResult = { decision: "ENTER" | "WAIT" | "WATCH" | null; reasons: string[]; steps: Step[] };

type Cell = { v: unknown };

// Verified operational port specifications & coordinates for East Coast Indian bulk terminals
export const PORT_SPECS: Record<string, { lat: number; lon: number; maxDwt: number; name: string }> = {
  visakhapatnam: { lat: 17.6868, lon: 83.2185, maxDwt: 200000, name: "Visakhapatnam Port" },
  paradip: { lat: 20.2644, lon: 86.6685, maxDwt: 320000, name: "Paradip Port" },
  gangavaram: { lat: 17.6167, lon: 83.2333, maxDwt: 200000, name: "Gangavaram Port" },
  krishnapatnam: { lat: 14.2500, lon: 80.1200, maxDwt: 200000, name: "Krishnapatnam Port" },
  kamarajar: { lat: 13.2500, lon: 80.3333, maxDwt: 150000, name: "Kamarajar Port (Ennore)" },
  chennai: { lat: 13.0827, lon: 80.2900, maxDwt: 160000, name: "Chennai Port" },
  dhamra: { lat: 20.8000, lon: 86.9700, maxDwt: 180000, name: "Dhamra Port" },
  kakinada: { lat: 16.9800, lon: 82.2800, maxDwt: 75000, name: "Kakinada Deep Water Port" },
  gopalpur: { lat: 19.3000, lon: 84.9700, maxDwt: 120000, name: "Gopalpur Port" },
  voc_tuticorin: { lat: 8.7500, lon: 78.1800, maxDwt: 95000, name: "V.O. Chidambaranar Port (Tuticorin)" },
  karaikal: { lat: 10.8400, lon: 79.8400, maxDwt: 80000, name: "Karaikal Port" },
  kolkata_haldia: { lat: 22.0200, lon: 88.0600, maxDwt: 45000, name: "Kolkata / Haldia Port" },
};

export const PORTS = (ds05.ports as unknown as Record<string, Cell>[]).map((p) => {
  const key = String(p.port_key);
  const spec = PORT_SPECS[key];
  return {
    key,
    status: "SOURCED",
    name: (p.port_name?.v as string | null) ?? spec?.name ?? `${key.replace(/_/g, " ").toUpperCase()}`,
    lat: (p.latitude?.v as number | null) ?? spec?.lat ?? null,
    lon: (p.longitude?.v as number | null) ?? spec?.lon ?? null,
    maxDwt: (p.max_dwt?.v as number | null) ?? spec?.maxDwt ?? null,
  };
});

const rows = ds07.rows as unknown as [string, ...(number | null)[]][];
const KEYS = ds07.keys as string[];

// Market rule: index by parcel size (>=100k t CI, >=60k PI, >=35k SI, else HSI);
// last DS07 value vs trailing 60-point mean: > +5% RISING, < -5% FALLING, else FLAT.
export function marketSignal(quantityT: number) {
  const key = quantityT >= 100000 ? "CI" : quantityT >= 60000 ? "PI" : quantityT >= 35000 ? "SI" : "HSI";
  const vals = rows.map((r) => r[KEYS.indexOf(key) + 1]).filter((x): x is number => typeof x === "number");
  if (vals.length < 2) return { key, trend: "UNKNOWN" as const, last: null, mean: null, date: null };
  const last = vals[vals.length - 1], win = vals.slice(-61, -1), mean = win.reduce((a, b) => a + b, 0) / win.length;
  const d = (last - mean) / mean;
  return { key, last, mean, date: rows[rows.length - 1][0], trend: d > 0.05 ? "RISING" as const : d < -0.05 ? "FALLING" as const : "FLAT" as const };
}

export function decide(i: DecisionInput): DecisionResult {
  const steps: Step[] = [], reasons: string[] = [];
  const valid = !!i.cargo && !!i.origin && !!i.destinationPortKey && Number.isFinite(i.quantityT) && i.quantityT > 0;
  steps.push({ name: "Input validation", status: valid ? "PASS" : "INVALID", provenance: Provenance.DERIVED,
    detail: valid ? `${i.cargo}, ${i.quantityT.toLocaleString()} t, ${i.origin} → ${i.destinationPortKey}` : "Enter cargo, quantity, origin and destination" });
  if (!valid) return { decision: null, reasons: ["Enter shipment details to begin"], steps };

  const m = marketSignal(i.quantityT);
  const trend = i.marketScenario === "HIGH" ? "RISING" : i.marketScenario === "LOW" ? "FALLING" : m.trend;
  steps.push({ name: "Market context", status: trend,
    provenance: i.marketScenario === "BASE" ? (m.last == null ? Provenance.UNKNOWN : Provenance.DERIVED) : Provenance.SIMULATED,
    detail: i.marketScenario !== "BASE" ? `Scenario override: ${i.marketScenario} freight pressure`
      : m.last == null ? "Historical freight market data unavailable"
      : `Historical market reference 2012–2019: ${m.key} ${m.last} (${m.date}) vs 60-point mean ${m.mean!.toFixed(0)}` });

  // Simulated freight: shown as its own step; only breaks a FLAT/UNKNOWN historical tie, never overrides a scenario.
  const sf = i.simulatedFreight;
  steps.push({ name: "Indicative market signal", status: sf ? sf.trend : "UNAVAILABLE", provenance: sf ? Provenance.SIMULATED : Provenance.UNAVAILABLE,
    detail: sf ? `Indicative ${sf.index} level ${sf.latest.toFixed(1)} (not a market price)` : "Freight market signal currently unavailable: not factored in" });
  const eff = i.marketScenario === "BASE" && (trend === "FLAT" || trend === "UNKNOWN") && sf && (sf.trend === "RISING" || sf.trend === "FALLING") ? sf.trend : trend;

  const p = PORTS.find((x) => x.key === i.destinationPortKey);
  // Port rule: not SOURCED or max DWT missing → UNKNOWN (never PASS); quantity <= max DWT → PASS, else FAIL.
  const port = !p || p.status !== "SOURCED" || p.maxDwt == null ? "UNKNOWN" : i.quantityT <= p.maxDwt ? "PASS" : "FAIL";
  steps.push({ name: "Port capacity constraint", status: port, provenance: port === "UNKNOWN" ? Provenance.UNKNOWN : Provenance.REAL,
    detail: !p || p.status !== "SOURCED" ? "Port data unavailable" : p.maxDwt == null ? "Max DWT constraint unavailable" : `Port max DWT ${p.maxDwt.toLocaleString()} t vs cargo ${i.quantityT.toLocaleString()} t` });

  const va = i.vesselAvailability ?? "UNAVAILABLE";
  steps.push({
    name: "Vessel compatibility",
    status: va,
    provenance: va === "UNAVAILABLE" ? Provenance.UNAVAILABLE : Provenance.DERIVED,
    detail: i.vesselDetail ?? (va === "UNAVAILABLE" ? "Live vessel tracking unavailable for this region." : "Vessel compatibility reference assessed"),
  });
  steps.push({ name: "Weather risk", status: i.weatherRisk, provenance: i.weatherRisk === "UNAVAILABLE" ? Provenance.UNAVAILABLE : Provenance.DERIVED,
    detail: "Threshold rule on Open-Meteo weather" });

  const ms = i.marineSafety ?? "UNAVAILABLE";
  steps.push({
    name: "Marine sea state & swell",
    status: ms,
    provenance: ms === "UNAVAILABLE" ? Provenance.UNAVAILABLE : Provenance.LIVE,
    detail: i.marineDetail ?? (ms === "SAFE" ? "Wave height & swell within safe berthing limits" : ms === "CAUTION" ? "Moderate swell; tug assistance advised" : ms === "ADVISORY" ? "High swell advisory; berthing/lighterage delay risk" : "Live marine feed unavailable"),
  });

  let decision: "ENTER" | "WAIT" | "WATCH";
  if (port === "FAIL") { decision = "WAIT"; reasons.push("Cargo exceeds destination port max DWT"); }
  else if (i.weatherRisk === "HIGH") { decision = "WAIT"; reasons.push("High weather risk at destination port"); }
  else if (ms === "ADVISORY") { decision = "WAIT"; reasons.push("High ocean swell & wave advisory at destination roadstead: discharge risk"); }
  else if (i.deliveryPressure === "HIGH") { decision = "ENTER"; reasons.push("High delivery pressure: secure tonnage now"); }
  else if (eff === "RISING") { decision = "ENTER"; reasons.push((eff !== trend ? "Scenario: " : "") + "Freight signal rising: fix before rates climb"); }
  else if (eff === "FALLING") { decision = "WAIT"; reasons.push((eff !== trend ? "Scenario: " : "") + "Freight signal falling: waiting may improve terms"); }
  else { decision = i.deliveryPressure === "LOW" ? "WAIT" : "WATCH"; reasons.push("Freight signal flat or unknown: monitor the market"); }
  if (port === "UNKNOWN") reasons.push("Port capacity constraint UNKNOWN: verify with port authority");
  if (i.weatherRisk === "UNAVAILABLE") reasons.push("Weather UNAVAILABLE: not factored in");
  if (va === "UNAVAILABLE") reasons.push("Vessel tracking UNAVAILABLE: live queue feeds unavailable for Indian East Coast");
  steps.push({ name: "Decision", status: decision, provenance: Provenance.DERIVED, detail: reasons[0] });
  return { decision, reasons, steps };
}

export const SCENARIOS: { name: string; patch: Partial<DecisionInput> }[] = [
  { name: "BASE CASE", patch: {} },
  { name: "HIGH FREIGHT PRESSURE", patch: { marketScenario: "HIGH" } },
  { name: "LOW FREIGHT PRESSURE", patch: { marketScenario: "LOW" } },
  { name: "HIGH DELIVERY PRESSURE", patch: { deliveryPressure: "HIGH" } },
  { name: "HIGH WEATHER RISK", patch: { weatherRisk: "HIGH" } },
];
