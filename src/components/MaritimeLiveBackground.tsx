import { useState, useMemo, useEffect } from "react";
import { useShipment } from "../state/shipment";
import { PORT_SPECS } from "../domain/decision";
import { useLiveWeather, weatherRisk } from "../services/liveWeatherService";
import { useLiveMarine } from "../services/liveMarineService";
import {
  Compass,
  Wind,
  Waves,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Anchor,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

interface MaritimeLiveBackgroundProps {
  origin?: string;
  destinationKey?: string;
  onSelectPort?: (key: string) => void;
  className?: string;
  /**
   * Controlled opacity of the antique map layer (0.05 to 0.35)
   * Defaults to 0.15 for dense UI readability
   */
  mapOpacity?: number;
  /**
   * If true, renders a dedicated visual showcase box (e.g., inside Decision Center empty space)
   */
  variant?: "fullscreen" | "panel";
}

// Bounding box for normalized projection of East Coast India
const GEO_BOUNDS = {
  minLon: 77.0,
  maxLon: 90.0,
  minLat: 7.5,
  maxLat: 23.5,
};

function projectGeoToSvg(lat: number, lon: number, width = 1000, height = 800) {
  const normX = (lon - GEO_BOUNDS.minLon) / (GEO_BOUNDS.maxLon - GEO_BOUNDS.minLon);
  const normY = (GEO_BOUNDS.maxLat - lat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat);
  return {
    x: Math.round(normX * width),
    y: Math.round(normY * height),
  };
}

// Indicative off-canvas route origins
const ORIGIN_COORDINATES: Record<string, { x: number; y: number; label: string; corridor: string }> = {
  Australia: { x: 960, y: 780, label: "Australia (Port Hedland / Hay Point)", corridor: "Southern Ocean / Bay of Bengal Corridor" },
  Brazil: { x: 50, y: 780, label: "Brazil (Ponta da Madeira / Tubarao)", corridor: "Cape of Good Hope / Indian Ocean Corridor" },
  "South Africa": { x: 160, y: 790, label: "South Africa (Richards Bay)", corridor: "Mozambique Channel / Indian Ocean Corridor" },
  Indonesia: { x: 920, y: 650, label: "Indonesia (East Kalimantan)", corridor: "Malacca Strait / Bay of Bengal Corridor" },
  "United States": { x: 40, y: 680, label: "US Gulf / Hampton Roads", corridor: "Atlantic / Cape / Indian Ocean Corridor" },
};

export function MaritimeLiveBackground({
  origin: propOrigin,
  destinationKey: propDestinationKey,
  onSelectPort,
  className = "",
  mapOpacity = 0.14,
  variant = "fullscreen",
}: MaritimeLiveBackgroundProps) {
  const { s, set } = useShipment();
  const origin = propOrigin ?? s.origin;
  const destinationKey = propDestinationKey ?? s.destination;

  const [hoveredPortKey, setHoveredPortKey] = useState<string | null>(null);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [isWidgetHidden, setIsWidgetHidden] = useState(false);
  const [syncTime, setSyncTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSyncTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Selected port specification
  const selectedPort = useMemo(() => {
    const spec = PORT_SPECS[destinationKey];
    if (spec) return { key: destinationKey, ...spec };
    return {
      key: "visakhapatnam",
      ...PORT_SPECS.visakhapatnam,
    };
  }, [destinationKey]);

  // Live environmental feeds for the selected port
  const weather = useLiveWeather(selectedPort.lat, selectedPort.lon);
  const marine = useLiveMarine(selectedPort.lat, selectedPort.lon);

  // Determine actual API status
  const weatherLive = weather.status === "ok";
  const marineLive = marine.status === "ok";
  const liveStatusText = useMemo(() => {
    if (weatherLive && marineLive) return "WEATHER & MARINE LIVE";
    if (weatherLive && !marineLive) return "WEATHER LIVE · Marine Unavailable";
    if (!weatherLive && marineLive) return "MARINE LIVE · Weather Unavailable";
    return "ENVIRONMENTAL FEEDS OFFLINE";
  }, [weatherLive, marineLive]);

  const liveStatusColor = useMemo(() => {
    if (weatherLive && marineLive) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (weatherLive || marineLive) return "text-amber-800 bg-amber-50 border-amber-300";
    return "text-slate-600 bg-slate-100 border-slate-300";
  }, [weatherLive, marineLive]);

  // Projected ports list
  const projectedPorts = useMemo(() => {
    return Object.entries(PORT_SPECS).map(([key, p]) => {
      const coords = projectGeoToSvg(p.lat, p.lon);
      return {
        key,
        name: p.name,
        lat: p.lat,
        lon: p.lon,
        maxDwt: p.maxDwt,
        x: coords.x,
        y: coords.y,
        isSelected: key === selectedPort.key,
        isHovered: key === hoveredPortKey,
      };
    });
  }, [selectedPort.key, hoveredPortKey]);

  // Indicative Route Path (Bézier curve from origin approach to destination port)
  const routeData = useMemo(() => {
    const originSpec = ORIGIN_COORDINATES[origin] ?? ORIGIN_COORDINATES["Australia"];
    const destCoords = projectGeoToSvg(selectedPort.lat, selectedPort.lon);

    // Dynamic control point for realistic maritime approach curve
    const midX = (originSpec.x + destCoords.x) / 2 + (origin === "Australia" ? 40 : -50);
    const midY = (originSpec.y + destCoords.y) / 2 + 30;

    const path = `M ${originSpec.x} ${originSpec.y} Q ${midX} ${midY}, ${destCoords.x} ${destCoords.y}`;

    return {
      originLabel: originSpec.label,
      corridorName: originSpec.corridor,
      originPoint: originSpec,
      destPoint: destCoords,
      svgPath: path,
    };
  }, [origin, selectedPort]);

  const handlePortClick = (key: string) => {
    if (onSelectPort) {
      onSelectPort(key);
    } else {
      set({ destination: key });
    }
  };

  const isFullscreen = variant === "fullscreen";

  return (
    <div
      className={`relative overflow-hidden select-none ${
        isFullscreen
          ? "pointer-events-none fixed inset-0 z-0 h-full w-full"
          : "rounded-3xl border border-slate-300/80 bg-white/95 p-6 shadow-sm backdrop-blur-md"
      } ${className}`}
      aria-hidden={isFullscreen ? "true" : undefined}
    >
      {/* ── LAYER 1: ANTIQUE INDIA MAP IMAGE WITH SUBTLE CINEMATIC MOVEMENT ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-[-4%] h-[108%] w-[108%] bg-cover bg-center transition-transform duration-1000 ease-out will-change-transform"
          style={{
            backgroundImage: "url('/antique-india-map.jpg'), url('/image.png'), url('/logo.jpg')",
            opacity: mapOpacity,
            filter: "sepia(0.25) contrast(1.05) saturate(1.1)",
            animation: "subtleMapPan 75s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* ── LAYER 2: WARM PARCHMENT & MARITIME ATMOSPHERIC VIGNETTE ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isFullscreen
            ? `radial-gradient(ellipse at 75% 45%, rgba(244, 248, 252, 0.45) 0%, rgba(240, 245, 250, 0.88) 65%, rgba(238, 244, 250, 0.98) 100%),
               linear-gradient(to bottom, rgba(255, 255, 255, 0.82) 0%, transparent 20%, transparent 80%, rgba(240, 245, 250, 0.95) 100%)`
            : `radial-gradient(ellipse at 65% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.85) 75%, #ffffff 100%)`,
        }}
      />

      {/* ── LAYER 3 & 4: CALIBRATED SVG GEOGRAPHIC & ROUTE OVERLAY ── */}
      <svg
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Nautical beacon pulses */}
          <radialGradient id="dest-pulse-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="port-beacon-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Route path gradient */}
          <linearGradient id="route-path-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>

          {/* Subtle grid pattern */}
          <pattern id="nautical-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(15, 36, 64, 0.035)" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Faint nautical grid lines */}
        <rect width="1000" height="800" fill="url(#nautical-grid)" />

        {/* Latitude parallels across Bay of Bengal */}
        <g stroke="rgba(15, 36, 64, 0.05)" strokeDasharray="3 6" strokeWidth="0.8">
          <line x1="200" y1="135" x2="980" y2="135" />
          <text x="940" y="130" fill="#64748b" fontSize="9" fontFamily="monospace">20°N</text>
          <line x1="150" y1="290" x2="980" y2="290" />
          <text x="940" y="285" fill="#64748b" fontSize="9" fontFamily="monospace">17.5°N</text>
          <line x1="100" y1="462" x2="980" y2="462" />
          <text x="940" y="457" fill="#64748b" fontSize="9" fontFamily="monospace">14°N</text>
          <line x1="50" y1="650" x2="980" y2="650" />
          <text x="940" y="645" fill="#64748b" fontSize="9" fontFamily="monospace">10°N</text>
        </g>

        {/* ── LAYER 4: INDICATIVE ROUTE VISUALIZATION (NOT LIVE AIS) ── */}
        <g id="indicative-route">
          {/* Broad route glow band */}
          <path
            d={routeData.svgPath}
            fill="none"
            stroke="rgba(2, 132, 199, 0.15)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Animated dashed oceanic transit line */}
          <path
            d={routeData.svgPath}
            fill="none"
            stroke="url(#route-path-grad)"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            className="route-flow"
          />

          {/* Origin waypoint node */}
          <g transform={`translate(${routeData.originPoint.x}, ${routeData.originPoint.y})`}>
            <circle r="6" fill="#d97706" opacity="0.8" />
            <circle r="12" fill="none" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 3" />
            <text
              x="-12"
              y="-12"
              fill="#78350f"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              {origin} Origin
            </text>
          </g>

          {/* Oceanic Corridor Label */}
          <text
            x={(routeData.originPoint.x + routeData.destPoint.x) / 2 + 20}
            y={(routeData.originPoint.y + routeData.destPoint.y) / 2 + 15}
            fill="#0369a1"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.8"
            opacity="0.8"
          >
            Indicative maritime approach ({origin} stem)
          </text>
        </g>

        {/* ── LAYER 3: VALIDATED EAST COAST PORT BEACONS ── */}
        <g id="port-markers">
          {projectedPorts.map((p) => {
            const isSel = p.isSelected;
            return (
              <g
                key={p.key}
                transform={`translate(${p.x}, ${p.y})`}
                className="pointer-events-auto cursor-pointer transition-all duration-200"
                onClick={() => handlePortClick(p.key)}
                onMouseEnter={() => setHoveredPortKey(p.key)}
                onMouseLeave={() => setHoveredPortKey(null)}
              >
                {/* Active destination pulsing halo */}
                {isSel && (
                  <>
                    <circle r="22" fill="url(#dest-pulse-grad)" className="port-ping" />
                    <circle r="15" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.8" />
                  </>
                )}

                {/* Normal environmental beacon halo */}
                {!isSel && (
                  <circle r="9" fill="url(#port-beacon-grad)" opacity="0.6" />
                )}

                {/* Pin core dot */}
                <circle
                  r={isSel ? 5.5 : 3.5}
                  fill={isSel ? "#b45309" : "#0284c7"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Port Label */}
                <g transform={`translate(10, ${isSel ? -4 : 3})`}>
                  <rect
                    x="-2"
                    y="-9"
                    width={p.name.length * 6.5 + 8}
                    height="14"
                    rx="3"
                    fill={isSel ? "rgba(254, 243, 199, 0.95)" : "rgba(255, 255, 255, 0.85)"}
                    stroke={isSel ? "rgba(217, 119, 6, 0.5)" : "rgba(15, 36, 64, 0.12)"}
                    strokeWidth="0.8"
                  />
                  <text
                    x="2"
                    y="1.5"
                    fill={isSel ? "#78350f" : "#0f2440"}
                    fontSize={isSel ? "9.5" : "8"}
                    fontFamily="monospace"
                    fontWeight={isSel ? "900" : "700"}
                  >
                    {p.name.replace(" Port", "")}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* ── LAYER 5: LIVE ENVIRONMENTAL TELEMETRY WIDGET (OCCUPYING EMPTY SPACE) ── */}
      <div
        className={`pointer-events-auto absolute z-20 transition-all duration-300 ${
          isFullscreen
            ? "bottom-5 right-5 sm:bottom-8 sm:right-8 max-w-[340px] sm:max-w-[380px]"
            : "top-4 right-4 max-w-[340px]"
        }`}
      >
        {isWidgetHidden ? (
          <button
            onClick={() => setIsWidgetHidden(false)}
            className="group flex items-center gap-2 rounded-full border border-sky-300 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md hover:bg-sky-50 transition-all cursor-pointer"
            title="Open Live Maritime Environmental Telemetry"
          >
            <Compass size={14} className="text-sky-700 animate-spin" style={{ animationDuration: "14s" }} />
            <span className="font-mono text-[10px] font-black uppercase text-slate-900">
              {selectedPort.name.replace(" Port", "")} · {weatherLive ? `${weather.data.wind ?? "—"} km/h` : "Weather"} · {marineLive ? marine.data.berthingSafety : "Marine"}
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        ) : (
          <div className="rounded-2xl border border-slate-300/90 bg-white/95 p-4 shadow-lg backdrop-blur-md">
            {/* Header & Status Indicator */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass size={13} className="text-sky-700" />
                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider border ${liveStatusColor}`}>
                  {liveStatusText}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPanelExpanded((v) => !v)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  title={panelExpanded ? "Collapse Details" : "Expand Details"}
                  aria-label="Toggle telemetry panel"
                >
                  {panelExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  onClick={() => setIsWidgetHidden(true)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Minimize to floating pill"
                  aria-label="Minimize telemetry widget"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Active Target Port & Indicative Corridor */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Target Destination
                  </p>
                  <h4 className="text-[14px] font-black text-slate-950">
                    {selectedPort.name}
                  </h4>
                </div>
                <span className="font-mono text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {selectedPort.lat.toFixed(2)}°N · {selectedPort.lon.toFixed(2)}°E
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                <Anchor size={12} className="text-amber-700 shrink-0" />
                <span className="truncate">Indicative Route: <b className="text-slate-800">{origin}</b> → <b className="text-slate-800">{selectedPort.name.replace(" Port", "")}</b></span>
              </div>
            </div>

            {/* Live Environmental Metrics (Real Open-Meteo Data) */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
              {/* Live Weather Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                    <Wind size={12} className="text-sky-700" /> Weather
                  </span>
                  <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-black px-1.5 py-0.5 rounded ${
                    weatherLive
                      ? weatherRisk(weather.data) === "HIGH"
                        ? "bg-rose-100 text-rose-800"
                        : weatherRisk(weather.data) === "MODERATE"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {weatherLive && weatherRisk(weather.data) === "HIGH" ? (
                      <AlertTriangle size={10} />
                    ) : weatherLive ? (
                      <ShieldCheck size={10} />
                    ) : null}
                    {weatherLive ? `${weatherRisk(weather.data)} RISK` : "OFFLINE"}
                  </span>
                </div>
                <div className="mt-1">
                  {weatherLive ? (
                    <>
                      <p className="font-mono text-[13px] font-black text-slate-950">
                        Wind {weather.data.wind ?? "—"} <span className="text-[10px] font-normal text-slate-500">km/h</span>
                      </p>
                      <p className="font-mono text-[10px] text-slate-600">
                        Gusts {weather.data.gusts ?? "—"} km/h · {weather.data.temp ?? "—"}°C
                      </p>
                    </>
                  ) : (
                    <p className="font-mono text-[10px] text-slate-500 italic mt-0.5">
                      Weather unavailable
                    </p>
                  )}
                </div>
              </div>

              {/* Live Marine Oceanography Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                    <Waves size={12} className="text-cyan-700" /> Marine
                  </span>
                  <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-black px-1.5 py-0.5 rounded ${
                    marineLive
                      ? marine.data.berthingSafety === "SAFE"
                        ? "bg-emerald-100 text-emerald-800"
                        : marine.data.berthingSafety === "CAUTION"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {marineLive && marine.data.berthingSafety === "CAUTION" ? (
                      <AlertTriangle size={10} />
                    ) : marineLive ? (
                      <ShieldCheck size={10} />
                    ) : null}
                    {marineLive ? marine.data.berthingSafety : "OFFLINE"}
                  </span>
                </div>
                <div className="mt-1">
                  {marineLive ? (
                    <>
                      <p className="font-mono text-[13px] font-black text-slate-950">
                        Wave {marine.data.waveHeight ? `${marine.data.waveHeight.toFixed(1)}m` : "—"}
                      </p>
                      <p className="font-mono text-[10px] text-slate-600 truncate" title={marine.data.seaState}>
                        {marine.data.seaState}
                      </p>
                    </>
                  ) : (
                    <p className="font-mono text-[10px] text-slate-500 italic mt-0.5">
                      Marine data unavailable
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Detailed Specs */}
            {panelExpanded && (
              <div className="mt-2.5 border-t border-slate-100 pt-2 space-y-1.5 text-[10px] font-mono text-slate-600 anim-fade-up">
                <div className="flex justify-between">
                  <span>Maximum Berth DWT:</span>
                  <span className="font-bold text-slate-900">{selectedPort.maxDwt.toLocaleString()} t</span>
                </div>
                <div className="flex justify-between">
                  <span>Observation Sync:</span>
                  <span className="font-bold text-slate-900">{syncTime || "Live stream"}</span>
                </div>
                <div className="flex items-start gap-1 text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                  <Info size={11} className="shrink-0 mt-0.5 text-slate-400" />
                  <span>
                    Indicative transit path. Live East Coast AIS tracking is currently unavailable. Environmental feeds retrieved via Open-Meteo APIs.
                  </span>
                </div>
              </div>
            )}

            {/* Footer note */}
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-600 pt-1.5 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar size={10} /> {syncTime || "Sync active"}
              </span>
              <span className="text-slate-600 font-bold">Antique India Nautical Map</span>
            </div>
          </div>
        )}
      </div>

      {/* ── CSS KEYFRAMES FOR RESTRAINED MOTION & REDUCED MOTION SUPPORT ── */}
      <style>{`
        @keyframes subtleMapPan {
          0% {
            transform: scale(1.02) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.04) translate3d(-1.5%, 1.2%, 0);
          }
          100% {
            transform: scale(1.02) translate3d(1.2%, -1%, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform {
            animation: none !important;
            transform: none !important;
          }
          .route-flow {
            animation: none !important;
          }
          .port-ping {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
