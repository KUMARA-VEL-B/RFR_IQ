import { useState } from "react";
import { Fuel, Clock, DollarSign, AlertTriangle, RotateCcw } from "lucide-react";
import { useCurrency } from "../state/currency";
import { useShipment } from "../state/shipment";

interface VoyagePreset {
  name: string;
  desc: string;
  speedKn: number;
  fuelPricePerMt: number;
  dailyHireUsd: number;
  anchorageWaitDays: number;
  demurrageRatePerDay: number;
  weatherDelayDays: number;
}

const PRESETS: Record<string, VoyagePreset> = {
  baseline: {
    name: "Baseline Fair Weather",
    desc: "Standard passage through Malacca Strait with immediate pilotage upon arrival.",
    speedKn: 13.0,
    fuelPricePerMt: 620,
    dailyHireUsd: 16500,
    anchorageWaitDays: 1.5,
    demurrageRatePerDay: 20000,
    weatherDelayDays: 0,
  },
  monsoon: {
    name: "Monsoon Swell Delay",
    desc: "Severe ocean swell (>2.8m) causing slow steaming and delayed roadstead discharge.",
    speedKn: 10.2,
    fuelPricePerMt: 640,
    dailyHireUsd: 16500,
    anchorageWaitDays: 4.0,
    demurrageRatePerDay: 22000,
    weatherDelayDays: 2.5,
  },
  congestion: {
    name: "Outer Anchorage Crisis",
    desc: "Severe East Coast coal berth congestion resulting in 6+ days outer anchorage queue.",
    speedKn: 13.0,
    fuelPricePerMt: 620,
    dailyHireUsd: 16500,
    anchorageWaitDays: 6.5,
    demurrageRatePerDay: 28000,
    weatherDelayDays: 0,
  },
  fuelSurge: {
    name: "Bunker Price Surge",
    desc: "Global crude volatility spiking Singapore VLSFO bunker benchmark to $780/MT.",
    speedKn: 11.5,
    fuelPricePerMt: 780,
    dailyHireUsd: 17000,
    anchorageWaitDays: 1.5,
    demurrageRatePerDay: 20000,
    weatherDelayDays: 0,
  },
};

