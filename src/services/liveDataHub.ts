import { useEffect, useState } from "react";

export type ApiEndpointStatus = {
  id: string;
  name: string;
  category: "Weather" | "Marine" | "Foreign Exchange" | "Macroeconomics";
  provider: string;
  status: "ONLINE" | "CHECKING" | "OFFLINE";
  latencyMs: number | null;
  lastChecked: string;
};

export function useLiveApiStatus() {
  const [endpoints, setEndpoints] = useState<ApiEndpointStatus[]>([
    {
      id: "open-meteo-weather",
      name: "Open-Meteo Weather API",
      category: "Weather",
      provider: "Open-Meteo",
      status: "CHECKING",
      latencyMs: null,
      lastChecked: "Just now",
    },
    {
      id: "open-meteo-marine",
      name: "Open-Meteo Marine API",
      category: "Marine",
      provider: "Open-Meteo Marine",
      status: "CHECKING",
      latencyMs: null,
      lastChecked: "Just now",
    },
    {
      id: "open-exchange-rates",
      name: "Foreign Exchange Rates",
      category: "Foreign Exchange",
      provider: "ExchangeRate-API / Frankfurter",
      status: "CHECKING",
      latencyMs: null,
      lastChecked: "Just now",
    },
    {
      id: "world-bank-open-data",
      name: "World Bank Indicators API v2",
      category: "Macroeconomics",
      provider: "The World Bank Group",
      status: "CHECKING",
      latencyMs: null,
      lastChecked: "Just now",
    },
  ]);

  const checkAll = async () => {
    // 1. Weather
    const t0 = performance.now();
    let weatherOk = false;
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=17.70&longitude=83.30&current=temperature_2m,wind_speed_10m"
      );
      if (res.ok) weatherOk = true;
    } catch {
      weatherOk = false;
    }
    const tWeather = Math.round(performance.now() - t0);

    // 2. Marine
    const t1 = performance.now();
    let marineOk = false;
    try {
      const res = await fetch(
        "https://marine-api.open-meteo.com/v1/marine?latitude=17.70&longitude=83.30&current=wave_height,wave_period"
      );
      if (res.ok) marineOk = true;
    } catch {
      marineOk = false;
    }
    const tMarine = Math.round(performance.now() - t1);

    // 3. FX
    const t2 = performance.now();
    let fxOk = false;
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (res.ok) fxOk = true;
    } catch {
      fxOk = false;
    }
    const tFx = Math.round(performance.now() - t2);

    // 4. World Bank real check
    const t3 = performance.now();
    let wbOk = false;
    try {
      const res = await fetch(
        "https://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=1"
      );
      if (res.ok) {
        const j = await res.json();
        if (Array.isArray(j) && j[1]) wbOk = true;
      }
    } catch {
      wbOk = false;
    }
    const tWb = Math.round(performance.now() - t3);

    const nowStr = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });

    setEndpoints([
      {
        id: "open-meteo-weather",
        name: "Open-Meteo Weather API",
        category: "Weather",
        provider: "Open-Meteo",
        status: weatherOk ? "ONLINE" : "OFFLINE",
        latencyMs: tWeather,
        lastChecked: nowStr,
      },
      {
        id: "open-meteo-marine",
        name: "Open-Meteo Marine API",
        category: "Marine",
        provider: "Open-Meteo Marine",
        status: marineOk ? "ONLINE" : "OFFLINE",
        latencyMs: tMarine,
        lastChecked: nowStr,
      },
      {
        id: "open-exchange-rates",
        name: "Foreign Exchange Rates",
        category: "Foreign Exchange",
        provider: "ExchangeRate-API / Frankfurter",
        status: fxOk ? "ONLINE" : "OFFLINE",
        latencyMs: tFx,
        lastChecked: nowStr,
      },
      {
        id: "world-bank-open-data",
        name: "World Bank Indicators API v2",
        category: "Macroeconomics",
        provider: "The World Bank Group",
        status: wbOk ? "ONLINE" : "OFFLINE",
        latencyMs: tWb,
        lastChecked: nowStr,
      },
    ]);
  };

  useEffect(() => {
    checkAll();
  }, []);

  return { endpoints, checkAll };
}
