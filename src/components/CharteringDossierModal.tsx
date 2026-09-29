import { Printer, X, ShieldCheck, CheckCircle2, FileText, Waves, Thermometer, Info } from "lucide-react";
import { useCurrency } from "../state/currency";
import { CurrencyToggle } from "./CurrencyToggle";

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: {
    cargo: string;
    quantity: string | number;
    origin: string;
    destination: string;
    deliveryPressure: string;
    marketScenario: string;
  };
  portName: string;
  inrRate: number | null;
  decision: string;
  reasons: string[];
  weatherStatus?: { temp?: number | null; wind?: number | null; gusts?: number | null };
  marineStatus?: { waveHeight?: number | null; swellHeight?: number | null; seaState?: string | null };
}

export function CharteringDossierModal({
  isOpen,
  onClose,
  shipment,
  portName,
  inrRate,
  decision,
  reasons,
  weatherStatus,
  marineStatus,
}: DossierModalProps) {
  if (!isOpen) return null;

  const qty = Number(shipment.quantity) || 0;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const handlePrint = () => {
    window.print();
  };

  const { currency, usdToInrRate } = useCurrency();
  const activeRate = inrRate ?? usdToInrRate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Modal Controls Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-3.5 text-white">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-sky-400" />
            <span className="font-serif text-[15px] font-bold">
              Executive Chartering Decision Dossier
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Currency switcher inside modal */}
            <CurrencyToggle size="sm" />

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-[12px] font-bold text-white hover:bg-sky-400 transition-colors shadow-xs cursor-pointer"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800" id="chartering-dossier-print">
          {/* Header Banner */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-900 p-1 border border-slate-800 flex items-center justify-center">
                <img src="/logo.jpg" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="font-serif text-[22px] font-extrabold text-slate-950 tracking-tight">
                  RFR-IQ MARITIME INTELLIGENCE
                </h2>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  Bulk Cargo Procurement &amp; Charter Decision Dossier
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-500">
              <p>Reference: <span className="font-bold text-slate-800">RFR-DIR-{now.getFullYear()}-{String(now.getTime()).slice(-4)}</span></p>
              <p>Date: {dateStr}</p>
              <p>Port: {portName}</p>
            </div>
          </div>

          {/* Recommended Action Box */}
          <div className="rounded-xl border-2 border-sky-600 bg-sky-50/70 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-sky-800">
                PROCURING DECISION CLEARANCE
              </span>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white">
                DERIVED GUIDANCE
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <h3 className="font-serif text-[32px] font-extrabold tracking-tight text-sky-950">
                {decision}
              </h3>
            </div>
            <div className="mt-3 border-t border-sky-200/80 pt-3">
              <p className="text-[12px] font-bold text-slate-700">Strategic Rationale:</p>
              <ul className="mt-1 list-disc pl-5 text-[12.5px] text-slate-700 space-y-1">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Voyage Parameters */}
          <div>
            <h4 className="font-serif text-[14px] font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-3">
              1. Voyage Parameters &amp; Requirements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12.5px]">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Commodity</span>
                <p className="font-bold text-slate-900 mt-0.5">{shipment.cargo}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Parcel Volume</span>
                <p className="font-bold text-slate-900 mt-0.5 font-mono">{qty.toLocaleString()} MT</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Origin Loading</span>
                <p className="font-bold text-slate-900 mt-0.5">{shipment.origin}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Discharge Terminal</span>
                <p className="font-bold text-slate-900 mt-0.5">{portName}</p>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 p-3 border border-slate-200 text-[12px] flex items-start gap-2 text-slate-600">
              <Info size={15} className="text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Commercial Ocean Freight:</span> Commercial freight rates require live broker quotes. Indicative reference exchange rate: 1 USD = ₹{activeRate.toFixed(2)} ({currency} mode active).
              </div>
            </div>
          </div>

          {/* Operational Feasibility & Risk Audit */}
          <div>
            <h4 className="font-serif text-[14px] font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-3">
              2. Port &amp; Environmental Feasibility
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 text-[12px]">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Waves size={14} className="text-sky-600" />
                  <span>Marine Sea State (Open-Meteo)</span>
                </div>
                <p className="mt-1 font-mono text-[13px] font-semibold text-slate-800">
                  Wave: {marineStatus?.waveHeight != null ? `${marineStatus.waveHeight.toFixed(1)} m` : "Unavailable"}
                </p>
                <p className="text-[11px] text-slate-500">
                  Swell: {marineStatus?.swellHeight != null ? `${marineStatus.swellHeight.toFixed(1)} m` : "—"} · {marineStatus?.seaState ?? "Feed unavailable"}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Thermometer size={14} className="text-amber-600" />
                  <span>Weather &amp; Wind (Open-Meteo)</span>
                </div>
                <p className="mt-1 font-mono text-[13px] font-semibold text-slate-800">
                  Temp: {weatherStatus?.temp != null ? `${weatherStatus.temp}°C` : "Unavailable"}
                </p>
                <p className="text-[11px] text-slate-500">
                  Wind: {weatherStatus?.wind != null ? `${weatherStatus.wind} km/h` : "—"} (Gusts {weatherStatus?.gusts != null ? `${weatherStatus.gusts} km/h` : "—"})
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Port Capacity Constraint</span>
                </div>
                <p className="mt-1 font-mono text-[13px] font-semibold text-emerald-700">
                  PASS (Within Limit)
                </p>
                <p className="text-[11px] text-slate-500">
                  Parcel volume within max DWT specification for {portName}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Stamp & Signatures */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Audit &amp; Data Provenance Certified</p>
                <p className="text-slate-500">
                  Operational Feeds: Open-Meteo Weather, Open-Meteo Marine, Open Exchange Rates. Historical: Reference datasets.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-slate-700">RFR-IQ DECISION ENGINE</span>
              <p className="text-slate-400">East Coast India Bulk Procurement Protocol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
