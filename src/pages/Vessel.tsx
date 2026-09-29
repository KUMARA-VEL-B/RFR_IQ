import { useState } from "react";
import { Card, Limitations, PageHead, ProvenanceBadge, StatusBadge, Table } from "../components/ui";
import { dataset, ds03 } from "../data/registry/datasetRegistry";
import type { PageKey } from "../components/Layout";
import { Info, Radar, Database } from "lucide-react";
import { FleetRadarSimulation } from "../components/FleetRadarSimulation";

export default function Vessel({ go }: { go: (p: PageKey) => void }) {
  const m = dataset("DS03");
  const [activeTab, setActiveTab] = useState<"radar" | "historical">("radar");

  return (
    <div className="space-y-4">
      <PageHead
        title="Tactical Fleet Intelligence & AIS Reference"
        subtitle="Simulated real-time dry bulk vessel tracking · regional traffic telemetry · historical benchmark aggregates"
        eyebrow="Vessel · Tactical Tracking & Corridor Telemetry"
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab("radar")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "radar"
                ? "bg-white text-sky-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Radar size={13} className="text-sky-600" />
            <span>Tactical Fleet Radar (Active Simulation)</span>
          </button>
          <button
            onClick={() => setActiveTab("historical")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "historical"
                ? "bg-white text-sky-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database size={13} className="text-slate-600" />
            <span>Historical Regional Traffic Dataset</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-500">
            Region: <strong>Indian Ocean & Bay of Bengal</strong>
          </span>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === "radar" ? (
        <FleetRadarSimulation go={go} />
      ) : (
        <div className="space-y-4">
          {/* Truthful Regional Vessel Tracking Status */}
          <Card
            title="Regional Vessel Tracking Status & Feed Disclosure"
            subtitle="Operational availability of live commercial satellite AIS and port queue telemetry"
            action={<ProvenanceBadge p="UNAVAILABLE" />}
          >
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Info size={18} className="text-slate-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-[13px] text-slate-700">
                <p className="font-semibold text-slate-900">
                  Live satellite vessel tracking unavailable via unauthenticated public feeds.
                </p>
                <p className="text-slate-600 leading-relaxed text-[12px]">
                  Real-time AIS positioning and live outer anchorage queue lineups for Indian East Coast bulk terminals are not accessible via open, unauthenticated public feeds. Operational queues must be verified directly with respective port authorities or terminal operators. The Tactical Radar tab provides simulated scenario tracking.
                </p>
              </div>
            </div>
          </Card>

          <div className="mb-2 flex flex-wrap gap-2">
            <StatusBadge tone="amber">HISTORICAL US BENCHMARK</StatusBadge>
            <ProvenanceBadge p={m.provenance} />
          </div>

          <Card
            title="Historical AIS Regional Traffic Aggregates"
            subtitle={`${m.records} position records · ${m.dateRange?.join(" → ")}`}
          >
            <Table
              head={["Region", "Records", "Vessels", "Cargo", "Tanker", "Mean speed (kn)", "First", "Last"]}
              rows={ds03.regions.map((r) => [
                r.region,
                r.records,
                r.vessels,
                r.types.CARGO ?? "Information unavailable",
                r.types.TANKER ?? "Information unavailable",
                r.meanSpeedKn,
                r.first,
                r.last,
              ])}
            />
          </Card>

          <Limitations items={m.limitations} />
        </div>
      )}
    </div>
  );
}
