import { useState, useEffect, useMemo } from "react";
import {
  Ship,
  Compass,
  Gauge,
  Navigation,
  Anchor,
  Play,
  Pause,
  FastForward,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Search,
} from "lucide-react";
import { useCurrency } from "../state/currency";
import { useShipment } from "../state/shipment";
import type { PageKey } from "./Layout";

export interface SimulatedVessel {
  id: string;
  name: string;
  imo: string;
  flag: string;
  vesselClass: "Capesize" | "Kamsarmax" | "Panamax" | "Supramax" | "Ultramax";
  dwt: number;
  loaM: number;
  draftM: number;
  cargo: string;
  quantityT: number;
  origin: string;
  destinationPortKey: string;
  destinationPortName: string;
  // Canvas coordinate percentage (0-100)
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  progressPct: number; // 0 - 100
  baseSpeedKn: number;
  currentSpeedKn: number;
  headingDeg: number;
  dailyHireUsd: number;
  dailyFuelBurnMt: number;
  distanceRemainingNm: number;
  etaHours: number;
  status: "UNDERWAY" | "ANCHORED" | "MANEUVERING" | "WEATHER_SLOWDOWN";
  seaCondition: string;
}

const INITIAL_VESSELS: SimulatedVessel[] = [
  {
    id: "v-01",
    name: "MV Bharat Pioneer",
    imo: "IMO 9742110",
    flag: "🇮🇳 India",
    vesselClass: "Capesize",
    dwt: 181200,
    loaM: 292,
    draftM: 17.8,
    cargo: "Coking Coal",
    quantityT: 165000,
    origin: "Port Hedland, Australia",
    destinationPortKey: "paradip",
    destinationPortName: "Paradip Port",
    startX: 88,
    startY: 85,
    targetX: 62,
    targetY: 34,
    currentX: 74,
    currentY: 56,
    progressPct: 58,
    baseSpeedKn: 13.2,
    currentSpeedKn: 12.8,
    headingDeg: 312,
    dailyHireUsd: 26500,
    dailyFuelBurnMt: 38.5,
    distanceRemainingNm: 1240,
    etaHours: 96.8,
    status: "UNDERWAY",
    seaCondition: "Wave 1.4m · Swell 1.1m (Smooth)",
  },
  {
    id: "v-02",
    name: "MV Gangavaram Star",
    imo: "IMO 9823445",
    flag: "🇱🇷 Liberia",
    vesselClass: "Capesize",
    dwt: 207500,
    loaM: 300,
    draftM: 18.3,
    cargo: "Iron Ore",
    quantityT: 195000,
    origin: "Tubarao, Brazil",
    destinationPortKey: "gangavaram",
    destinationPortName: "Gangavaram Port",
    startX: 15,
    startY: 92,
    targetX: 54,
    targetY: 53,
    currentX: 38,
    currentY: 69,
    progressPct: 62,
    baseSpeedKn: 12.4,
    currentSpeedKn: 11.9,
    headingDeg: 42,
    dailyHireUsd: 29800,
    dailyFuelBurnMt: 42.0,
    distanceRemainingNm: 1820,
    etaHours: 152.9,
    status: "UNDERWAY",
    seaCondition: "Wave 1.8m · Swell 1.6m (Moderate)",
  },
  {
    id: "v-03",
    name: "MV Coromandel Pride",
    imo: "IMO 9687120",
    flag: "🇵🇦 Panama",
    vesselClass: "Kamsarmax",
    dwt: 82500,
    loaM: 229,
    draftM: 14.4,
    cargo: "Steam Coal",
    quantityT: 76000,
    origin: "Richards Bay, South Africa",
    destinationPortKey: "visakhapatnam",
    destinationPortName: "Visakhapatnam Port",
    startX: 20,
    startY: 85,
    targetX: 56,
    targetY: 48,
    currentX: 47,
    currentY: 58,
    progressPct: 74,
    baseSpeedKn: 13.5,
    currentSpeedKn: 13.1,
    headingDeg: 38,
    dailyHireUsd: 15400,
    dailyFuelBurnMt: 24.2,
    distanceRemainingNm: 680,
    etaHours: 51.9,
    status: "UNDERWAY",
    seaCondition: "Wave 1.2m · Swell 0.9m (Safe)",
  },
  {
    id: "v-04",
    name: "MV Dhamra Explorer",
    imo: "IMO 9718840",
    flag: "🇲🇭 Marshall Islands",
    vesselClass: "Panamax",
    dwt: 76000,
    loaM: 225,
    draftM: 13.9,
    cargo: "Coking Coal",
    quantityT: 71000,
    origin: "Gladstone, Australia",
    destinationPortKey: "dhamra",
    destinationPortName: "Dhamra Port",
    startX: 90,
    startY: 82,
    targetX: 64,
    targetY: 28,
    currentX: 68,
    currentY: 44,
    progressPct: 82,
    baseSpeedKn: 12.8,
    currentSpeedKn: 12.5,
    headingDeg: 334,
    dailyHireUsd: 14800,
    dailyFuelBurnMt: 23.5,
    distanceRemainingNm: 410,
    etaHours: 32.8,
    status: "UNDERWAY",
    seaCondition: "Wave 1.0m · Swell 0.8m (Safe)",
  },
  {
    id: "v-05",
    name: "MV Kakinada Glory",
    imo: "IMO 9553211",
    flag: "🇮🇳 India",
    vesselClass: "Supramax",
    dwt: 58200,
    loaM: 190,
    draftM: 12.8,
    cargo: "Thermal Coal",
    quantityT: 52000,
    origin: "Paradip (Coastal Movement)",
    destinationPortKey: "chennai",
    destinationPortName: "Chennai Port",
    startX: 62,
    startY: 34,
    targetX: 52,
    targetY: 67,
    currentX: 55,
    currentY: 54,
    progressPct: 65,
    baseSpeedKn: 11.8,
    currentSpeedKn: 11.4,
    headingDeg: 205,
    dailyHireUsd: 11800,
    dailyFuelBurnMt: 19.8,
    distanceRemainingNm: 220,
    etaHours: 19.2,
    status: "UNDERWAY",
    seaCondition: "Wave 1.1m · Swell 0.9m (Safe)",
  },
  {
    id: "v-06",
    name: "MV Indian Ocean Spirit",
    imo: "IMO 9791104",
    flag: "🇸🇬 Singapore",
    vesselClass: "Panamax",
    dwt: 93500,
    loaM: 235,
    draftM: 14.8,
    cargo: "Iron Ore",
    quantityT: 86000,
    origin: "Port Hedland, Australia",
    destinationPortKey: "gopalpur",
    destinationPortName: "Gopalpur Port",
    startX: 88,
    startY: 85,
    targetX: 59,
    targetY: 41,
    currentX: 66,
    currentY: 53,
    progressPct: 71,
    baseSpeedKn: 12.9,
    currentSpeedKn: 12.2,
    headingDeg: 320,
    dailyHireUsd: 16200,
    dailyFuelBurnMt: 25.5,
    distanceRemainingNm: 590,
    etaHours: 48.3,
    status: "UNDERWAY",
    seaCondition: "Wave 1.3m · Swell 1.0m (Safe)",
  },
  {
    id: "v-07",
    name: "MV Bengal Titan",
    imo: "IMO 9642019",
    flag: "🇲🇹 Malta",
    vesselClass: "Capesize",
    dwt: 178000,
    loaM: 289,
    draftM: 17.5,
    cargo: "Coking Coal",
    quantityT: 160000,
    origin: "Hay Point, Australia",
    destinationPortKey: "kolkata_haldia",
    destinationPortName: "Haldia Sandheads Outer Anchorage",
    startX: 88,
    startY: 85,
    targetX: 67,
    targetY: 22,
    currentX: 71,
    currentY: 36,
    progressPct: 86,
    baseSpeedKn: 12.0,
    currentSpeedKn: 10.8,
    headingDeg: 345,
    dailyHireUsd: 25900,
    dailyFuelBurnMt: 37.0,
    distanceRemainingNm: 280,
    etaHours: 25.9,
    status: "MANEUVERING",
    seaCondition: "Wave 1.5m · Swell 1.3m (River Approach)",
  },
  {
    id: "v-08",
    name: "MV Deccan Voyager",
    imo: "IMO 9811200",
    flag: "🇨🇾 Cyprus",
    vesselClass: "Ultramax",
    dwt: 63500,
    loaM: 199,
    draftM: 13.3,
    cargo: "Bauxite / Bulk",
    quantityT: 58000,
    origin: "Bintan, Indonesia",
    destinationPortKey: "krishnapatnam",
    destinationPortName: "Krishnapatnam Port",
    startX: 82,
    startY: 78,
    targetX: 52,
    targetY: 62,
    currentX: 61,
    currentY: 68,
    progressPct: 69,
    baseSpeedKn: 13.8,
    currentSpeedKn: 13.4,
    headingDeg: 295,
    dailyHireUsd: 13200,
    dailyFuelBurnMt: 21.0,
    distanceRemainingNm: 360,
    etaHours: 26.8,
    status: "UNDERWAY",
    seaCondition: "Wave 1.0m · Swell 0.7m (Safe)",
  },
];

