import { useEffect, useState } from "react";

export type MarineConditions = {
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  swellHeight: number | null;
  swellDirection: number | null;
  windWaveHeight: number | null;
  time: string;
  seaState: DouglasSeaState;
  berthingSafety: "SAFE" | "CAUTION" | "ADVISORY" | "UNAVAILABLE";
};

export type DouglasSeaState =
  | "Calm (Glassy)"
  | "Calm (Rippled)"
  | "Smooth"
  | "Slight"
  | "Moderate"
  | "Rough"
  | "Very Rough"
  | "High"
  | "Phenomenal"
  | "Unavailable";

export type MarineState =
  | { status: "loading" }
  | { status: "ok"; data: MarineConditions }
  | { status: "error"; message: string }
  | { status: "unavailable"; message: string };

const num = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) ? x : null);

/**
 * Calculates Douglas Sea State based on significant wave height in meters
 */
export function getDouglasSeaState(waveHeight: number | null): DouglasSeaState {
  if (waveHeight == null || waveHeight < 0) return "Unavailable";
  if (waveHeight === 0) return "Calm (Glassy)";
  if (waveHeight <= 0.1) return "Calm (Rippled)";
  if (waveHeight <= 0.5) return "Smooth";
  if (waveHeight <= 1.25) return "Slight";
  if (waveHeight <= 2.5) return "Moderate";
  if (waveHeight <= 4.0) return "Rough";
  if (waveHeight <= 6.0) return "Very Rough";
  if (waveHeight <= 9.0) return "High";
  return "Phenomenal";
}

/**
 * Port berthing and lighterage safety guideline based on wave and swell height
 */
export function evaluateBerthingSafety(
  waveHeight: number | null,
  swellHeight: number | null
): "SAFE" | "CAUTION" | "ADVISORY" | "UNAVAILABLE" {
  if (waveHeight == null && swellHeight == null) return "UNAVAILABLE";
  const wave = waveHeight ?? 0;
  const swell = swellHeight ?? 0;

  if (wave >= 2.5 || swell >= 2.0) return "ADVISORY"; // Potential berthing delay/lighterage suspension
  if (wave >= 1.5 || swell >= 1.2) return "CAUTION"; // Tug assistance recommended, monitor surge
  return "SAFE"; // Normal cargo discharge conditions
}

/**
 * Fetches live oceanographic wave and swell conditions from Open-Meteo Marine API.
 * Free, open, no API key required, supports direct browser CORS.
 */
export async function fetchLiveMarine(
  lat: number | null,
  lon: number | null,
  signal?: AbortSignal
): Promise<MarineState> {
  if (lat == null || lon == null) {
    return { status: "unavailable", message: "Port coordinates unavailable" };
  }

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  signal?.addEventListener("abort", () => ctl.abort());

  try {
    const q = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current:
        "wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,swell_wave_direction",
      timezone: "Asia/Kolkata",
    });

    const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${q}`, {
      signal: ctl.signal,
    });

    if (!res.ok) {
      return { status: "error", message: `HTTP ${res.status}` };
    }

    const json = await res.json().catch(() => null);
    const curr = json?.current;

    if (!curr || typeof curr.time !== "string") {
      return { status: "error", message: "Unexpected marine API response" };
    }

    const waveHeight = num(curr.wave_height);
    const swellHeight = num(curr.swell_wave_height);

    return {
      status: "ok",
      data: {
        waveHeight,
        wavePeriod: num(curr.wave_period),
        waveDirection: num(curr.wave_direction),
        swellHeight,
        swellDirection: num(curr.swell_wave_direction),
        windWaveHeight: num(curr.wind_wave_height),
        time: curr.time,
        seaState: getDouglasSeaState(waveHeight),
        berthingSafety: evaluateBerthingSafety(waveHeight, swellHeight),
      },
    };
  } catch (err) {
    return {
      status: "error",
      message: ctl.signal.aborted
        ? "Timed out"
        : err instanceof Error
        ? err.message
        : "Network error",
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * React hook to fetch and subscribe to live marine conditions
 */
export function useLiveMarine(lat: number | null, lon: number | null): MarineState {
  const [state, setState] = useState<MarineState>({ status: "loading" });

  useEffect(() => {
    const ctl = new AbortController();
    fetchLiveMarine(lat, lon, ctl.signal).then((res) => {
      if (!ctl.signal.aborted) setState(res);
    });
    return () => {
      ctl.abort();
      setState({ status: "loading" });
    };
  }, [lat, lon]);

  return state;
}
