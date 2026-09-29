import { Radio, Waves, Compass, Ship } from "lucide-react";
import { KpiCard, Card, StatusBadge, ProvenanceBadge, Table } from "../components/ui";
import type { PageKey } from "../components/Layout";
import { useLiveApiStatus } from "../services/liveDataHub";

export default function Overview(_props: { go: (p: PageKey) => void }) {
  const { endpoints } = useLiveApiStatus();
  const onlineCount = endpoints.filter((e) => e.status === "ONLINE").length;

  const DOMAIN_STATUS = [
    {
      domain: "Weather Conditions",
      source: "Open-Meteo Weather",
      provenance: "LIVE" as const,
      status: "Available",
      tone: "green" as const,
      description: "Hourly temperature, wind speed, gusts, and precipitation risk across East Coast ports.",
    },
    {
      domain: "Marine & Oceanographic",
      source: "Open-Meteo Marine",
      provenance: "LIVE" as const,
      status: "Available",
      tone: "green" as const,
      description: "Significant wave height, swell wave, wave period, and Douglas sea state observations.",
    },
    {
      domain: "Foreign Exchange",
      source: "ExchangeRate-API / Frankfurter",
      provenance: "LIVE" as const,
      status: "Available",
      tone: "green" as const,
      description: "USD/INR benchmark exchange rates and bunker currency indicators.",
    },
    {
      domain: "Macroeconomic Indicators",
      source: "World Bank Indicators API v2",
      provenance: "LIVE" as const,
      status: "Available",
      tone: "green" as const,
      description: "Annual GDP growth rates for India and key dry bulk trading partners.",
    },
    {
      domain: "Port Infrastructure",
      source: "Indian Ports Directory",
      provenance: "HISTORICAL" as const,
      status: "Operational",
      tone: "green" as const,
      description: "Max DWT capacity, channel depth, permissible drafts, and berth dimensions.",
    },
    {
      domain: "Market Freight Reference",
      source: "Historical Dry Bulk Indices (2012–2019)",
      provenance: "HISTORICAL" as const,
      status: "Historical",
      tone: "amber" as const,
      description: "Time-series reference dataset for historical dry bulk index movements.",
    },
    {
      domain: "Live Vessel Traffic & Lineups",
      source: "Coastal AIS Stream",
      provenance: "UNAVAILABLE" as const,
      status: "Unavailable",
      tone: "slate" as const,
      description: "Real-time vessel queues and AIS tracking are unavailable for Indian coastal waters.",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="sr-only">Overview</h1>

      {/* Primary KPI Grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Live Operational Feeds"
          value={`${onlineCount} / ${endpoints.length}`}
          sub="Weather, Marine & Forex"
          icon={<Radio size={16} />}
          delta="ACTIVE"
          deltaDir="up"
        />
        <KpiCard
          label="Port Infrastructure"
          value="12 Ports"
          sub="East Coast India terminals"
          icon={<Compass size={16} />}
        />
        <KpiCard
          label="Marine Observations"
          value="Live"
          sub="Wave & swell monitoring"
          icon={<Waves size={16} />}
        />
        <KpiCard
          label="Tactical Fleet Radar"
          value="8 Vessels"
          sub="Simulated real-time AIS tracks"
          icon={<Ship size={16} />}
          delta="ACTIVE"
          deltaDir="up"
        />
      </div>

      {/* Tactical Quick-Action Launchpad */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => _props.go("decision")}
          className="group cursor-pointer rounded-2xl border border-sky-200/80 bg-white p-4 shadow-xs transition-all hover:border-sky-400 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-sky-700">CHARTERING</span>
            <span className="text-[12px] text-sky-600 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h3 className="font-serif text-[16px] font-bold text-slate-900 mt-1">Decision Center</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-snug">
            Operational constraint checks, live environmental observations &amp; charter guidance.
          </p>
        </div>

        <div
          onClick={() => _props.go("vessel")}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-sky-400 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-sky-700">FLEET RADAR</span>
            <span className="text-[12px] text-sky-600 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h3 className="font-serif text-[16px] font-bold text-slate-900 mt-1">Tactical Fleet Radar</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-snug">
            Simulated live dry bulk vessel tracking, speed, heading vectors &amp; voyage progress.
          </p>
        </div>

        <div
          onClick={() => _props.go("ports")}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-emerald-400 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">INFRASTRUCTURE</span>
            <span className="text-[12px] text-emerald-600 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h3 className="font-serif text-[16px] font-bold text-slate-900 mt-1">East Coast Ports</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-snug">
            Live sea state (Open-Meteo Marine), permissible drafts, LOA and DWT capacity.
          </p>
        </div>

        <div
          onClick={() => _props.go("simulator")}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-amber-700">WHAT-IF</span>
            <span className="text-[12px] text-amber-600 transition-transform group-hover:translate-x-1">→</span>
          </div>
          <h3 className="font-serif text-[16px] font-bold text-slate-900 mt-1">Scenario Simulator</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-snug">
            Compare charter timing outcomes across market trends, delivery pressure &amp; weather risk.
          </p>
        </div>
      </div>

      {/* Information Domain Coverage */}
      <Card
        title="Information Domains & Operational Data Sources"
        subtitle="Data availability and source provenance across all decision intelligence categories"
      >
        <Table
          head={["Information Domain", "Primary Source", "Provenance", "Status", "Operational Scope"]}
          rows={DOMAIN_STATUS.map((d) => [
            <span className="font-bold text-slate-900">{d.domain}</span>,
            <span className="text-slate-700">{d.source}</span>,
            <ProvenanceBadge p={d.provenance} />,
            <StatusBadge tone={d.tone}>{d.status}</StatusBadge>,
            <span className="text-[12px] text-slate-600">{d.description}</span>,
          ])}
        />
      </Card>

      {/* Six Core Intelligence Domains */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-amber-700">01 · MARKET</span>
            <ProvenanceBadge p="HISTORICAL" />
          </div>
          <h3 className="font-serif text-[15px] font-bold text-slate-900 mt-2">Market Conditions</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
            Historical dry bulk index movements (2012–2019) across Handysize, Supramax, Panamax, and Capesize classes, with scenario-based indicative trends.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Coverage: Global bulk benchmarks</span>
            <span className="font-semibold text-amber-800">Reference Mode</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-sky-700">02 · ATMOSPHERIC</span>
            <ProvenanceBadge p="LIVE" />
          </div>
          <h3 className="font-serif text-[15px] font-bold text-slate-900 mt-2">Weather Conditions</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
            Live atmospheric observations from Open-Meteo across 12 East Coast terminals: ambient temperature, wind velocity, gusts, and precipitation risk.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Coverage: East Coast ports</span>
            <span className="font-semibold text-emerald-800">Connected</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-sky-700">03 · OCEANOGRAPHIC</span>
            <ProvenanceBadge p="LIVE" />
          </div>
          <h3 className="font-serif text-[15px] font-bold text-slate-900 mt-2">Marine Conditions</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
            Live wave height, swell wave, wave period, and Douglas sea state observations via Open-Meteo Marine to evaluate berthing and roadstead safety.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Coverage: Coastal waters &amp; roads</span>
            <span className="font-semibold text-emerald-800">Connected</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">04 · INFRASTRUCTURE</span>
            <ProvenanceBadge p="HISTORICAL" />
          </div>
          <h3 className="font-serif text-[15px] font-bold text-slate-900 mt-2">Port Information</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
            Terminal parameters for 12 East Coast Indian ports: maximum permissible draft, channel depth, maximum LOA, berth counts, and deadweight limits.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Scope: 12 East Coast Terminals</span>
            <span className="font-semibold text-slate-700">Operational Data</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-600">05 · TRACKING</span>
            <ProvenanceBadge p="UNAVAILABLE" />
          </div>
          <h3 className="font-serif text-[15px] font-bold text-slate-900 mt-2">Vessel Information</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
            Live coastal AIS positioning and outer anchorage queue lineups are unavailable via unauthenticated public feeds for Indian waters. Queue status requires port authority verification.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Status: Public feed unavailable</span>
            <span className="font-semibold text-slate-600">Direct Check Required</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-rose-700">06 · RISK</span>
            <ProvenanceBadge p="DERIVED" />
          </div>
          <h3 className="font-serif text-[15px] font-bold text-slate-900 mt-2">Risk Assessment</h3>
          <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
            Integrated scenario sensitivities: demurrage exposure modeling, bunker planning assumptions, weather risk thresholds, and World Bank macroeconomic context.
          </p>
          <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Method: Constraint &amp; Threshold Model</span>
            <span className="font-semibold text-sky-800">Analytical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
