import { useEffect, useState } from "react";

// DS07 synthetic mock server adapter. HTTP only; every value is SIMULATED, never live market data.
export type FreightIndex = "HSI" | "SI" | "PI" | "CI";
export type FreightScenario = "NORMAL" | "RISING" | "FALLING" | "VOLATILE" | "SHOCK";
export type FreightObs = { date: string; index: FreightIndex; level: number; log_return: number };
export type MarketState = { index: FreightIndex; latest_value: number; change_1d: number; change_7d: number; trend: "STABLE" | "RISING" | "FALLING" | "VOLATILE"; volatility: number; observation_count: number };
export type FreightState<T> =
  | { status: "loading" }
  | { status: "ok"; data: T }
  | { status: "invalid"; reason: string }
  | { status: "unavailable"; reason: string };

const BASE = (import.meta.env.VITE_MOCK_FREIGHT_BASE_URL as string | undefined)?.trim().replace(/\/+$/, "") || null;
export const freightConfigured = !!BASE;
const TIMEOUT_MS = 8000;
const TRENDS = ["STABLE", "RISING", "FALLING", "VOLATILE"];

const fin = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const isDate = (x: unknown): x is string => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x));

// Provenance gate shared by every payload.
function provenanceError(o: Record<string, unknown>): string | null {
  if (o.provenance !== "SIMULATED") return `provenance is ${JSON.stringify(o.provenance)}, expected "SIMULATED"`;
  if (o.is_simulated !== true) return "is_simulated is not true";
  if (o.reference_dataset !== "DS07") return `reference_dataset is ${JSON.stringify(o.reference_dataset)}, expected "DS07"`;
  return null;
}

export function validateObs(x: unknown, index: FreightIndex): FreightObs | string {
  if (!x || typeof x !== "object") return "observation is not an object";
  const o = x as Record<string, unknown>;
  if (o.index !== index) return `index mismatch: got ${JSON.stringify(o.index)}, expected ${index}`;
  if (!isDate(o.date)) return "missing or invalid date";
  if (!fin(o.level) || o.level <= 0) return "missing or non-finite level";
  if (!fin(o.log_return)) return "missing or non-finite log_return";
  return provenanceError(o) ?? { date: o.date, index, level: o.level, log_return: o.log_return };
}

export function validateMarketState(x: unknown, index: FreightIndex): MarketState | string {
  if (!x || typeof x !== "object") return "response is not an object";
  const o = x as Record<string, unknown>;
  if (o.index !== index) return `index mismatch: got ${JSON.stringify(o.index)}, expected ${index}`;
  for (const k of ["latest_value", "change_1d", "change_7d", "volatility", "observation_count"]) if (!fin(o[k])) return `missing or non-finite ${k}`;
  if (!TRENDS.includes(o.trend as string)) return `unknown trend ${JSON.stringify(o.trend)}`;
  const p = provenanceError(o);
  if (p) return p;
  return {
    index,
    latest_value: o.latest_value as number,
    change_1d: o.change_1d as number,
    change_7d: o.change_7d as number,
    trend: o.trend as MarketState["trend"],
    volatility: o.volatility as number,
    observation_count: o.observation_count as number,
  };
}

function validateSeries(x: unknown, index: FreightIndex): FreightObs[] | string {
  if (!Array.isArray(x) || !x.length) return "expected a non-empty array of observations";
  const out: FreightObs[] = [];
  for (const [i, r] of x.entries()) {
    const v = validateObs(r, index);
    if (typeof v === "string") return `row ${i}: ${v}`;
    out.push(v);
  }
  return out;
}

async function get<T>(path: string, q: Record<string, string>, check: (j: unknown) => T | string, signal?: AbortSignal): Promise<FreightState<T>> {
  if (!BASE) {
    return {
      status: "unavailable",
      reason: "Indicative freight service unconfigured (VITE_MOCK_FREIGHT_BASE_URL missing)",
    };
  }
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => ctl.abort());
  try {
    const r = await fetch(`${BASE}/api/freight/${path}?${new URLSearchParams(q)}`, { signal: ctl.signal });
    if (!r.ok) return { status: "unavailable", reason: `HTTP ${r.status}` };
    let j: unknown;
    try {
      j = await r.json();
    } catch {
      return { status: "invalid", reason: "malformed JSON" };
    }
    const v = check(j);
    return typeof v === "string" ? { status: "invalid", reason: v } : { status: "ok", data: v };
  } catch {
    return {
      status: "unavailable",
      reason: ctl.signal.aborted && !signal?.aborted ? `timeout after ${TIMEOUT_MS / 1000}s` : "server unreachable",
    };
  } finally {
    clearTimeout(t);
  }
}

export const getLatestFreight = (index: FreightIndex, signal?: AbortSignal) =>
  get("latest", { index }, (j) => validateObs((j as { observation?: unknown } | null)?.observation, index), signal);
export const getFreightHistory = (index: FreightIndex, days: number, signal?: AbortSignal) =>
  get("history", { index, days: String(days) }, (j) => validateSeries(j, index), signal);
export const getMarketState = (index: FreightIndex, signal?: AbortSignal) =>
  get("market-state", { index }, (j) => validateMarketState(j, index), signal);
export const getFreightScenario = (index: FreightIndex, scenario: FreightScenario, signal?: AbortSignal) =>
  get("scenario", { index, scenario }, (j) => validateSeries(j, index), signal);

// Generic hook: re-fetches when key changes, drops stale data immediately.
function useFreight<T>(key: string, run: (s: AbortSignal) => Promise<FreightState<T>>): FreightState<T> & { retry: () => void } {
  const [st, setSt] = useState<{ key: string; v: FreightState<T> }>({ key: "", v: { status: "loading" } });
  const [n, setN] = useState(0);
  const k = `${key}#${n}`;
  useEffect(() => {
    const ctl = new AbortController();
    run(ctl.signal).then((v) => {
      if (!ctl.signal.aborted) setSt({ key: k, v });
    });
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);
  const v: FreightState<T> = st.key === k ? st.v : { status: "loading" };
  return { ...v, retry: () => setN((x) => x + 1) };
}

export const useMarketState = (index: FreightIndex | null) =>
  useFreight(`ms:${index}`, (s) => (index ? getMarketState(index, s) : Promise.resolve({ status: "unavailable", reason: "No index selected" })));
export const useFreightHistory = (index: FreightIndex, days: number) =>
  useFreight(`h:${index}:${days}`, (s) => getFreightHistory(index, days, s));
export const useFreightScenario = (index: FreightIndex, sc: FreightScenario) =>
  useFreight(`sc:${index}:${sc}`, (s) => getFreightScenario(index, sc, s));

// Index chosen by shipment size; same bands as DS07 marketSignal in decision.ts.
export const indexForQuantity = (q: number): FreightIndex | null =>
  !Number.isFinite(q) || q <= 0 ? null : q >= 100000 ? "CI" : q >= 60000 ? "PI" : q >= 35000 ? "SI" : "HSI";
