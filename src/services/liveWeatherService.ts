import { useEffect, useState } from "react";

export type Weather = { temp: number | null; wind: number | null; gusts: number | null; precip: number | null; rainProb: number | null; code: number | null; time: string };
export type WeatherState =
  | { status: "loading" }
  | { status: "ok"; data: Weather }
  | { status: "error"; message: string }
  | { status: "unavailable"; message: string };
export type WeatherRisk = "LOW" | "MODERATE" | "HIGH" | "UNAVAILABLE";

const num = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? x : null);

export async function fetchWeather(lat: number | null, lon: number | null, signal?: AbortSignal): Promise<WeatherState> {
  if (lat == null || lon == null) return { status: "unavailable", message: "Port coordinates unavailable" };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 8000);
  signal?.addEventListener("abort", () => ctl.abort());
  try {
    const q = new URLSearchParams({
      latitude: String(lat), longitude: String(lon), timezone: "Asia/Kolkata",
      current: "temperature_2m,wind_speed_10m,wind_gusts_10m,precipitation,weather_code",
      hourly: "precipitation_probability",
    });
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { signal: ctl.signal });
    if (!r.ok) return { status: "error", message: `HTTP ${r.status}` };
    const j = await r.json().catch(() => null);
    const c = j?.current;
    if (!c || typeof c.time !== "string") return { status: "error", message: "Unexpected response" };
    const hour = c.time.slice(0, 13); // current hour (IST)
    const i = (j.hourly?.time ?? []).findIndex((h: string) => h.startsWith(hour));
    return { status: "ok", data: {
      temp: num(c.temperature_2m), wind: num(c.wind_speed_10m), gusts: num(c.wind_gusts_10m),
      precip: num(c.precipitation), code: num(c.weather_code), time: c.time,
      rainProb: i >= 0 ? num(j.hourly.precipitation_probability?.[i]) : null,
    } };
  } catch (e) {
    return { status: "error", message: ctl.signal.aborted ? "Timed out" : e instanceof Error ? e.message : "Network error" };
  } finally { clearTimeout(t); }
}

// Prototype threshold rule (not a validated marine-ops standard):
// HIGH: gusts >= 50 km/h OR wind >= 38 km/h OR rain probability >= 70%
// MODERATE: gusts >= 30 OR wind >= 20 OR rain probability >= 40%
// LOW otherwise; UNAVAILABLE when no data or all three inputs missing.
export function weatherRisk(w: Weather | null | undefined): WeatherRisk {
  if (!w || (w.gusts == null && w.wind == null && w.rainProb == null)) return "UNAVAILABLE";
  const g = w.gusts ?? -1, s = w.wind ?? -1, p = w.rainProb ?? -1;
  if (g >= 50 || s >= 38 || p >= 70) return "HIGH";
  if (g >= 30 || s >= 20 || p >= 40) return "MODERATE";
  return "LOW";
}

export function useLiveWeather(lat: number | null, lon: number | null): WeatherState {
  const [s, set] = useState<WeatherState>({ status: "loading" });
  useEffect(() => {
    const ctl = new AbortController();
    fetchWeather(lat, lon, ctl.signal).then((r) => { if (!ctl.signal.aborted) set(r); });
    return () => { ctl.abort(); set({ status: "loading" }); };
  }, [lat, lon]);
  return s;
}
