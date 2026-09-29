import { useState } from "react";
import { Sliders, ShieldCheck, AlertTriangle, XCircle, ChevronRight, Anchor } from "lucide-react";
import { useShipment } from "../state/shipment";
import type { PageKey } from "./Layout";

interface PortDepthSpec {
  key: string;
  name: string;
  state: string;
  maxDraft: number;
  channelDepth: number;
  maxDwt: number;
  maxLoa: number;
  berths: number;
  berthCargo: string;
}

const EAST_COAST_PORT_SPECS: PortDepthSpec[] = [
  {
    key: "gangavaram",
    name: "Gangavaram Port",
    state: "Andhra Pradesh",
    maxDraft: 18.5,
    channelDepth: 20.2,
    maxDwt: 200000,
    maxLoa: 320,
    berths: 9,
    berthCargo: "Capesize Iron Ore, Coking Coal & Limestone",
  },
  {
    key: "dhamra",
    name: "Dhamra Port",
    state: "Odisha",
    maxDraft: 18.0,
    channelDepth: 19.5,
    maxDwt: 180000,
    maxLoa: 310,
    berths: 6,
    berthCargo: "Deep-draft Coking Coal & Iron Ore Pellets",
  },
  {
    key: "krishnapatnam",
    name: "Krishnapatnam Port",
    state: "Andhra Pradesh",
    maxDraft: 18.0,
    channelDepth: 19.0,
    maxDwt: 200000,
    maxLoa: 310,
    berths: 14,
    berthCargo: "Steam Coal, Fertilizers & Project Bulk",
  },
  {
    key: "chennai",
    name: "Chennai Port",
    state: "Tamil Nadu",
    maxDraft: 15.5,
    channelDepth: 17.0,
    maxDwt: 160000,
    maxLoa: 280,
    berths: 24,
    berthCargo: "Containers, Dry Bulk & Automotive",
  },
  {
    key: "kamarajar",
    name: "Kamarajar Port (Ennore)",
    state: "Tamil Nadu",
    maxDraft: 15.0,
    channelDepth: 16.5,
    maxDwt: 150000,
    maxLoa: 270,
    berths: 9,
    berthCargo: "TNEB Thermal Coal & Liquid Bulk",
  },
  {
    key: "paradip",
    name: "Paradip Port",
    state: "Odisha",
    maxDraft: 14.5,
    channelDepth: 17.1,
    maxDwt: 320000,
    maxLoa: 300,
    berths: 18,
    berthCargo: "Iron Ore, Coastal Thermal Coal, Coking Coal",
  },
  {
    key: "visakhapatnam",
    name: "Visakhapatnam Port",
    state: "Andhra Pradesh",
    maxDraft: 14.5,
    channelDepth: 16.5,
    maxDwt: 200000,
    maxLoa: 290,
    berths: 24,
    berthCargo: "Inner/Outer Harbour Coking Coal, Alumina, Crude",
  },
  {
    key: "kakinada",
    name: "Kakinada Deep Water Port",
    state: "Andhra Pradesh",
    maxDraft: 13.5,
    channelDepth: 14.5,
    maxDwt: 75000,
    maxLoa: 235,
    berths: 6,
    berthCargo: "Supramax Agricommodities, Granite, Coal",
  },
  {
    key: "gopalpur",
    name: "Gopalpur Port",
    state: "Odisha",
    maxDraft: 13.0,
    channelDepth: 14.0,
    maxDwt: 120000,
    maxLoa: 225,
    berths: 4,
    berthCargo: "Ilmenite, Coal & Iron Ore",
  },
  {
    key: "voc_tuticorin",
    name: "V.O. Chidambaranar (Tuticorin)",
    state: "Tamil Nadu",
    maxDraft: 12.8,
    channelDepth: 14.1,
    maxDwt: 95000,
    maxLoa: 230,
    berths: 16,
    berthCargo: "Thermal Coal, Copper Concentrate, Salt",
  },
  {
    key: "kolkata_haldia",
    name: "Kolkata / Haldia Dock",
    state: "West Bengal",
    maxDraft: 8.5,
    channelDepth: 9.2,
    maxDwt: 45000,
    maxLoa: 195,
    berths: 14,
    berthCargo: "Riverine Handy Bulk (Lighterage at Sandheads required)",
  },
];

