import { Card, Limitations, PageHead, ProvenanceBadge, StatusBadge, Table } from "../components/ui";
import { dataset, ds04, ds05, show } from "../data/registry/datasetRegistry";
import type { PageKey } from "../components/Layout";
import { useAllPortsTelemetry } from "../services/livePortTelemetry";
import { Waves, Wind, Thermometer, RefreshCw } from "lucide-react";
import { PortDraftSimulator } from "../components/PortDraftSimulator";

type Cell = { v: string | number | boolean | null; u: string | null; s: string | null };
const cell = (c?: Cell) => (!c || c.v === null ? "Not available" : c.u ? `${c.v} ${c.u}` : String(c.v));
const PORT_FIELDS = ["official_port_name", "state", "port_type", "ownership", "maximum_draft", "channel_depth", "max_loa", "max_dwt", "number_of_berths"];
const BERTH_FIELDS = ["permissible_draft", "berth_length", "max_loa", "max_dwt", "cargo"];

export default function Ports(_props: { go: (p: PageKey) => void }) {
  const m4 = dataset("DS04"), m5 = dataset("DS05");
  const ports = ds05.ports as unknown as Record<string, Cell & string>[];
  const berths = ds05.berths as unknown as Record<string, Cell & string>[];
  const { telemetry, loading, lastRefreshed, refresh } = useAllPortsTelemetry();

  return (
    <div>
      <PageHead
        title="East Coast Port Intelligence"
        subtitle="Live oceanographic & meteorological telemetry · port statistics · berth infrastructure"
        eyebrow="Ports · Capacity & Environmental Conditions"
      />

      {/* Live Ocean & Atmospheric Conditions */}
      <Card
        title="Live East Coast Ocean & Meteorological Telemetry"
        subtitle="Live multi-port observations from Open-Meteo Weather & Marine APIs"
        action={
          <div className="flex items-center gap-2">
            <ProvenanceBadge p="LIVE" />
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white/60 px-2.5 py-1 text-[11px] font-bold text-sky-700 hover:bg-sky-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              {loading ? "Updating…" : "Refresh Feeds"}
            </button>
          </div>
        }
        className="mb-4"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.values(telemetry).map((t) => {
            const hasData = t.marineStatus === "ok" || t.weatherStatus === "ok";
            const wave = t.marine?.waveHeight != null ? `${t.marine.waveHeight.toFixed(2)} m` : "—";
            const swell = t.marine?.swellHeight != null ? `${t.marine.swellHeight.toFixed(2)} m` : "—";
            const wind = t.weather?.wind != null ? `${t.weather.wind} km/h` : "—";
            const gusts = t.weather?.gusts != null ? `${t.weather.gusts} km/h` : "—";
            const temp = t.weather?.temp != null ? `${t.weather.temp}°C` : "—";
            const seaState = t.marine?.seaState || "Unavailable";

            return (
              <div
                key={t.portKey}
                className="rounded-xl border border-slate-200/80 bg-white/70 p-3 shadow-xs transition-all hover:border-sky-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900">{t.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      {t.lat?.toFixed(2)}°N, {t.lon?.toFixed(2)}°E
                    </span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    hasData ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {hasData ? "LIVE" : "UNAVAILABLE"}
                  </span>
                </div>

                {hasData ? (
                  <div className="mt-2.5 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1 text-slate-600">
                      <span className="flex items-center gap-1 text-sky-700">
                        <Waves size={12} /> Wave / Swell
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {wave} · {swell}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-1 text-slate-600">
                      <span className="flex items-center gap-1 text-sky-700">
                        <Wind size={12} /> Wind / Gusts
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {wind} ({gusts})
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-1 text-slate-600">
                      <span className="flex items-center gap-1 text-sky-700">
                        <Thermometer size={12} /> Temperature
                      </span>
                      <span className="font-mono font-bold text-slate-800">{temp}</span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Sea State</span>
                      <span className="text-[10px] font-semibold text-slate-700">{seaState}</span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] text-slate-400">Connecting live sensors…</p>
                )}
              </div>
            );
          })}
        </div>
        {lastRefreshed && (
          <p className="mt-3 text-[10px] text-slate-500">
            Last synchronized: {lastRefreshed.toLocaleTimeString()} · Live streaming via Open-Meteo Marine & Atmospheric Feeds
          </p>
        )}
      </Card>

      {/* Interactive Vessel Draft & Berth Simulator */}
      <PortDraftSimulator go={_props.go} />

      <Card title="Port Statistics" subtitle="Country aggregates are NOT port-level data" action={<ProvenanceBadge p={m4.provenance} />}>
        <Table head={["Level", "Country", "Port", "Year", "Tonnes", "TEU", "Calls", "Type"]}
          rows={ds04.rows.map((r) => [r.level, r.country, show(r.port), show(r.year), show(r.tonnes), show(r.teu), show(r.calls), r.dataType])} />
        <div className="mt-3 flex flex-wrap gap-2">
          {ds04.failed.length > 0 && <StatusBadge tone="amber">Information unavailable</StatusBadge>}
        </div>
      </Card>
      <Card title="Port Infrastructure" subtitle={m5.quality ?? undefined} className="mt-4" action={<ProvenanceBadge p={m5.provenance} />}>
        <Table head={["Port", "Status", ...PORT_FIELDS]}
          rows={ports.map((p) => [cell(p.port_name), <StatusBadge tone={p.port_status === "SOURCED" ? "green" : "amber"}>{p.port_status}</StatusBadge>, ...PORT_FIELDS.map((f) => cell(p[f]))])} />
      </Card>
      <Card title="Berths" subtitle={`${berths.length} berths`} className="mt-4" action={<ProvenanceBadge p={m5.provenance} />}>
        <Table head={["Port", "Berth", "Dock / terminal", ...BERTH_FIELDS]}
          rows={berths.map((b) => [b.port_key, show(b.berth_name), show(b.dock_or_terminal), ...BERTH_FIELDS.map((f) => cell(b[f]))])} />
      </Card>
      <p className="mt-4 text-[12px] text-slate-500">Where a field is Not available, compatibility cannot be confirmed with the available information.</p>
      <Limitations items={[...m4.limitations, ...m5.limitations]} />
    </div>
  );
}
