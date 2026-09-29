import { useState } from "react";
import { Card, Limitations, PageHead, ProvenanceBadge, Table, WeatherCard, MarineCard, LiveFxCard, selectCls } from "../components/ui";
import { PORTS } from "../domain/decision";
import { useLiveWeather } from "../services/liveWeatherService";
import { useLiveMarine } from "../services/liveMarineService";
import { useLiveFx } from "../services/liveFxService";
import { useLiveMacro } from "../services/liveMacroService";
import FreightChart from "../components/FreightChart";
import { dataset, ds01, ds02, show } from "../data/registry/datasetRegistry";
import { useMarketState } from "../services/mockFreightService";
import { MarketStateCard } from "../components/FreightSignal";
import type { PageKey } from "../components/Layout";

const COMMODITIES = Object.keys(ds01.series) as (keyof typeof ds01.series)[];

export default function Risk(_props: { go: (p: PageKey) => void }) {
  const [c, setC] = useState(COMMODITIES[0]);
  const [pk, setPk] = useState(PORTS[0]?.key ?? "");
  const port = PORTS.find((p) => p.key === pk);
  const w = useLiveWeather(port?.lat ?? null, port?.lon ?? null);
  const m = useLiveMarine(port?.lat ?? null, port?.lon ?? null);
  const fx = useLiveFx();
  const macro = useLiveMacro();
  const m1 = dataset("DS01"), m2 = dataset("DS02");
  const s = ds01.series[c];
  const ms = useMarketState("PI");
  const data = (s.points as [string, number | null][]).map(([d, v], i) => ({ day: i, label: d, date: d, historical: v ?? undefined }));

  return (
    <div>
      <PageHead
        title="Market, Macro & Oceanographic Risk"
        subtitle="Live foreign exchange · live sea conditions · macroeconomic indicators · commodity benchmarks"
        eyebrow="Risk · Multi-Dimensional Exposure"
      />

      {/* Live Foreign Exchange Rates */}
      <div className="mb-4">
        <LiveFxCard fx={fx} />
      </div>

      {/* Live Port Atmospheric & Ocean Weather */}
      <div className="mb-4">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Select Port For Live Marine & Atmospheric Telemetry
        </label>
        <select aria-label="Port" className={selectCls} value={pk} onChange={(e) => setPk(e.target.value)}>
          {PORTS.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
        </select>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <WeatherCard port={port?.name ?? pk} w={w} />
          <MarineCard port={port?.name ?? pk} m={m} />
        </div>
      </div>

      {/* World Bank Indicators for Trade Partners */}
      <Card
        title="World Bank Macroeconomic Indicators (Trade Partners)"
        subtitle="Official indicators via World Bank Open API v2 for major dry bulk trading partners"
        className="mb-4"
        action={<ProvenanceBadge p={macro.status === "ok" ? "LIVE" : "UNAVAILABLE"} />}
      >
        {macro.status === "unavailable" ? (
          <p className="text-[13px] text-slate-500 py-2">
            Macroeconomic feed currently unavailable ({macro.message}).
          </p>
        ) : (
          <Table
            head={["Country", "Key Bulk Trade Role", "GDP Growth (Annual %)", "Reported Year", "Feed Source"]}
            rows={
              macro.status === "loading"
                ? [["Connecting to World Bank Open API…", "—", "—", "—", "—"]]
                : macro.data.map((row) => [
                    <b>{row.countryName} ({row.countryCode})</b>,
                    row.tradePartnerRole,
                    <span className="font-mono font-bold text-sky-800">
                      {row.gdpGrowthPct != null ? `${row.gdpGrowthPct > 0 ? "+" : ""}${row.gdpGrowthPct}%` : "—"}
                    </span>,
                    row.year,
                    <span className="text-[11px] text-slate-500">{row.source}</span>,
                  ])
            }
          />
        )}
      </Card>

      <MarketStateCard ms={ms} title="Market risk · indicative freight volatility" className="mb-4" />

      <Card title="Historical Macroeconomic Indicators" subtitle="Latest valid benchmark value per country × indicator" action={<ProvenanceBadge p={m2.provenance} />}>
        <Table head={["Country", "Indicator", "Latest", "Unit", "As of", "Frequency", "Valid / n"]}
          rows={ds02.rows.map((r) => [r.country, r.indicator, show(r.latest), show(r.unit), show(r.last), show(r.frequency), `${r.valid} / ${r.n}`])} />
      </Card>

      <Card title={`${c}`} subtitle={`${s.unit} ${s.currency} · monthly`} className="mt-4"
        action={<div className="flex items-center gap-2"><ProvenanceBadge p={m1.provenance} />
          <select aria-label="Commodity" className={selectCls} value={c} onChange={(e) => setC(e.target.value as typeof c)}>
            {COMMODITIES.map((k) => <option key={k}>{k}</option>)}
          </select></div>}>
        <FreightChart data={data} caption="Source: public commodity benchmarks" />
      </Card>

      <Limitations items={[...m2.limitations, ...m1.limitations]} />
    </div>
  );
}
