import { useState, useEffect } from "react";
import { Card, Field, PageHead, ProvenanceBadge, SegButtons, StatusBadge, WeatherCard, MarineCard, selectCls } from "../components/ui";
import type { PageKey } from "../components/Layout";
import { COMMODITIES, ORIGINS } from "../domain/freight";
import { PORTS, decide, type Level } from "../domain/decision";
import { useLiveWeather, weatherRisk } from "../services/liveWeatherService";
import { useLiveMarine } from "../services/liveMarineService";
import { useLiveFx } from "../services/liveFxService";
import { useLiveVesselAvailability } from "../services/liveVesselService";
import { useShipment } from "../state/shipment";
import { indexForQuantity, useMarketState } from "../services/mockFreightService";
import { MarketStateCard } from "../components/FreightSignal";
import { Landmark, FileText, Sliders, Info, ArrowLeftRight } from "lucide-react";
import { CharteringDossierModal } from "../components/CharteringDossierModal";
import { useCurrency } from "../state/currency";
import { CurrencyToggle } from "../components/CurrencyToggle";

// Maritime dry bulk charter benchmark: daily demurrage rate scales with vessel class and parcel quantity
export function defaultDemurrageRateForQty(q: number): number {
  const effectiveQ = q > 0 ? q : 75000;
  if (effectiveQ >= 150000) return Math.round((effectiveQ * 0.23) / 500) * 500; // Capesize ~$35k-$45k/day
  if (effectiveQ >= 100000) return Math.round((effectiveQ * 0.25) / 500) * 500; // Mini Cape/Post-Panamax ~$25k-$32k/day
  if (effectiveQ >= 65000) return Math.round((effectiveQ * 0.27) / 500) * 500;  // Panamax/Kamsarmax ~$18k-$24k/day
  if (effectiveQ >= 40000) return Math.round((effectiveQ * 0.29) / 500) * 500;  // Supramax ~$12k-$17k/day
  return Math.round(Math.max(8000, effectiveQ * 0.33) / 500) * 500;            // Handysize ~$8k-$12k/day
}

