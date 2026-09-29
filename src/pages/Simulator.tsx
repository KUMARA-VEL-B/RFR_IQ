import { useState } from "react";
import { Card, Field, PageHead, ProvenanceBadge, SegButtons, StatusBadge } from "../components/ui";
import type { PageKey } from "../components/Layout";
import { PORTS, SCENARIOS, decide, type Level, type Market } from "../domain/decision";
import { useLiveWeather, weatherRisk } from "../services/liveWeatherService";
import { useShipment } from "../state/shipment";
import { useFreightScenario, type FreightIndex, type FreightScenario } from "../services/mockFreightService";
import { FreightStatus } from "../components/FreightSignal";
import FreightChart from "../components/FreightChart";
import { VoyageCostSimulator } from "../components/VoyageCostSimulator";
import { Sparkles, BarChart3, Ship, ArrowRight } from "lucide-react";

export default function Simulator({ go }: { go: (p: PageKey) => void }) {
  const { s, set } = useShipment();
  const port = PORTS.find((p) => p.key === s.destination);
  const w = useLiveWeather(port?.lat ?? null, port?.lon ?? null);

  const base = {
    cargo: s.cargo || "Coking Coal",
    quantityT: Number(s.quantity) || 75000,
    origin: s.origin || "Gladstone, Australia",
    destinationPortKey: s.destination || "visakhapatnam",
    deliveryPressure: s.deliveryPressure,
    marketScenario: s.marketScenario,
    weatherRisk: s.weatherScenario === "HIGH" ? "HIGH" as const : weatherRisk(w.status === "ok" ? w.data : null),
  };

  const valid = decide(base).decision != null;
  const [fi, setFi] = useState<FreightIndex>("PI");
  const [fs, setFs] = useState<FreightScenario>("NORMAL");
  const sc = useFreightScenario(fi, fs);

  const [activeTab, setActiveTab] = useState<"voyage" | "freight">("voyage");

  const loadSampleShipment = () => {
    set({
      cargo: "Coking Coal",
      quantity: "75000",
      origin: "Gladstone, Australia",
      destination: "visakhapatnam",
    });
  };

  return (
    <div className="space-y-4">
      <PageHead
        title="What-If Simulation & Voyage Modeling"
        subtitle="Compare decisions, landed freight sensitivities, and macro scenarios in real time"
        eyebrow="Simulator · What-If & Sensitivity Engine"
      />

      {/* Simulator Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab("voyage")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "voyage"
                ? "bg-white text-sky-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Ship size={13} className="text-sky-600" />
            <span>Interactive Voyage &amp; Demurrage Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("freight")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "freight"
                ? "bg-white text-sky-950 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 size={13} className="text-slate-600" />
            <span>Macro Market Trend Simulator</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!s.cargo && (
            <button
              onClick={loadSampleShipment}
              className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer"
            >
              <Sparkles size={12} />
              <span>Load Sample 75k Coking Coal</span>
            </button>
          )}
          <button
            onClick={() => go("decision")}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-sky-800 bg-white border border-slate-200 hover:border-sky-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <span>Decision Center</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {activeTab === "voyage" ? (
        <VoyageCostSimulator />
      ) : null}

      {/* What-If Decision Outcomes Grid */}
      <div className="space-y-4">
        <Card title="Decision Sensitivity Controls" action={<ProvenanceBadge p="SIMULATED" />}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Delivery pressure">
              <SegButtons
                size="sm"
                options={["LOW", "NORMAL", "HIGH"] as Level[]}
                value={s.deliveryPressure}
                onChange={(v) => set({ deliveryPressure: v })}
              />
            </Field>
            <Field label="Market scenario">
              <SegButtons
                size="sm"
                options={["BASE", "HIGH", "LOW"] as Market[]}
                value={s.marketScenario}
                onChange={(v) => set({ marketScenario: v })}
              />
            </Field>
            <Field label="Weather scenario">
              <SegButtons
                size="sm"
                options={["LIVE", "HIGH"] as const}
                value={s.weatherScenario}
                onChange={(v) => set({ weatherScenario: v })}
              />
            </Field>
          </div>
        </Card>

        {valid && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SCENARIOS.map((scenario) => {
              const r = decide({ ...base, ...scenario.patch });
              return (
                <Card
                  key={scenario.name}
                  title={scenario.name}
                  action={<StatusBadge tone="amber">Simulated Outcome</StatusBadge>}
                >
                  <p className="text-[28px] font-extrabold text-sky-700">{r.decision}</p>
                  <ul className="mt-1 list-disc pl-5 text-[12px] text-slate-700 space-y-1">
                    {r.reasons.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        )}

        {/* Scenario-based freight outlook */}
        <Card
          title="Scenario-Based Freight Curve Modeling"
          subtitle="Simulate indicative freight paths under synthetic market shocks. Planning assumptions, separate from observed conditions."
          action={<StatusBadge tone="amber">Scenario</StatusBadge>}
        >
          <div className="mb-3 flex flex-wrap gap-2">
            <SegButtons
              size="sm"
              options={["HSI", "SI", "PI", "CI"] as FreightIndex[]}
              value={fi}
              onChange={setFi}
            />
            <SegButtons
              size="sm"
              options={["NORMAL", "RISING", "FALLING", "VOLATILE", "SHOCK"] as FreightScenario[]}
              value={fs}
              onChange={setFs}
            />
          </div>
          <FreightStatus st={sc} retry={sc.retry}>
            {(rows) => (
              <FreightChart
                data={rows.map((r, i) => ({
                  day: i,
                  label: r.date,
                  date: r.date,
                  historical: r.level,
                }))}
                caption={`${fs} scenario · ${fi} · ${rows.length} points · indicative simulation path`}
              />
            )}
          </FreightStatus>
        </Card>
      </div>
    </div>
  );
}
