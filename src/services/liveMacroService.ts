import { useEffect, useState } from "react";

export type CountryMacro = {
  countryCode: string;
  countryName: string;
  year: string;
  gdpGrowthPct: number | null;
  tradePartnerRole: string;
  source: string;
};

export type MacroState =
  | { status: "loading" }
  | { status: "ok"; data: CountryMacro[] }
  | { status: "unavailable"; message: string };

const PARTNER_META: Record<string, { name: string; role: string }> = {
  IND: { name: "India", role: "East Coast Bulk Import Destination (Coal/Ore)" },
  AUS: { name: "Australia", role: "Key Coking & Thermal Coal Origin (Hay Point/Gladstone)" },
  CHN: { name: "China", role: "Global Dry Bulk Demand Driver & Steel Producer" },
  BRA: { name: "Brazil", role: "Major Iron Ore Export Origin (Tubarão/Ponta da Madeira)" },
  ZAF: { name: "South Africa", role: "RBCT Thermal Coal Export Origin" },
  IDN: { name: "Indonesia", role: "High-Moisture Thermal Coal Origin (Kalimantan)" },
};

export async function fetchLiveMacro(): Promise<MacroState> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);

  try {
    const res = await fetch(
      "https://api.worldbank.org/v2/country/IND;CHN;AUS;BRA;ZAF;IDN/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=30",
      { signal: ctl.signal }
    );
    if (!res.ok) {
      return { status: "unavailable", message: `World Bank API returned HTTP ${res.status}` };
    }
    const json = await res.json();
    const rows = json?.[1];

    if (!Array.isArray(rows) || rows.length === 0) {
      return { status: "unavailable", message: "World Bank returned empty dataset" };
    }

    const byCountry: Record<string, CountryMacro> = {};

    for (const row of rows) {
      const code = row.countryiso3code || row.country?.id;
      if (!code || !PARTNER_META[code] || byCountry[code]) continue;
      if (typeof row.value === "number") {
        byCountry[code] = {
          countryCode: code,
          countryName: PARTNER_META[code].name,
          year: row.date || "—",
          gdpGrowthPct: Math.round(row.value * 10) / 10,
          tradePartnerRole: PARTNER_META[code].role,
          source: "World Bank Indicators API v2",
        };
      }
    }

    const results = Object.keys(PARTNER_META)
      .map((code) => byCountry[code])
      .filter((item): item is CountryMacro => item !== undefined);

    if (results.length === 0) {
      return { status: "unavailable", message: "No indicator values returned by World Bank" };
    }

    return { status: "ok", data: results };
  } catch (e) {
    return {
      status: "unavailable",
      message: ctl.signal.aborted ? "World Bank request timed out" : "World Bank API network error",
    };
  } finally {
    clearTimeout(timer);
  }
}

export function useLiveMacro(): MacroState {
  const [state, setState] = useState<MacroState>({ status: "loading" });

  useEffect(() => {
    fetchLiveMacro().then((res) => {
      setState(res);
    });
  }, []);

  return state;
}
