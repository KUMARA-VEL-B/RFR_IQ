import { useState, useEffect } from "react";
import { Radio, ShieldCheck, ChevronRight, ChevronLeft, Pause, Play, Ship, Waves, DollarSign } from "lucide-react";
import { useCurrency } from "../state/currency";

export interface DispatchMessage {
  id: string;
  timeUtc: string;
  category: "WEATHER" | "PORT" | "VESSEL" | "MARKET" | "SYSTEM";
  title: string;
  detail: string;
  severity: "info" | "success" | "warning";
}

const INITIAL_DISPATCHES: DispatchMessage[] = [
  {
    id: "d-1",
    timeUtc: "10:28:14",
    category: "PORT",
    title: "Paradip Port Draft Advisory",
    detail: "Main Channel permissible draft confirmed at 14.50m for upcoming high-water window.",
    severity: "success",
  },
  {
    id: "d-2",
    timeUtc: "10:26:02",
    category: "WEATHER",
    title: "Bay of Bengal Marine Observation",
    detail: "Open-Meteo telemetry reports significant wave height at 1.3m near Visakhapatnam Outer Anchorage.",
    severity: "info",
  },
  {
    id: "d-3",
    timeUtc: "10:22:45",
    category: "VESSEL",
    title: "Capesize MV Bharat Pioneer En Route",
    detail: "Passed Malacca Strait waypoint · Speed 12.8 kn · ETA Paradip 2.8 days · Draft 14.1m.",
    severity: "info",
  },
  {
    id: "d-4",
    timeUtc: "10:19:10",
    category: "MARKET",
    title: "Forex Benchmark Dynamic Sync",
    detail: "Live reference USD/INR stabilized with European Central Bank open feed.",
    severity: "success",
  },
  {
    id: "d-5",
    timeUtc: "10:15:30",
    category: "PORT",
    title: "Dhamra Port Pilotage Update",
    detail: "Deep draft berths 1 & 2 operational with smooth swell (< 0.9m) and tug assistance standing by.",
    severity: "success",
  },
  {
    id: "d-6",
    timeUtc: "10:10:00",
    category: "WEATHER",
    title: "Gopalpur Swell Monitoring",
    detail: "Wave period 8.4s recorded with moderate coastal winds (18 km/h). Safe roadstead lighterage.",
    severity: "info",
  },
];

export function MaritimeTicker() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dispatches, setDispatches] = useState<DispatchMessage[]>(INITIAL_DISPATCHES);
  const [showLogModal, setShowLogModal] = useState(false);
  const { currency, usdToInrRate } = useCurrency();

  // Dual Chronometer (UTC and IST)
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format UTC and IST
  const utcHours = String(now.getUTCHours()).padStart(2, "0");
  const utcMins = String(now.getUTCMinutes()).padStart(2, "0");
  const utcSecs = String(now.getUTCSeconds()).padStart(2, "0");
  const utcFormatted = `${utcHours}:${utcMins}:${utcSecs} Z`;

  const istFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const istFormatted = `${istFormatter.format(now)} IST`;

  // Auto-rotate ticker
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dispatches.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [paused, dispatches.length]);

  const current = dispatches[index] || dispatches[0];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % dispatches.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + dispatches.length) % dispatches.length);
  };

  const addSimulatedBroadcast = () => {
    const newMsg: DispatchMessage = {
      id: `d-${Date.now()}`,
      timeUtc: `${utcHours}:${utcMins}:${utcSecs}`,
      category: "VESSEL",
      title: "Tactical AIS Corridor Signal",
      detail: `Simulated bulk carrier telemetry updated. Rate benchmark: 1 USD = ₹${usdToInrRate.toFixed(2)}.`,
      severity: "success",
    };
    setDispatches([newMsg, ...dispatches]);
    setIndex(0);
  };

  const categoryIcon = {
    WEATHER: <Waves size={12} className="text-sky-600" />,
    PORT: <ShieldCheck size={12} className="text-emerald-600" />,
    VESSEL: <Ship size={12} className="text-amber-600" />,
    MARKET: <DollarSign size={12} className="text-emerald-600" />,
    SYSTEM: <Radio size={12} className="text-purple-600" />,
  }[current.category];

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200/90 bg-slate-900 text-slate-200 px-3 sm:px-6 py-1.5 text-[11px] gap-2">
        {/* Left: Dual Maritime Chronometers */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400 tracking-wider">LIVE TELEMETRY</span>
          </div>

          <span className="text-slate-600">|</span>

          {/* UTC (ZULU) Time */}
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-300" title="Coordinated Universal Time (Maritime Standard)">
            <span className="text-slate-500">UTC:</span>
            <span className="font-bold text-white bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">{utcFormatted}</span>
          </div>

          {/* Indian Standard Time (IST) */}
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-300" title="Indian Standard Time (East Coast Port Reference)">
            <span className="text-slate-500">IST:</span>
            <span className="font-bold text-amber-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">{istFormatted}</span>
          </div>
        </div>

        {/* Center: Live Operational Broadcast Feed */}
        <div className="flex items-center gap-2 min-w-0 flex-1 sm:max-w-[55%]">
          <div
            className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700/70 transition-colors"
            onClick={() => setShowLogModal(true)}
            title="Click to view full operational dispatch log"
          >
            <span className="shrink-0">{categoryIcon}</span>
            <span className="font-mono text-[10px] font-bold text-sky-400 shrink-0">
              [{current.category}]
            </span>
            <span className="truncate text-slate-200 font-medium">
              <strong className="text-white font-semibold">{current.title}:</strong> {current.detail}
            </span>
          </div>

          {/* Controls: Prev / Pause / Next */}
          <div className="flex items-center gap-0.5 shrink-0 text-slate-400">
            <button
              onClick={handlePrev}
              className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer transition-colors"
              title="Previous dispatch"
              aria-label="Previous dispatch"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setPaused(!paused)}
              className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer transition-colors"
              title={paused ? "Resume ticker" : "Pause ticker"}
              aria-label={paused ? "Resume ticker" : "Pause ticker"}
            >
              {paused ? <Play size={11} className="text-emerald-400" /> : <Pause size={11} />}
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer transition-colors"
              title="Next dispatch"
              aria-label="Next dispatch"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Right: Currency Indicator & Dispatch Log Button */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={addSimulatedBroadcast}
            className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline underline-offset-2 cursor-pointer transition-colors"
            title="Inject simulated operational event into stream"
          >
            + Simulate Signal
          </button>
          <span className="text-slate-600">·</span>
          <button
            onClick={() => setShowLogModal(true)}
            className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
          >
            Dispatch Log ({dispatches.length})
          </button>
        </div>
      </div>

      {/* Dispatch Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-sky-600" />
                <h3 className="font-serif text-[16px] font-bold text-slate-900">
                  Maritime Operational Dispatch Feed
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {dispatches.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-sky-800 uppercase">
                      [{d.category}] {d.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{d.timeUtc} UTC</span>
                  </div>
                  <p className="mt-1 text-[12px] text-slate-700 leading-snug">{d.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
              <span>Display currency: <strong>{currency}</strong> (1 USD = ₹{usdToInrRate.toFixed(2)})</span>
              <button
                onClick={() => setShowLogModal(false)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
