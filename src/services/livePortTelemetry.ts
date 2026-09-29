import { useEffect, useState } from "react";
import { fetchWeather, type Weather } from "./liveWeatherService";
import { fetchLiveMarine, type MarineConditions } from "./liveMarineService";
import { PORTS } from "../domain/decision";

export type PortLiveTelemetry = {
  portKey: string;
  name: string;
  lat: number | null;
  lon: number | null;
  weather: Weather | null;
  weatherStatus: "ok" | "loading" | "unavailable" | "error";
  marine: MarineConditions | null;
  marineStatus: "ok" | "loading" | "unavailable" | "error";
  lastUpdated: string;
};

export function useAllPortsTelemetry() {
  const [telemetry, setTelemetry] = useState<Record<string, PortLiveTelemetry>>({});
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const refresh = async () => {
    setLoading(true);
    const validPorts = PORTS.filter((p) => p.lat != null && p.lon != null);

    const promises = validPorts.map(async (port) => {
      const [wRes, mRes] = await Promise.all([
        fetchWeather(port.lat, port.lon),
        fetchLiveMarine(port.lat, port.lon),
      ]);

      const item: PortLiveTelemetry = {
        portKey: port.key,
        name: port.name,
        lat: port.lat,
        lon: port.lon,
        weather: wRes.status === "ok" ? wRes.data : null,
        weatherStatus: wRes.status,
        marine: mRes.status === "ok" ? mRes.data : null,
        marineStatus: mRes.status,
        lastUpdated: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
      };

      return [port.key, item] as const;
    });

    const results = await Promise.all(promises);
    const record: Record<string, PortLiveTelemetry> = {};
    for (const [k, v] of results) {
      record[k] = v;
    }

    setTelemetry(record);
    setLoading(false);
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000); // 5 minute refresh
    return () => clearInterval(interval);
  }, []);

  return { telemetry, loading, lastRefreshed, refresh };
}