export function VoyageCostSimulator() {
  const { s } = useShipment();
  const { currency, formatCurrency, usdToInrRate } = useCurrency();

  const cargoQuantity = Number(s.quantity) > 0 ? Number(s.quantity) : 75000;
  const cargoName = s.cargo || "Coking Coal";
  const originName = s.origin || "Gladstone, Australia";
  const destName = s.destination ? s.destination.toUpperCase() : "VISAKHAPATNAM";

  // Voyage distance in nautical miles (approx 4,200 NM for Aus -> East Coast)
  const voyageDistanceNm = 4200;

  // Simulator parameters
  const [speedKn, setSpeedKn] = useState<number>(13.0);
  const [fuelPrice, setFuelPrice] = useState<number>(620);
  const [dailyHire, setDailyHire] = useState<number>(16500);
  const [waitDays, setWaitDays] = useState<number>(2.0);
  const [demurrageRate, setDemurrageRate] = useState<number>(20000);
  const [weatherExtraDays, setWeatherExtraDays] = useState<number>(0);
  const [voyageProgressDay, setVoyageProgressDay] = useState<number>(8); // timeline scrub

  // Calculated values
  const seaDays = voyageDistanceNm / (speedKn * 24) + weatherExtraDays;
  const totalVoyageDays = seaDays + waitDays;

  // Fuel consumption: ~26 MT/day at 13 knots (cubic law approximation)
  const dailyFuelBurn = 26 * Math.pow(speedKn / 13.0, 2.5);
  const totalFuelMt = dailyFuelBurn * seaDays;
  const totalBunkerCostUsd = totalFuelMt * fuelPrice;

  // Charter hire cost
  const totalHireCostUsd = dailyHire * seaDays;

  // Port disbursements & tugs (indicative benchmark ~ $45,000)
  const portDisbursementsUsd = 45000;

  // Demurrage exposure (anchorage wait days beyond 1.5 free laytime days)
  const billableDemurrageDays = Math.max(0, waitDays - 1.5);
  const totalDemurrageCostUsd = billableDemurrageDays * demurrageRate;

  // Total Landed Freight Cost
  const totalLandedCostUsd =
    totalBunkerCostUsd + totalHireCostUsd + portDisbursementsUsd + totalDemurrageCostUsd;
  const costPerTonUsd = totalLandedCostUsd / cargoQuantity;

  const applyPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setSpeedKn(p.speedKn);
    setFuelPrice(p.fuelPricePerMt);
    setDailyHire(p.dailyHireUsd);
    setWaitDays(p.anchorageWaitDays);
    setDemurrageRate(p.demurrageRatePerDay);
    setWeatherExtraDays(p.weatherDelayDays);
  };

  const resetToStandard = () => {
    applyPreset("baseline");
  };

  const progressPercentage = Math.min(100, Math.round((voyageProgressDay / totalVoyageDays) * 100));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[17px] font-bold text-slate-900">
              Interactive Voyage Financial &amp; Demurrage Simulator
            </h3>
            <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800">
              REAL-TIME SENSITIVITY
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Model total landed freight exposure for {cargoQuantity.toLocaleString()} t {cargoName} across bunker fluctuations, sea weather drag, and outer anchorage queues.
          </p>
        </div>

        {/* Currency badge */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded-xl">
          <span className="text-slate-500">Active Currency:</span>
          <strong className="text-slate-900 font-bold">{currency}</strong>
          <span className="text-slate-400">($1 = ₹{usdToInrRate.toFixed(2)})</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono font-bold text-slate-500">Scenario Presets:</span>
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:text-sky-900 transition-all cursor-pointer shadow-2xs"
          >
            {p.name}
          </button>
        ))}
        <button
          onClick={resetToStandard}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 ml-auto cursor-pointer"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Voyage Scrubber Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>VOYAGE SIMULATION TIMELINE</span>
          </div>
          <span>
            Day {voyageProgressDay.toFixed(1)} of {totalVoyageDays.toFixed(1)} Days ({progressPercentage}%)
          </span>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max={totalVoyageDays}
          step="0.5"
          value={voyageProgressDay}
          onChange={(e) => setVoyageProgressDay(parseFloat(e.target.value))}
          className="w-full accent-sky-400 cursor-pointer"
        />

        {/* Voyage route waypoints */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
          <span className="text-white font-bold">{originName}</span>
          <span className="text-sky-400">Malacca Strait (~Day 7)</span>
          <span className="text-amber-300">Bay of Bengal Approach</span>
          <span className="text-emerald-400 font-bold">{destName} Port</span>
        </div>
      </div>

      {/* Interactive Controls & Sensitivity Sliders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        {/* Speed Slider */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Passage Speed</span>
            <span className="font-mono text-sky-800">{speedKn.toFixed(1)} kn</span>
          </div>
          <input
            type="range"
            min="9.0"
            max="15.0"
            step="0.1"
            value={speedKn}
            onChange={(e) => setSpeedKn(parseFloat(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>Eco (10 kn)</span>
            <span>Design (13 kn)</span>
            <span>Full (15 kn)</span>
          </div>
        </div>

        {/* Bunker Price Slider */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>VLSFO Bunker Price</span>
            <span className="font-mono text-sky-800">
              {formatCurrency(fuelPrice, { suffix: "/MT" })}
            </span>
          </div>
          <input
            type="range"
            min="450"
            max="900"
            step="10"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(parseInt(e.target.value, 10))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>$450/MT</span>
            <span>$650/MT</span>
            <span>$900/MT</span>
          </div>
        </div>

        {/* Time Charter Daily Hire */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Vessel Daily Hire</span>
            <span className="font-mono text-sky-800">
              {formatCurrency(dailyHire, { suffix: "/day" })}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="35000"
            step="500"
            value={dailyHire}
            onChange={(e) => setDailyHire(parseInt(e.target.value, 10))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>$10k/d (Handy)</span>
            <span>$18k/d (Pana)</span>
            <span>$35k/d (Cape)</span>
          </div>
        </div>

        {/* Anchorage Queue Waiting Days */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Anchorage Queue Delay</span>
            <span className="font-mono text-amber-700">{waitDays.toFixed(1)} days</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={waitDays}
            onChange={(e) => setWaitDays(parseFloat(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0 days (Direct)</span>
            <span>3 days (Normal)</span>
            <span>12 days (Congested)</span>
          </div>
        </div>

        {/* Demurrage Rate */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Demurrage Penalty Rate</span>
            <span className="font-mono text-amber-700">
              {formatCurrency(demurrageRate, { suffix: "/day" })}
            </span>
          </div>
          <input
            type="range"
            min="12000"
            max="40000"
            step="1000"
            value={demurrageRate}
            onChange={(e) => setDemurrageRate(parseInt(e.target.value, 10))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>$12,000</span>
            <span>$24,000</span>
            <span>$40,000</span>
          </div>
        </div>

        {/* Weather Extra Days */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Weather Reroute Slowdown</span>
            <span className="font-mono text-sky-800">+{weatherExtraDays.toFixed(1)} days</span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={weatherExtraDays}
            onChange={(e) => setWeatherExtraDays(parseFloat(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>0d (Calm)</span>
            <span>2.5d (Monsoon)</span>
            <span>6d (Cyclone)</span>
          </div>
        </div>
      </div>

      {/* Real-Time Calculated Financial Outputs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bunker Fuel Exposure */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Fuel size={13} className="text-sky-600" />
            <span>VLSFO Bunker Fuel</span>
          </div>
          <p className="mt-1 font-mono text-[18px] font-extrabold text-slate-900">
            {formatCurrency(totalBunkerCostUsd)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {totalFuelMt.toFixed(0)} MT total burn ({dailyFuelBurn.toFixed(1)} MT/d)
          </p>
        </div>

        {/* Time Charter Hire */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Clock size={13} className="text-sky-600" />
            <span>Vessel Hire Cost</span>
          </div>
          <p className="mt-1 font-mono text-[18px] font-extrabold text-slate-900">
            {formatCurrency(totalHireCostUsd)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {seaDays.toFixed(1)} sea transit days
          </p>
        </div>

        {/* Demurrage Exposure */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            <AlertTriangle size={13} className="text-amber-600" />
            <span>Demurrage Risk</span>
          </div>
          <p className="mt-1 font-mono text-[18px] font-extrabold text-amber-900">
            {formatCurrency(totalDemurrageCostUsd)}
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            {billableDemurrageDays.toFixed(1)} billable delay days
          </p>
        </div>

        {/* Total Landed Cost Per Ton */}
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            <DollarSign size={13} className="text-emerald-700" />
            <span>Landed Cost Per Ton</span>
          </div>
          <p className="mt-1 font-mono text-[22px] font-black text-emerald-900">
            {formatCurrency(costPerTonUsd, { decimals: 2, suffix: "/MT" })}
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5 font-semibold">
            Total Voyage: {formatCurrency(totalLandedCostUsd, { compact: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