// Major East Coast Ports on the SVG Radar Map coordinate system (0-100)
const RADAR_PORTS = [
  { key: "kolkata_haldia", name: "Haldia", x: 67, y: 22, draft: "8.5m" },
  { key: "dhamra", name: "Dhamra", x: 64, y: 28, draft: "18.0m" },
  { key: "paradip", name: "Paradip", x: 62, y: 34, draft: "14.5m" },
  { key: "gopalpur", name: "Gopalpur", x: 59, y: 41, draft: "13.0m" },
  { key: "visakhapatnam", name: "Visakhapatnam", x: 56, y: 48, draft: "14.5m" },
  { key: "gangavaram", name: "Gangavaram", x: 54, y: 53, draft: "18.5m" },
  { key: "krishnapatnam", name: "Krishnapatnam", x: 52, y: 62, draft: "18.0m" },
  { key: "chennai", name: "Chennai", x: 52, y: 67, draft: "15.5m" },
  { key: "voc_tuticorin", name: "Tuticorin", x: 48, y: 78, draft: "12.8m" },
];

export function FleetRadarSimulation({ go }: { go: (p: PageKey) => void }) {
  const [vessels, setVessels] = useState<SimulatedVessel[]>(INITIAL_VESSELS);
  const [selectedVesselId, setSelectedVesselId] = useState<string>("v-01");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 5 | 15>(1);
  const [classFilter, setClassFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [swellEventActive, setSwellEventActive] = useState<boolean>(false);
  const [radarAngle, setRadarAngle] = useState(0);

  const { currency, formatCurrency, usdToInrRate } = useCurrency();
  const { set: setShipment } = useShipment();

  // Radar sweep animation
  useEffect(() => {
    let animId: number;
    const sweep = () => {
      setRadarAngle((prev) => (prev + 1.2) % 360);
      animId = requestAnimationFrame(sweep);
    };
    animId = requestAnimationFrame(sweep);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Vessel movement simulation tick
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVessels((prevVessels) =>
        prevVessels.map((v) => {
          // Adjust speed if swell event is active in Bay of Bengal
          const isBayOfBengal = v.currentY < 65 && v.currentX > 45;
          const speedMod = swellEventActive && isBayOfBengal ? 0.75 : 1.0;
          const activeSpeed = v.baseSpeedKn * speedMod;

          // Increment progress based on speed and multiplier
          // 1 knot ≈ tiny delta per second
          const stepDelta = (activeSpeed * 0.0035 * speedMultiplier);
          const nextProgress = Math.min(99.5, v.progressPct + stepDelta);

          // Interpolate coordinate
          const t = nextProgress / 100;
          const nextX = v.startX + (v.targetX - v.startX) * t;
          const nextY = v.startY + (v.targetY - v.startY) * t;

          // Decrement distance remaining and ETA
          const remainingDist = Math.max(10, v.distanceRemainingNm - (activeSpeed * 0.02 * speedMultiplier));
          const nextEta = remainingDist / activeSpeed;

          return {
            ...v,
            progressPct: nextProgress,
            currentX: nextX,
            currentY: nextY,
            currentSpeedKn: Number(activeSpeed.toFixed(1)),
            distanceRemainingNm: Math.round(remainingDist),
            etaHours: Number(nextEta.toFixed(1)),
            status: swellEventActive && isBayOfBengal ? "WEATHER_SLOWDOWN" : v.status,
            seaCondition: swellEventActive && isBayOfBengal
              ? "High Swell 2.9m · Wind 38 km/h (Weather Advisory)"
              : v.seaCondition,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, swellEventActive]);

  // Selected vessel
  const selectedVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];

  // Filtered vessels
  const filteredVessels = useMemo(() => {
    return vessels.filter((v) => {
      const matchClass = classFilter === "ALL" || v.vesselClass.toUpperCase().includes(classFilter);
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.destinationPortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.origin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [vessels, classFilter, searchQuery]);

  // Handle loading into Decision Engine
  const handleLoadIntoDecision = (v: SimulatedVessel) => {
    setShipment({
      cargo: v.cargo,
      quantity: String(v.quantityT),
      origin: v.origin,
      destination: v.destinationPortKey,
    });
    go("decision");
  };

  const toggleSwellAlert = () => {
    setSwellEventActive((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Truthful Provenance Disclosure */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 shadow-2xs gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
            <Compass size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-sky-950">
                Tactical Indian Ocean & East Coast Fleet Radar
              </h3>
              <span className="rounded bg-sky-200/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-sky-900">
                TACTICAL SIMULATION MODE
              </span>
            </div>
            <p className="text-[11px] text-sky-800">
              Simulating 8 dry bulk carriers en route to East Coast ports. Real-time encrypted AIS requires coastal port authority clearance.
            </p>
          </div>
        </div>

        {/* Playback & Multiplier Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center rounded-xl border border-slate-300 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-all ${
                isPlaying ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-800"
              }`}
              title={isPlaying ? "Pause Fleet Simulation" : "Resume Fleet Simulation"}
            >
              {isPlaying ? <Pause size={11} /> : <Play size={11} />}
              <span>{isPlaying ? "Simulating" : "Paused"}</span>
            </button>

            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-1 text-[11px] font-mono font-bold cursor-pointer rounded-md ${
                speedMultiplier === 1 ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
              title="1x Real-time simulation rate"
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMultiplier(5)}
              className={`px-2 py-1 text-[11px] font-mono font-bold cursor-pointer rounded-md ${
                speedMultiplier === 5 ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
              title="5x Accelerated voyage rate"
            >
              5x
            </button>
            <button
              onClick={() => setSpeedMultiplier(15)}
              className={`flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-bold cursor-pointer rounded-md ${
                speedMultiplier === 15 ? "bg-sky-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
              title="15x Fast-forward rate"
            >
              <FastForward size={10} />
              <span>15x</span>
            </button>
          </div>

          {/* Swell Event Trigger Button */}
          <button
            onClick={toggleSwellAlert}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-all shadow-2xs ${
              swellEventActive
                ? "border-amber-500 bg-amber-500 text-white animate-pulse"
                : "border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:text-amber-800"
            }`}
            title="Simulate sudden monsoon swell slowdown across Bay of Bengal"
          >
            <AlertTriangle size={12} />
            <span>{swellEventActive ? "Swell Alert ACTIVE" : "Simulate Swell"}</span>
          </button>
        </div>
      </div>

      {/* Main Tactical Grid: Radar Canvas on Left, Live Vessel Sheet on Right */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Radar Map Canvas (7 cols on large) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col rounded-3xl border border-slate-200 bg-slate-950 p-4 shadow-xl text-slate-100 relative overflow-hidden">
          {/* Radar Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 z-10">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="font-mono text-[12px] font-black tracking-wider text-sky-400">
                BAY OF BENGAL · INDIAN OCEAN TACTICAL SECTOR
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
              <span>ACTIVE BLIPS: <strong className="text-white">{filteredVessels.length}</strong></span>
              <span>·</span>
              <span>SPEED: <strong className="text-sky-300">{speedMultiplier}x</strong></span>
            </div>
          </div>

          {/* SVG Tactical Radar Display */}
          <div className="relative aspect-[16/11] w-full rounded-2xl bg-gradient-to-b from-[#06101e] to-[#020617] border border-slate-800/80 overflow-hidden select-none">
            <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                {/* Glow Filter */}
                <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Radar Grid Circles */}
              <circle cx="56" cy="48" r="16" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="0.3" strokeDasharray="1 1" />
              <circle cx="56" cy="48" r="32" fill="none" stroke="rgba(56,189,248,0.10)" strokeWidth="0.3" strokeDasharray="1.5 1.5" />
              <circle cx="56" cy="48" r="48" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="0.3" strokeDasharray="2 2" />

              {/* Grid Crosshairs */}
              <line x1="56" y1="0" x2="56" y2="100" stroke="rgba(148,163,184,0.08)" strokeWidth="0.3" />
              <line x1="0" y1="48" x2="100" y2="48" stroke="rgba(148,163,184,0.08)" strokeWidth="0.3" />

              {/* Rotating Radar Sweep Line */}
              <g transform={`rotate(${radarAngle} 56 48)`}>
                <line x1="56" y1="48" x2="56" y2="2" stroke="rgba(56,189,248,0.4)" strokeWidth="0.4" />
                <polygon points="56,48 56,2 66,2" fill="rgba(56,189,248,0.06)" />
              </g>

              {/* India East Coast Coastline Silhouette */}
              <path
                d="M 68 18
                   C 66 22, 64 26, 64 28
                   C 63 32, 62 34, 61 38
                   C 59 41, 57 44, 56 48
                   C 54 52, 53 56, 52 62
                   C 51 67, 50 72, 48 78
                   C 46 84, 43 89, 40 92
                   C 36 90, 32 80, 31 72
                   C 29 60, 28 50, 30 38
                   C 32 25, 38 18, 48 14 Z"
                fill="#0f2438"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth="0.5"
                filter="url(#radar-glow)"
              />

              {/* East Coast Major Shipping Highway Track */}
              <path
                d="M 67 22 L 64 28 L 62 34 L 59 41 L 56 48 L 54 53 L 52 62 L 52 67 L 48 78"
                fill="none"
                stroke="#0284c7"
                strokeWidth="0.4"
                strokeDasharray="1 1"
              />

              {/* Shipping Corridors from Global Origins */}
              {/* Australia Route */}
              <path d="M 88 85 Q 74 65, 62 34" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.4" strokeDasharray="1.5 1" />
              {/* South Africa Route */}
              <path d="M 20 85 Q 40 70, 56 48" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.4" strokeDasharray="1.5 1" />
              {/* Brazil Route */}
              <path d="M 15 92 Q 35 75, 54 53" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.4" strokeDasharray="1.5 1" />

              {/* East Coast Port Terminals */}
              {RADAR_PORTS.map((port) => (
                <g key={port.key} className="cursor-pointer">
                  <circle cx={port.x} cy={port.y} r="0.9" fill="#38bdf8" />
                  <circle cx={port.x} cy={port.y} r="2.0" fill="none" stroke="#38bdf8" strokeWidth="0.2" opacity="0.6" />
                  <text
                    x={port.x - 1.5}
                    y={port.y - 1.2}
                    fontSize="1.9"
                    fill="#94a3b8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    {port.name}
                  </text>
                </g>
              ))}

              {/* Vessel Track Trajectories & Active Blips */}
              {filteredVessels.map((v) => {
                const isSelected = v.id === selectedVessel.id;
                return (
                  <g
                    key={v.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedVesselId(v.id)}
                  >
                    {/* Destination guide vector */}
                    <line
                      x1={v.currentX}
                      y1={v.currentY}
                      x2={v.targetX}
                      y2={v.targetY}
                      stroke={isSelected ? "#38bdf8" : "rgba(148,163,184,0.2)"}
                      strokeWidth={isSelected ? "0.4" : "0.2"}
                      strokeDasharray="1 1"
                    />

                    {/* Outer Pulse Ring if selected */}
                    {isSelected && (
                      <circle
                        cx={v.currentX}
                        cy={v.currentY}
                        r="3.2"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Ship Blip */}
                    <circle
                      cx={v.currentX}
                      cy={v.currentY}
                      r={isSelected ? "1.6" : "1.2"}
                      fill={
                        v.status === "WEATHER_SLOWDOWN"
                          ? "#f59e0b"
                          : isSelected
                          ? "#38bdf8"
                          : "#10b981"
                      }
                      filter="url(#radar-glow)"
                    />

                    {/* Ship Direction Heading Pointer */}
                    <line
                      x1={v.currentX}
                      y1={v.currentY}
                      x2={v.currentX + Math.sin((v.headingDeg * Math.PI) / 180) * 2.8}
                      y2={v.currentY - Math.cos((v.headingDeg * Math.PI) / 180) * 2.8}
                      stroke={isSelected ? "#38bdf8" : "#e2e8f0"}
                      strokeWidth="0.4"
                    />

                    {/* Vessel Callout Tag */}
                    <text
                      x={v.currentX + 2.2}
                      y={v.currentY + 0.8}
                      fontSize="2.1"
                      fill={isSelected ? "#38bdf8" : "#cbd5e1"}
                      fontFamily="monospace"
                      fontWeight={isSelected ? "bold" : "normal"}
                    >
                      {v.name.replace("MV ", "")}
                    </text>
                    <text
                      x={v.currentX + 2.2}
                      y={v.currentY + 2.8}
                      fontSize="1.7"
                      fill="#64748b"
                      fontFamily="monospace"
                    >
                      {v.currentSpeedKn}kn · {v.vesselClass.slice(0, 4)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Radar Legend Overlay */}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-lg p-2 text-[9px] font-mono text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Normal Underway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span>Weather Slowdown</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                <span>Selected Focus</span>
              </div>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 z-10 pt-2 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-1 text-slate-300">
              <SlidersHorizontal size={12} className="text-sky-400" />
              <span>Class Filter:</span>
              {(["ALL", "CAPESIZE", "PANAMAX", "SUPRAMAX"] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setClassFilter(cls)}
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer transition-colors ${
                    classFilter === cls
                      ? "bg-sky-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Vessel Search */}
            <div className="relative">
              <Search size={11} className="absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vessel or cargo…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg bg-slate-800/80 border border-slate-700 pl-6 pr-2 py-1 text-[11px] text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Selected Vessel Telemetry & Action Drawer (5 cols on large) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-3">
          {/* Active Vessel Inspector Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-[18px] font-extrabold text-slate-900">
                    {selectedVessel.name}
                  </h3>
                  <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800">
                    {selectedVessel.vesselClass}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  {selectedVessel.imo} · Flag: {selectedVessel.flag}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  selectedVessel.status === "WEATHER_SLOWDOWN"
                    ? "bg-amber-100 text-amber-900 animate-pulse"
                    : "bg-emerald-100 text-emerald-900"
                }`}
              >
                {selectedVessel.status === "WEATHER_SLOWDOWN" ? "SLOWDOWN" : selectedVessel.status}
              </span>
            </div>

            {/* Voyage Route Details */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-[12px] space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase">
                <span>Voyage Passage</span>
                <span>Progress: {selectedVessel.progressPct.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="truncate max-w-[45%]">{selectedVessel.origin}</span>
                <ArrowRight size={14} className="text-sky-600 shrink-0 mx-1" />
                <span className="truncate max-w-[45%] text-sky-800">{selectedVessel.destinationPortName}</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${selectedVessel.progressPct}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-600 pt-0.5">
                <span>Remaining: <strong>{selectedVessel.distanceRemainingNm} NM</strong></span>
                <span>ETA: <strong className="text-slate-900">~{selectedVessel.etaHours.toFixed(1)} hrs</strong></span>
              </div>
            </div>

            {/* Key Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-xl border border-slate-200 p-2.5 bg-white">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                  <Gauge size={12} className="text-sky-600" />
                  <span>Current Speed</span>
                </div>
                <p className="mt-1 font-mono text-[16px] font-bold text-slate-900">
                  {selectedVessel.currentSpeedKn} kn
                  <span className="text-[10px] font-normal text-slate-500 ml-1">
                    (Base: {selectedVessel.baseSpeedKn})
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-2.5 bg-white">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                  <Navigation size={12} className="text-sky-600" />
                  <span>Heading</span>
                </div>
                <p className="mt-1 font-mono text-[16px] font-bold text-slate-900">
                  {selectedVessel.headingDeg}° True
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-2.5 bg-white">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                  <Anchor size={12} className="text-sky-600" />
                  <span>Cargo / DWT</span>
                </div>
                <p className="mt-1 font-mono text-[14px] font-bold text-slate-900 truncate">
                  {selectedVessel.quantityT.toLocaleString()} t
                </p>
                <span className="text-[10px] text-slate-500">{selectedVessel.cargo}</span>
              </div>

              <div className="rounded-xl border border-slate-200 p-2.5 bg-white">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                  <Ship size={12} className="text-sky-600" />
                  <span>Arrival Draft</span>
                </div>
                <p className="mt-1 font-mono text-[16px] font-bold text-slate-900">
                  {selectedVessel.draftM.toFixed(1)} m
                </p>
                <span className="text-[10px] text-slate-500">LOA: {selectedVessel.loaM}m</span>
              </div>
            </div>

            {/* Commercial Daily Rate in Selected Currency */}
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                <span>Indicative Daily Charter Hire</span>
                <span className="font-mono">{currency}</span>
              </div>
              <p className="font-mono text-[18px] font-extrabold text-emerald-800">
                {formatCurrency(selectedVessel.dailyHireUsd, { suffix: "/day" })}
              </p>
              <div className="flex justify-between text-[11px] text-emerald-700">
                <span>Fuel Burn: {selectedVessel.dailyFuelBurnMt} MT VLSFO/day</span>
                <span>(1 USD = ₹{usdToInrRate.toFixed(2)})</span>
              </div>
            </div>

            {/* Ocean Telemetry at Vessel Position */}
            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <ShieldAlert size={14} className="text-sky-600 shrink-0" />
              <span>Current Observation: <strong>{selectedVessel.seaCondition}</strong></span>
            </div>

            {/* Action CTA: Load Into Decision Center */}
            <button
              onClick={() => handleLoadIntoDecision(selectedVessel)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-900 hover:bg-sky-800 text-white py-2.5 px-4 font-bold text-[13px] shadow-sm transition-all cursor-pointer hover:shadow-md"
            >
              <span>Import Vessel Into Decision Center</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Mini Fleet Quick-Switch List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs space-y-2 max-h-[220px] overflow-y-auto">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Radar Fleet ({filteredVessels.length})
            </span>
            <div className="space-y-1">
              {filteredVessels.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVesselId(v.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-[12px] cursor-pointer transition-colors ${
                    v.id === selectedVessel.id
                      ? "bg-sky-50 border border-sky-300 font-bold text-sky-950"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        v.status === "WEATHER_SLOWDOWN" ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                    <span className="truncate">{v.name}</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 shrink-0">
                    {v.currentSpeedKn} kn · {v.destinationPortName.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
