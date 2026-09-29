import { useEffect, useState } from "react";

export type FxRates = {
  USD: number;
  INR: number;
  SGD: number | null; // Singapore bunker hub currency
  AUD: number | null; // Australian coal export origin
  EUR: number | null; // European ETS / trading
  CNY: number | null; // China steel / bulk dry demand
  ZAR: number | null; // South African thermal coal
  IDR: number | null; // Indonesian coal
  BRL: number | null; // Brazilian iron ore (Vale)
  lastUpdated: string;
  source: string;
};

export type FxState =
  | { status: "loading" }
  | { status: "ok"; data: FxRates }
  | { status: "error"; message: string };

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache
let cachedFx: { timestamp: number; data: FxRates } | null = null;

const numOrNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

export async function fetchLiveFx(signal?: AbortSignal): Promise<FxState> {
  const now = Date.now();
  if (cachedFx && now - cachedFx.timestamp < CACHE_DURATION_MS) {
    return { status: "ok", data: cachedFx.data };
  }

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  signal?.addEventListener("abort", () => ctl.abort());

  // Primary: open.er-api.com (free, open, no API key, CORS enabled)
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: ctl.signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates.INR === "number") {
        const rates: FxRates = {
          USD: 1.0,
          INR: data.rates.INR,
          SGD: numOrNull(data.rates.SGD),
          AUD: numOrNull(data.rates.AUD),
          EUR: numOrNull(data.rates.EUR),
          CNY: numOrNull(data.rates.CNY),
          ZAR: numOrNull(data.rates.ZAR),
          IDR: numOrNull(data.rates.IDR),
          BRL: numOrNull(data.rates.BRL),
          lastUpdated: data.time_last_update_utc || new Date().toISOString(),
          source: "ExchangeRate-API (Free Open Feed)",
        };
        cachedFx = { timestamp: now, data: rates };
        clearTimeout(timer);
        return { status: "ok", data: rates };
      }
    }
  } catch {
    // Attempt fallback
  }

  // Fallback: Frankfurter ECB Open API (free, open, CORS enabled)
  try {
    const res = await fetch(
      "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR,SGD,AUD,EUR,CNY,ZAR,BRL",
      { signal: ctl.signal }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates.INR === "number") {
        const rates: FxRates = {
          USD: 1.0,
          INR: data.rates.INR,
          SGD: numOrNull(data.rates.SGD),
          AUD: numOrNull(data.rates.AUD),
          EUR: numOrNull(data.rates.EUR),
          CNY: numOrNull(data.rates.CNY),
          ZAR: numOrNull(data.rates.ZAR),
          IDR: numOrNull(data.rates.IDR),
          BRL: numOrNull(data.rates.BRL),
          lastUpdated: data.date ? `${data.date} (ECB Close)` : new Date().toISOString(),
          source: "European Central Bank via Frankfurter",
        };
        cachedFx = { timestamp: now, data: rates };
        clearTimeout(timer);
        return { status: "ok", data: rates };
      }
    }
  } catch {
    // Handled in catch block below
  } finally {
    clearTimeout(timer);
  }

  return {
    status: "error",
    message: "Unable to retrieve live exchange rates from public feeds",
  };
}

/**
 * Hook to access live FX rates
 */
export function useLiveFx(): FxState & { retry: () => void } {
  const [state, setState] = useState<FxState>({ status: "loading" });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const ctl = new AbortController();
    fetchLiveFx(ctl.signal).then((res) => {
      if (!ctl.signal.aborted) setState(res);
    });
    return () => ctl.abort();
  }, [nonce]);

  return {
    ...state,
    retry: () => {
      cachedFx = null;
      setState({ status: "loading" });
      setNonce((n) => n + 1);
    },
  };
}

/**
 * Format currency in Indian format (Lakhs and Crores)
 */
export function formatInrCrores(inr: number): string {
  if (inr >= 10000000) {
    return `₹${(inr / 10000000).toFixed(2)} Cr`;
  }
  if (inr >= 100000) {
    return `₹${(inr / 100000).toFixed(2)} Lakh`;
  }
  return `₹${Math.round(inr).toLocaleString("en-IN")}`;
}
