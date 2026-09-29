import { useState } from "react";

export interface PortNode {
  id: string;
  name: string;
  x: number;
  y: number;
  draft: string;
}

const EAST_COAST_PORTS: PortNode[] = [
  { id: "haldia", name: "Haldia", x: 342, y: 132, draft: "8.5m", },
  { id: "dhamra", name: "Dhamra", x: 330, y: 176, draft: "18.0m", },
  { id: "paradip", name: "Paradip", x: 318, y: 204, draft: "14.5m", },
  { id: "gopalpur", name: "Gopalpur", x: 298, y: 242, draft: "13.0m", },
  { id: "vizag", name: "Visakhapatnam", x: 280, y: 286, draft: "14.5m", },
  { id: "gangavaram", name: "Gangavaram", x: 270, y: 318, draft: "18.5m", },
];

/**
 * IndiaHudMap: Futuristic maritime intelligence HUD map of India,
 * featuring East Coast corridor highlighting, glowing port nodes,
 * and global routes entering from Australia, Brazil, and South Africa
 * with animated vessel particles.
 */
export function IndiaHudMap({ onSelectPort }: { onSelectPort?: (port: PortNode) => void }) {
  const [hoveredPort, setHoveredPort] = useState<PortNode | null>(null);

  // Global Origin coordinate origins on this HUD canvas (500x520)
  const ORIGIN_AUS = { x: 440, y: 480, label: "Australia", dist: "7,800 km", days: "~18d" };
  const ORIGIN_SAF = { x: 50, y: 450, label: "South Africa", dist: "6,200 km", days: "~16d" };
  const ORIGIN_BRA = { x: 30, y: 180, label: "Brazil", dist: "12,400 km", days: "~28d" };

  const VIZAG = EAST_COAST_PORTS.find((p) => p.id === "vizag")!;
  const PARADIP = EAST_COAST_PORTS.find((p) => p.id === "paradip")!;

  // Smooth maritime shipping corridors
  const ROUTE_AUS = `M ${ORIGIN_AUS.x} ${ORIGIN_AUS.y} Q 380 390, ${VIZAG.x} ${VIZAG.y}`;
  const ROUTE_SAF = `M ${ORIGIN_SAF.x} ${ORIGIN_SAF.y} C 120 420, 200 370, ${VIZAG.x} ${VIZAG.y}`;
  const ROUTE_BRA = `M ${ORIGIN_BRA.x} ${ORIGIN_BRA.y} C 80 270, 160 310, ${VIZAG.x} ${VIZAG.y}`;
  const ROUTE_BRA_PARADIP = `M ${ORIGIN_BRA.x} ${ORIGIN_BRA.y} C 90 240, 190 260, ${PARADIP.x} ${PARADIP.y}`;

  return (
    <div className="relative w-full max-w-[540px] rounded-3xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-md">
      {/* Header bar of the HUD */}
      <div className="mb-2 flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <p className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-sky-800">
            East Coast Maritime HUD
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
          <span>LAT 17.68°N</span>
          <span>·</span>
          <span>LON 83.21°E</span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative aspect-[500/490] w-full">
        <svg viewBox="0 0 500 490" className="h-full w-full" role="img" aria-label="East Coast India Maritime Radar HUD">
          <defs>
            {/* Cyber Radar Grid Pattern */}
            <radialGradient id="hud-radar-radial" cx="56%" cy="52%" r="65%">
              <stop offset="0%" stopColor="#dbeaf7" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#e8f1fa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#eef4fa" stopOpacity="0.95" />
            </radialGradient>

            {/* Glowing filter for lines and nodes */}
            <filter id="hud-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="node-pulse-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Radar background */}
          <rect x="0" y="0" width="500" height="490" rx="20" fill="url(#hud-radar-radial)" />

          {/* Radar Range Rings */}
          <circle cx="280" cy="286" r="60" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="280" cy="286" r="120" fill="none" stroke="rgba(56,189,248,0.10)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="280" cy="286" r="190" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1" strokeDasharray="5 7" />

          {/* Graticule Crosshairs */}
          <line x1="280" y1="20" x2="280" y2="470" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
          <line x1="20" y1="286" x2="480" y2="286" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />

          {/* ── SUBTLE FUTURISTIC INDIA OUTLINE ── */}
          {/* Main India Landmass Silhouette */}
          <path
            d="M 160 55 
               C 195 40, 248 42, 280 56 
               C 310 68, 334 88, 342 120 
               C 350 148, 340 172, 330 188 
               C 342 212, 336 244, 320 270 
               C 304 298, 292 324, 280 354 
               C 270 380, 255 402, 232 410 
               C 214 416, 200 402, 194 375 
               C 184 340, 174 306, 164 270 
               C 152 230, 140 190, 134 150 
               C 128 116, 138 80, 160 55 Z"
            fill="#dbe7f2"
            fillOpacity="0.75"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="1.4"
          />

          {/* Interior HUD Topography Lines */}
          <path
            d="M 200 110 Q 240 130, 280 125"
            fill="none"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth="1"
          />
          <path
            d="M 180 200 Q 230 220, 290 210"
            fill="none"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth="1"
          />
          <path
            d="M 190 300 Q 230 310, 265 330"
            fill="none"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth="1"
          />

          {/* ── STRONGLY HIGHLIGHTED EAST COAST CORRIDOR ── */}
          <path
            d="M 342 120 
               C 350 148, 340 172, 330 188 
               C 342 212, 336 244, 320 270 
               C 304 298, 292 324, 280 354 
               C 270 380, 255 402, 232 410"
            fill="none"
            stroke="#0891b2"
            strokeWidth="3.2"
            filter="url(#hud-glow-strong)"
            strokeLinecap="round"
          />

          {/* Secondary Golden Saffron Trim on East Coast */}
          <path
            d="M 342 120 
               C 350 148, 340 172, 330 188 
               C 342 212, 336 244, 320 270 
               C 304 298, 292 324, 280 354"
            fill="none"
            stroke="rgba(245, 158, 11, 0.65)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* India Label inside HUD */}
          <text
            x="205"
            y="235"
            fontSize="11"
            fill="rgba(148, 163, 184, 0.55)"
            letterSpacing="5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            BHARAT
          </text>
          <text
            x="165"
            y="252"
            fontSize="8"
            fill="rgba(56, 189, 248, 0.5)"
            letterSpacing="2"
            fontWeight="bold"
            fontFamily="monospace"
          >
            EAST COAST CORRIDOR
          </text>

          {/* Sea Watermark Labels */}
          <text x="360" y="270" fontSize="9" fill="rgba(56,189,248,0.3)" letterSpacing="3" fontWeight="bold" transform="rotate(74 360 270)">
            BAY OF BENGAL
          </text>
          <text x="120" y="465" fontSize="9" fill="rgba(56,189,248,0.3)" letterSpacing="3" fontWeight="bold">
            INDIAN OCEAN
          </text>

          {/* ── GLOBAL SHIPPING LANES & ANIMATED PARTICLES ── */}
          <g fill="none">
            {/* Brazil to Vizag & Paradip */}
            <path d={ROUTE_BRA} stroke="rgba(56,189,248,0.25)" strokeWidth="1.8" strokeDasharray="5 7" />
            <path d={ROUTE_BRA_PARADIP} stroke="rgba(56,189,248,0.20)" strokeWidth="1.5" strokeDasharray="4 8" />

            {/* South Africa to Vizag */}
            <path d={ROUTE_SAF} stroke="rgba(56,189,248,0.35)" strokeWidth="2" strokeDasharray="6 6" />

            {/* Australia to East Coast (High density iron ore & coal lane) */}
            <path d={ROUTE_AUS} stroke="#0284c7" strokeWidth="2.4" strokeDasharray="8 6" filter="url(#hud-glow-strong)" />

            {/* ── ANIMATED PARTICLES TRAVELLING ALONG THE ROUTES ── */}
            {/* Australia Route Particles */}
            <circle r="4.5" fill="#d97706" filter="url(#hud-glow-strong)">
              <animateMotion dur="6.5s" repeatCount="indefinite" path={ROUTE_AUS} />
            </circle>
            <circle r="3.5" fill="#0284c7">
              <animateMotion dur="6.5s" begin="-3.2s" repeatCount="indefinite" path={ROUTE_AUS} />
            </circle>

            {/* South Africa Route Particles */}
            <circle r="4" fill="#0284c7" filter="url(#hud-glow-strong)">
              <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE_SAF} />
            </circle>
            <circle r="3" fill="#d97706">
              <animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite" path={ROUTE_SAF} />
            </circle>

            {/* Brazil Route Particles */}
            <circle r="4" fill="#0284c7" filter="url(#hud-glow-strong)">
              <animateMotion dur="12s" repeatCount="indefinite" path={ROUTE_BRA} />
            </circle>
            <circle r="3" fill="#a7f3d0">
              <animateMotion dur="14s" begin="-6s" repeatCount="indefinite" path={ROUTE_BRA_PARADIP} />
            </circle>
          </g>

          {/* ── GLOBAL ORIGIN HUBS CALLOUTS ── */}
          {/* Australia Node */}
          <g transform={`translate(${ORIGIN_AUS.x - 38}, ${ORIGIN_AUS.y - 20})`}>
            <rect width="84" height="28" rx="8" fill="#f4f8fc" stroke="#0284c7" strokeWidth="1.2" />
            <circle cx="12" cy="14" r="3.5" fill="#d97706" />
            <text x="22" y="12" fontSize="8" fill="#fff" fontWeight="bold">AUSTRALIA</text>
            <text x="22" y="22" fontSize="7" fill="#52627a" fontFamily="monospace">7,800km · ~18d</text>
          </g>

          {/* South Africa Node */}
          <g transform={`translate(${ORIGIN_SAF.x - 10}, ${ORIGIN_SAF.y - 20})`}>
            <rect width="90" height="28" rx="8" fill="#f4f8fc" stroke="#0284c7" strokeWidth="1.2" />
            <circle cx="12" cy="14" r="3.5" fill="#0284c7" />
            <text x="22" y="12" fontSize="8" fill="#fff" fontWeight="bold">SOUTH AFRICA</text>
            <text x="22" y="22" fontSize="7" fill="#52627a" fontFamily="monospace">6,200km · ~16d</text>
          </g>

          {/* Brazil Node */}
          <g transform={`translate(${ORIGIN_BRA.x - 10}, ${ORIGIN_BRA.y - 20})`}>
            <rect width="80" height="28" rx="8" fill="#f4f8fc" stroke="#0284c7" strokeWidth="1.2" />
            <circle cx="12" cy="14" r="3.5" fill="#0284c7" />
            <text x="22" y="12" fontSize="8" fill="#fff" fontWeight="bold">BRAZIL</text>
            <text x="22" y="22" fontSize="7" fill="#52627a" fontFamily="monospace">12,400km · ~28d</text>
          </g>

          {/* Inter-port connecting lines */}
          <path
            d="M 342 132 L 330 176 L 318 204 L 298 242 L 280 286 L 270 318"
            fill="none"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />

          {/* ── 6 GLOWING EAST COAST PORT NODES ── */}
          {EAST_COAST_PORTS.map((port) => {
            const isHovered = hoveredPort?.id === port.id;
            const isVizag = port.id === "vizag";

            return (
              <g
                key={port.id}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPort(port)}
                onMouseLeave={() => setHoveredPort(null)}
                onClick={() => onSelectPort?.(port)}
              >
                {/* Outer Ping Pulse Animation */}
                <circle
                  cx={port.x}
                  cy={port.y}
                  r="9"
                  fill="none"
                  stroke={isVizag ? "#d97706" : "#0891b2"}
                  strokeWidth="1.5"
                  className="port-ping"
                />

                {/* Node Outer Ring */}
                <circle
                  cx={port.x}
                  cy={port.y}
                  r={isHovered ? "7" : "5.5"}
                  fill="#f4f8fc"
                  stroke={isVizag ? "#d97706" : "#0891b2"}
                  strokeWidth={isHovered ? "2.4" : "1.8"}
                  filter="url(#node-pulse-glow)"
                />

                {/* Node Center Core */}
                <circle
                  cx={port.x}
                  cy={port.y}
                  r="2.8"
                  fill={isVizag ? "#d97706" : "#ffffff"}
                />

                {/* Port Name Label */}
                <text
                  x={port.x + 12}
                  y={port.y + 3.5}
                  fontSize={isVizag ? "9.5" : "8.5"}
                  fill={isVizag ? "#d97706" : "#0f2440"}
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  {port.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Port Telemetry Card */}
        {hoveredPort && (
          <div className="anim-fade-up absolute bottom-2 right-2 z-30 rounded-xl border border-sky-300 bg-white/95 p-3 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[13px] font-extrabold text-slate-900">{hoveredPort.name}</p>
              <span className="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-sky-800">
                East Coast
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3 font-mono text-[10px]">
              <div>
                <span className="text-slate-500 block text-[9px]">Reference draft</span>
                <span className="font-bold text-slate-900">{hoveredPort.draft}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Corridor Summary Pill */}
      <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-slate-700">6 Ports Active</span>
        </div>
        <div className="font-mono text-[10px] text-slate-600">
          Strategic Terminal: <span className="font-bold text-sky-800">Visakhapatnam (Major Bulk Hub)</span>
        </div>
      </div>
    </div>
  );
}