export function PortDraftSimulator({ go }: { go: (p: PageKey) => void }) {
  const [testDraft, setTestDraft] = useState<number>(14.2);
  const [testDwt, setTestDwt] = useState<number>(75000);
  const [testLoa, setTestLoa] = useState<number>(225);
  const { set: setShipment } = useShipment();

  const applyPreset = (preset: "supramax" | "panamax" | "capesize" | "newcastlemax") => {
    if (preset === "supramax") {
      setTestDraft(12.5);
      setTestDwt(55000);
      setTestLoa(190);
    } else if (preset === "panamax") {
      setTestDraft(14.2);
      setTestDwt(75000);
      setTestLoa(225);
    } else if (preset === "capesize") {
      setTestDraft(17.5);
      setTestDwt(160000);
      setTestLoa(290);
    } else if (preset === "newcastlemax") {
      setTestDraft(18.5);
      setTestDwt(205000);
      setTestLoa(300);
    }
  };

  const handleSelectPort = (portKey: string) => {
    setShipment({
      destination: portKey,
      quantity: String(testDwt),
    });
    go("decision");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 mb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
            <Anchor size={17} />
          </div>
          <div>
            <h3 className="font-serif text-[16px] font-bold text-slate-900">
              Interactive Vessel Draft &amp; Berth Compatibility Simulator
            </h3>
            <p className="text-[12px] text-slate-500">
              Drag vessel draft and dimensions to dynamically test Under-Keel Clearance (UKC) across all East Coast terminals.
            </p>
          </div>
        </div>

        {/* Quick Vessel Presets */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <span className="text-[10px] font-mono font-bold text-slate-500 px-1">Presets:</span>
          <button
            onClick={() => applyPreset("supramax")}
            className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:text-sky-800 transition-colors cursor-pointer"
          >
            Supramax (12.5m)
          </button>
          <button
            onClick={() => applyPreset("panamax")}
            className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:text-sky-800 transition-colors cursor-pointer"
          >
            Panamax (14.2m)
          </button>
          <button
            onClick={() => applyPreset("capesize")}
            className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:text-sky-800 transition-colors cursor-pointer"
          >
            Capesize (17.5m)
          </button>
          <button
            onClick={() => applyPreset("newcastlemax")}
            className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs hover:text-sky-800 transition-colors cursor-pointer"
          >
            Newcastlemax (18.5m)
          </button>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid gap-4 sm:grid-cols-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
        {/* Vessel Draft Slider */}
        <div>
          <div className="flex justify-between text-[12px] font-bold text-slate-800 mb-1">
            <span className="flex items-center gap-1">
              <Sliders size={12} className="text-sky-600" />
              <span>Arrival Draft:</span>
            </span>
            <span className="font-mono text-[14px] text-sky-800">{testDraft.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="8.0"
            max="19.5"
            step="0.1"
            value={testDraft}
            onChange={(e) => setTestDraft(parseFloat(e.target.value))}
            className="w-full cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>8.0m (Handy)</span>
            <span>14.5m (Panamax)</span>
            <span>19.5m (VLOC)</span>
          </div>
        </div>

        {/* Vessel DWT Slider */}
        <div>
          <div className="flex justify-between text-[12px] font-bold text-slate-800 mb-1">
            <span>Parcel DWT:</span>
            <span className="font-mono text-[14px] text-sky-800">{testDwt.toLocaleString()} t</span>
          </div>
          <input
            type="range"
            min="30000"
            max="220000"
            step="5000"
            value={testDwt}
            onChange={(e) => setTestDwt(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>30k t</span>
            <span>100k t</span>
            <span>220k t</span>
          </div>
        </div>

        {/* Vessel LOA Slider */}
        <div>
          <div className="flex justify-between text-[12px] font-bold text-slate-800 mb-1">
            <span>Length Overall (LOA):</span>
            <span className="font-mono text-[14px] text-sky-800">{testLoa} m</span>
          </div>
          <input
            type="range"
            min="140"
            max="330"
            step="5"
            value={testLoa}
            onChange={(e) => setTestLoa(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>140m</span>
            <span>225m</span>
            <span>330m</span>
          </div>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {EAST_COAST_PORT_SPECS.map((p) => {
          const draftDiff = p.maxDraft - testDraft;
          const dwtExceeded = testDwt > p.maxDwt;
          const loaExceeded = testLoa > p.maxLoa;

          let status: "SAFE" | "TIDAL_WINDOW" | "GROUNDING_RISK";
          let badgeTone: "emerald" | "amber" | "rose";
          let badgeText: string;

          if (draftDiff >= 0.5 && !dwtExceeded && !loaExceeded) {
            status = "SAFE";
            badgeTone = "emerald";
            badgeText = `FULL ACCEPTANCE (+${draftDiff.toFixed(1)}m UKC)`;
          } else if (draftDiff >= -0.2 && !dwtExceeded) {
            status = "TIDAL_WINDOW";
            badgeTone = "amber";
            badgeText = `HIGH TIDE WINDOW (${draftDiff >= 0 ? "+" : ""}${draftDiff.toFixed(1)}m)`;
          } else {
            status = "GROUNDING_RISK";
            badgeTone = "rose";
            badgeText = dwtExceeded
              ? `DWT EXCEEDED (Max ${p.maxDwt / 1000}k t)`
              : `DRAFT EXCEEDED (${draftDiff.toFixed(1)}m shortage)`;
          }

          return (
            <div
              key={p.key}
              className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                status === "SAFE"
                  ? "border-emerald-300 bg-emerald-50/30 hover:border-emerald-400 hover:shadow-xs"
                  : status === "TIDAL_WINDOW"
                  ? "border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:shadow-xs"
                  : "border-rose-200 bg-rose-50/20 opacity-80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h4 className="font-bold text-[13px] text-slate-900">{p.name}</h4>
                    <span className="text-[10px] text-slate-500">{p.state}</span>
                  </div>
                  {status === "SAFE" ? (
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : status === "TIDAL_WINDOW" ? (
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  )}
                </div>

                {/* Compatibility Badge */}
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[9px] font-mono font-bold ${
                      badgeTone === "emerald"
                        ? "bg-emerald-100 text-emerald-900"
                        : badgeTone === "amber"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-rose-100 text-rose-900"
                    }`}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* Port Specs */}
                <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Permissible Draft:</span>
                    <strong className="text-slate-900">{p.maxDraft} m</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Channel Depth:</span>
                    <span>{p.channelDepth} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max DWT:</span>
                    <span>{p.maxDwt.toLocaleString()} t</span>
                  </div>
                </div>

                <p className="mt-2 text-[10px] text-slate-500 line-clamp-2">
                  {p.berthCargo}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleSelectPort(p.key)}
                  className={`w-full flex items-center justify-center gap-1 rounded-xl py-1.5 px-2 text-[11px] font-bold cursor-pointer transition-colors ${
                    status === "SAFE"
                      ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                      : status === "TIDAL_WINDOW"
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  <span>Select in Decision Center</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