export default function Decision(_props: { go: (p: PageKey) => void }) {
  const { s, set } = useShipment();
  const { currency, formatCurrency, usdToInrRate, toggleCurrency } = useCurrency();
  const port = PORTS.find((p) => p.key === s.destination);
  const w = useLiveWeather(port?.lat ?? null, port?.lon ?? null);
  const m = useLiveMarine(port?.lat ?? null, port?.lon ?? null);
  const fx = useLiveFx();
  const v = useLiveVesselAvailability(s.destination);
  const ms = useMarketState(indexForQuantity(Number(s.quantity)));

  const [dossierOpen, setDossierOpen] = useState(false);
  // Planning assumptions (user scenario inputs)
  const [bunkerAssumption, setBunkerAssumption] = useState(625); // $/MT assumption
  const [waitDaysAssumption, setWaitDaysAssumption] = useState(2.0); // days assumption

  const qty = Number(s.quantity) || 0;

  // Demurrage daily rate initialized and automatically recalculated whenever cargo quantity changes
  const [demurrageAssumption, setDemurrageAssumption] = useState<number>(() => defaultDemurrageRateForQty(qty));

  useEffect(() => {
    // When quantity changes, update the daily demurrage rate to match the vessel parcel scale
    setDemurrageAssumption(defaultDemurrageRateForQty(qty));
  }, [qty]);

  // Real-time FX (only used when legitimately available; no fake fallback)
  const inrRate = fx.status === "ok" ? fx.data.INR : usdToInrRate;

  // Dynamic rate boundaries scaling with parcel quantity
  const baseRate = defaultDemurrageRateForQty(qty);
  const minRate = Math.max(5000, Math.round((baseRate * 0.5) / 500) * 500);
  const maxRate = Math.round((baseRate * 1.6) / 500) * 500;

  // Demurrage planning calculation based on user scenario inputs AND parcel quantity
  const demurrageExposureUsd = Math.round(waitDaysAssumption * demurrageAssumption);
  const demurrageExposureInr = demurrageExposureUsd * inrRate;
  const demurragePerTonUsd = qty > 0 ? demurrageExposureUsd / qty : 0;
  const demurragePerTonInr = qty > 0 ? demurrageExposureInr / qty : 0;

  const r = decide({
    cargo: s.cargo,
    quantityT: Number(s.quantity),
    origin: s.origin,
    destinationPortKey: s.destination,
    deliveryPressure: s.deliveryPressure,
    marketScenario: "BASE",
    weatherRisk: weatherRisk(w.status === "ok" ? w.data : null),
    simulatedFreight: ms.status === "ok" ? { index: ms.data.index, trend: ms.data.trend, latest: ms.data.latest_value } : null,
    marineSafety: m.status === "ok" ? m.data.berthingSafety : "UNAVAILABLE",
    marineDetail: m.status === "ok" ? `Wave ${m.data.waveHeight?.toFixed(1) ?? "—"}m, Swell ${m.data.swellHeight?.toFixed(1) ?? "—"}m (${m.data.seaState})` : undefined,
    vesselAvailability: "UNAVAILABLE",
    vesselDetail: v.status === "unavailable" ? v.message : "Live vessel tracking unavailable for this region.",
  });

  return (
    <div>
      <PageHead
        title="Charter Decision Center"
        subtitle="ENTER / WAIT / WATCH derived from operational inputs and live environmental conditions"
        eyebrow="Decision · Operational Inputs"
      />
      <Card title="Shipment Specifications">
        {/* Quick Operational Templates */}
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Quick Templates:
          </span>
          <button
            type="button"
            onClick={() =>
              set({
                cargo: "Coking coal",
                quantity: "165000",
                origin: "Australia",
                destination: "paradip",
                deliveryPressure: "NORMAL",
              })
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 transition-all cursor-pointer shadow-2xs"
          >
            🇦🇺 Capesize Coal (165k t) → Paradip
          </button>
          <button
            type="button"
            onClick={() =>
              set({
                cargo: "Iron ore",
                quantity: "195000",
                origin: "Brazil",
                destination: "gangavaram",
                deliveryPressure: "HIGH",
              })
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 transition-all cursor-pointer shadow-2xs"
          >
            🇧🇷 Capesize Ore (195k t) → Gangavaram
          </button>
          <button
            type="button"
            onClick={() =>
              set({
                cargo: "Thermal coal",
                quantity: "75000",
                origin: "South Africa",
                destination: "visakhapatnam",
                deliveryPressure: "NORMAL",
              })
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 transition-all cursor-pointer shadow-2xs"
          >
            🇿🇦 Panamax Coal (75k t) → Vizag
          </button>
          <button
            type="button"
            onClick={() =>
              set({
                cargo: "Coking coal",
                quantity: "70000",
                origin: "Australia",
                destination: "dhamra",
                deliveryPressure: "NORMAL",
              })
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 transition-all cursor-pointer shadow-2xs"
          >
            🇦🇺 Panamax Coking (70k t) → Dhamra
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Cargo">
            <select className={selectCls} value={s.cargo} onChange={(e) => set({ cargo: e.target.value })}>
              <option value="">Select…</option>
              {COMMODITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Quantity (t)">
            <input type="number" min={1} className={selectCls} value={s.quantity} onChange={(e) => set({ quantity: e.target.value })} />
          </Field>
          <Field label="Origin">
            <select className={selectCls} value={s.origin} onChange={(e) => set({ origin: e.target.value })}>
              <option value="">Select…</option>
              {ORIGINS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Destination port">
            <select className={selectCls} value={s.destination} onChange={(e) => set({ destination: e.target.value })}>
              <option value="">Select…</option>
              {PORTS.map((p) => (
                <option key={p.key} value={p.key}>{p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Delivery requirement">
            <SegButtons size="sm" options={["LOW", "NORMAL", "HIGH"] as Level[]} value={s.deliveryPressure} onChange={(v) => set({ deliveryPressure: v })} />
          </Field>
        </div>
      </Card>

      {!r.decision ? (
        <Card title="Enter shipment details to begin" className="mt-4">
          <p className="text-[13px] text-slate-500">Select cargo, a positive quantity, origin and destination port.</p>
        </Card>
      ) : (
        <>
          <Card title="Decision Evaluation Steps" className="mt-4">
            <ol className="space-y-2">
              {r.steps.map((st, i) => (
                <li key={st.name} className="flex flex-wrap items-center gap-2 text-[13px] text-slate-700">
                  <span className="w-5 font-bold text-sky-700">{i + 1}</span>
                  <b className="w-52">{st.name}</b>
                  <StatusBadge tone={st.status === "PASS" ? "green" : st.status === "FAIL" ? "red" : st.status === "UNAVAILABLE" ? "slate" : "navy"}>
                    {st.status}
                  </StatusBadge>
                  <ProvenanceBadge p={st.provenance} />
                  <span className="text-slate-500">{st.detail}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Planning Assumptions & Scenario Sensitivities */}
          {qty > 0 && s.cargo && (
            <Card
              title="Voyage Planning Assumptions & Cost Sensitivities"
              subtitle="Scenario modeling inputs — not commercial market quotes"
              className="mt-4"
              action={
                <div className="flex items-center gap-2">
                  <CurrencyToggle showRateBadge size="sm" />
                  <ProvenanceBadge p="INDICATIVE" />
                </div>
              }
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Commercial Spot Freight
                  </span>
                  <p className="mt-1 font-serif text-[18px] font-bold text-slate-800">
                    Freight price unavailable
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Live ocean freight requires broker fixture confirmation.
                  </p>
                </div>

                {/* Reference FX Card - Clickable to toggle */}
                <div
                  onClick={() => toggleCurrency()}
                  className="group rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 cursor-pointer hover:border-sky-300 hover:bg-sky-50/40 transition-all shadow-2xs"
                  title="Click to toggle currency between USD and INR"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-sky-900 transition-colors">
                      <Landmark size={12} className="text-slate-700" /> Reference FX (USD/INR)
                    </span>
                    <ProvenanceBadge p={fx.status === "ok" ? "LIVE" : "UNAVAILABLE"} />
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="font-mono text-[20px] font-bold text-slate-900">
                      {inrRate ? `₹${inrRate.toFixed(2)}` : "Unavailable"}
                    </p>
                    <span className="rounded bg-white border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-800 shadow-2xs group-hover:bg-sky-100 transition-colors">
                      {currency} ⇄
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span className="truncate">{fx.status === "ok" ? fx.data.source : "Foreign exchange feed"}</span>
                    <span className="text-[10px] text-sky-700 font-semibold underline shrink-0 ml-1">Toggle currency</span>
                  </p>
                </div>

                {/* Planning Demurrage Contingency Card with Dedicated Interactive Currency Toggle Button */}
                <div
                  className={`rounded-2xl border p-4 transition-all shadow-2xs ${
                    currency === "INR"
                      ? "border-emerald-300 bg-gradient-to-br from-emerald-50/80 to-white ring-1 ring-emerald-500/20"
                      : "border-amber-200/90 bg-gradient-to-br from-amber-50/70 to-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Planning Demurrage Contingency
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-extrabold ${
                            currency === "INR"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sky-100 text-sky-800"
                          }`}
                        >
                          {currency} MODE
                        </span>
                      </div>
                    </div>

                    {/* Dedicated Button to change currency from USD to Indian Currency or vice-versa */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCurrency();
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-2xs hover:border-sky-400 hover:text-sky-900 transition-all cursor-pointer active:scale-95"
                      title="Click to switch currency between USD and Indian Rupee (INR)"
                      aria-label="Toggle currency"
                    >
                      <ArrowLeftRight size={11} className="text-slate-600" />
                      <span>{currency === "USD" ? "Switch to ₹ INR" : "Switch to $ USD"}</span>
                    </button>
                  </div>

                  {/* Main Value Display with clickable quick-toggle */}
                  <div
                    onClick={() => toggleCurrency()}
                    className="mt-2.5 cursor-pointer group"
                    title="Click to toggle currency between USD ($) and Indian Rupee (₹)"
                  >
                    <p
                      className={`font-mono text-[24px] font-black tracking-tight transition-colors ${
                        currency === "INR"
                          ? "text-emerald-900 group-hover:text-emerald-700"
                          : "text-amber-900 group-hover:text-amber-700"
                      }`}
                    >
                      {currency === "USD"
                        ? `$${demurrageExposureUsd.toLocaleString()}`
                        : `₹${(demurrageExposureInr / 100000).toFixed(2)} Lakhs`}
                    </p>

                    <p className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
                      <span>
                        {currency === "USD"
                          ? `≈ ₹${(demurrageExposureInr / 100000).toFixed(2)} Lakhs (₹${Math.round(demurrageExposureInr).toLocaleString("en-IN")})`
                          : `≈ $${demurrageExposureUsd.toLocaleString()} USD reference`}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-sky-700 group-hover:underline">
                        ⇄ Click to flip
                      </span>
                    </p>

                    {/* Breakdown showing that quantity directly drives the calculation */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-600 gap-1">
                      <span>
                        Parcel: <strong className="text-slate-900 font-bold">{qty > 0 ? `${qty.toLocaleString()} t` : "75,000 t"}</strong>
                      </span>
                      <span>
                        Daily: <strong className="text-sky-800 font-bold">${demurrageAssumption.toLocaleString()}/d</strong>
                      </span>
                      <span>
                        Unit Exposure: <strong className="text-emerald-800 font-bold">
                          {currency === "USD" ? `$${demurragePerTonUsd.toFixed(2)}/t` : `₹${demurragePerTonInr.toFixed(1)}/t`}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenario Sensitivity Controls */}
              <div className="mt-4 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Sliders size={14} className="text-slate-600" />
                    <span className="text-[12px] font-bold text-slate-800">
                      Scenario Planning Inputs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-600">
                      Displaying in: <strong className="text-slate-900 font-bold">{currency}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCurrency()}
                      className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <ArrowLeftRight size={10} />
                      <span>Switch to {currency === "USD" ? "₹ INR" : "$ USD"}</span>
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Assumed Port Delay</span>
                      <span className="font-mono font-bold text-sky-800">{waitDaysAssumption} days</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={waitDaysAssumption}
                      onChange={(e) => setWaitDaysAssumption(parseFloat(e.target.value))}
                      className="mt-1 w-full accent-sky-600 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500">Planning assumption</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Assumed Demurrage Rate</span>
                      <span className="font-mono font-bold text-sky-800">
                        {formatCurrency(demurrageAssumption, { suffix: "/day", showOriginal: true })}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={minRate}
                      max={maxRate}
                      step="500"
                      value={demurrageAssumption}
                      onChange={(e) => setDemurrageAssumption(parseInt(e.target.value))}
                      className="mt-1 w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>Min ${minRate.toLocaleString()}</span>
                      <span>Scales with {qty > 0 ? `${qty.toLocaleString()} t` : "parcel"}</span>
                      <span>Max ${maxRate.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Assumed Bunker Price</span>
                      <span className="font-mono font-bold text-sky-800">
                        {formatCurrency(bunkerAssumption, { suffix: "/MT", showOriginal: true })}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="800"
                      step="10"
                      value={bunkerAssumption}
                      onChange={(e) => setBunkerAssumption(parseInt(e.target.value))}
                      className="mt-1 w-full accent-sky-600 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500">Planning assumption</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <MarketStateCard ms={ms} className="mt-4" />

          {/* Environmental Conditions & Vessel Status */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <WeatherCard port={port?.name ?? s.destination} w={w} />
            <MarineCard port={port?.name ?? s.destination} m={m} />
            <Card
              title={`Vessel Status · ${port?.name ?? s.destination}`}
              subtitle="Regional Vessel Tracking"
              action={<ProvenanceBadge p="UNAVAILABLE" />}
            >
              <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 text-[12px] text-slate-700 border border-slate-200">
                <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
                <p>
                  Live vessel tracking unavailable for this region. Commercial port queues and lineup availability must be verified directly with the terminal authority.
                </p>
              </div>
            </Card>
          </div>

          <Card
            title="Recommended Action"
            className="mt-4"
            action={
              <div className="flex items-center gap-2">
                <ProvenanceBadge p="DERIVED" />
                <button
                  onClick={() => setDossierOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-bold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  <FileText size={13} />
                  <span>Dossier Summary</span>
                </button>
              </div>
            }
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-[44px] font-extrabold tracking-tight text-sky-700">{r.decision}</p>
            </div>
            <p className="mt-3 text-[12px] font-bold text-slate-500">Supporting Reasons</p>
            <ul className="mt-1 list-disc pl-5 text-[13px] text-slate-700">
              {r.reasons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-500">
              Rule-based guidance evaluating port constraints, Open-Meteo environmental observations, and delivery pressure.
            </p>
          </Card>

          {/* Dossier Modal */}
          <CharteringDossierModal
            isOpen={dossierOpen}
            onClose={() => setDossierOpen(false)}
            shipment={{
              cargo: s.cargo,
              quantity: s.quantity,
              origin: s.origin,
              destination: s.destination,
              deliveryPressure: s.deliveryPressure,
              marketScenario: s.marketScenario,
            }}
            portName={port?.name ?? s.destination}
            inrRate={inrRate}
            decision={r.decision}
            reasons={r.reasons}
            weatherStatus={w.status === "ok" ? { temp: w.data.temp, wind: w.data.wind, gusts: w.data.gusts } : undefined}
            marineStatus={m.status === "ok" ? { waveHeight: m.data.waveHeight, swellHeight: m.data.swellHeight, seaState: m.data.seaState } : undefined}
          />
        </>
      )}
    </div>
  );
}
