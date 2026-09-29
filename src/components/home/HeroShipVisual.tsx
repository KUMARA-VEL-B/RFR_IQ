import { useState } from "react";
import { ShieldCheck, Weight, Gauge, Navigation } from "lucide-react";

/**
 * HeroShipVisual: Dominant, realistic commercial bulk carrier with dramatic lighting,
 * navigation lights, hull reflections, ocean spray, and futuristic maritime telemetry callouts.
 */
export function HeroShipVisual() {
  const [activeTelemetry, setActiveTelemetry] = useState<string | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-[1180px] select-none py-6">
      {/* Ship Container with subtle maritime floating heave */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow backdrop behind the ship hull */}
        <div className="pointer-events-none absolute bottom-12 left-1/2 -z-10 h-36 w-4/5 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-4 left-1/2 -z-10 h-28 w-3/5 -translate-x-1/2 rounded-full bg-amber-500/10 blur-2xl" />

        {/* ── Bulk Carrier SVG ── */}
        <svg
          viewBox="0 0 1100 360"
          className="w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)] filter"
          style={{ animation: "shipHeave 7s ease-in-out infinite" }}
          role="img"
          aria-label="Bulk Carrier Vessel"
        >
          <defs>
            {/* Dramatic Hull Gradient: Sunrise rim light on top, dark oceanic steel below */}
            <linearGradient id="vessel-hull-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="12%" stopColor="#475569" />
              <stop offset="38%" stopColor="#dbe4ee" />
              <stop offset="78%" stopColor="#f4f8fc" />
              <stop offset="100%" stopColor="#e3eff9" />
            </linearGradient>

            {/* Hull Lower Anti-Fouling Red Stripe below waterline */}
            <linearGradient id="hull-keel-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="60%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>

            {/* Superstructure Accommodation Block Gradient */}
            <linearGradient id="superstructure-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="35%" stopColor="#0f2440" />
              <stop offset="80%" stopColor="#52627a" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Cargo Hatch Cover Gradient */}
            <linearGradient id="hatch-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#dbe4ee" />
              <stop offset="100%" stopColor="#f4f8fc" />
            </linearGradient>

            {/* Ocean Spray Foam Filter */}
            <filter id="spray-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Navigation Light Glow */}
            <filter id="nav-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── OCEAN SURFACE & FOAM WAKE ── */}
          {/* Stern Wake Turbulence */}
          <ellipse cx="140" cy="272" rx="90" ry="14" fill="rgba(56,189,248,0.12)" />
          <path
            d="M 60 274 Q 130 268, 200 274 T 320 276"
            fill="none"
            stroke="rgba(15,36,64,0.35)"
            strokeWidth="2.5"
            strokeDasharray="12 8"
          />

          {/* Water reflection under the entire hull */}
          <path
            d="M 120 272 C 320 286, 750 286, 990 272 C 840 294, 280 294, 120 272 Z"
            fill="rgba(56, 189, 248, 0.09)"
          />

          {/* Bow Wave & Spray Burst */}
          <g filter="url(#spray-glow)">
            {/* White bow foam crest */}
            <path
              d="M 975 264 Q 1015 258, 1045 272 Q 1020 278, 970 274 Z"
              fill="rgba(15,36,64, 0.65)"
            />
            <path
              d="M 985 268 C 1030 264, 1065 276, 1075 284 C 1035 282, 995 274, 985 268 Z"
              fill="rgba(56, 189, 248, 0.3)"
            />
            {/* Spray droplets */}
            <circle cx="1025" cy="254" r="2.2" fill="#fff" opacity="0.8" />
            <circle cx="1040" cy="259" r="1.8" fill="#0284c7" opacity="0.9" />
            <circle cx="1055" cy="265" r="2.5" fill="#fff" opacity="0.75" />
            <circle cx="1032" cy="261" r="1.4" fill="#fff" opacity="0.9" />
            <circle cx="1062" cy="272" r="2" fill="#7dd3fc" opacity="0.8" />
          </g>

          {/* ── BULK CARRIER HULL ── */}
          {/* Lower Keel / Red Boot-Topping (anti-fouling coating below load waterline) */}
          <path
            d="M 145 254 L 975 254 Q 1005 266, 1018 268 L 1012 274 Q 970 280, 780 280 L 220 280 Q 155 276, 142 268 Z"
            fill="url(#hull-keel-grad)"
            stroke="#7f1d1d"
            strokeWidth="1"
          />

          {/* Upper Steel Hull Body */}
          <path
            d="M 125 186 
               L 955 186 
               Q 985 190, 1005 212 
               L 1020 248 
               Q 1024 262, 1018 268
               L 142 268
               Q 125 250, 118 220
               L 115 196
               Z"
            fill="url(#vessel-hull-grad)"
            stroke="#64748b"
            strokeWidth="1.6"
          />

          {/* Hull Sheer Strake & Sunrise Highlight Line */}
          <path
            d="M 125 186 L 955 186 Q 985 190, 1005 212 L 1020 248"
            fill="none"
            stroke="rgba(251, 191, 36, 0.75)"
            strokeWidth="2.2"
          />

          {/* Waterline Stripe */}
          <line
            x1="138"
            y1="254"
            x2="982"
            y2="254"
            stroke="#0284c7"
            strokeWidth="2.4"
            strokeOpacity="0.85"
            strokeDasharray="40 10 90 10"
          />

          {/* Anchor Hawse Pipe & Chain at Bow */}
          <ellipse cx="965" cy="208" rx="7" ry="4.5" fill="#020617" stroke="#52627a" strokeWidth="1.5" />
          <circle cx="965" cy="208" r="3.2" fill="#090d16" />
          {/* Bulbous bow underwater outline hint */}
          <path d="M 1018 268 Q 1035 273, 1030 282 Q 1005 284, 995 278" fill="#450a0a" opacity="0.6" />

          {/* Draft Marks at Bow and Stern (White tick lines) */}
          <g stroke="#0f2440" strokeWidth="1.2" opacity="0.75">
            <line x1="992" y1="230" x2="998" y2="230" />
            <line x1="994" y1="236" x2="998" y2="236" />
            <line x1="992" y1="242" x2="998" y2="242" />
            <line x1="994" y1="248" x2="998" y2="248" />
            <line x1="992" y1="254" x2="998" y2="254" />
            {/* Stern draft */}
            <line x1="145" y1="232" x2="151" y2="232" />
            <line x1="145" y1="238" x2="151" y2="238" />
            <line x1="145" y1="244" x2="151" y2="244" />
            <line x1="145" y1="250" x2="151" y2="250" />
          </g>

          {/* ── CARGO HOLDS & HATCH COVERS ── */}
          {/* Deck Coaming Platform */}
          <rect x="290" y="174" width="655" height="12" fill="#dbe4ee" stroke="#475569" strokeWidth="1" rx="1.5" />

          {/* 7 Bulk Cargo Hatch Covers */}
          {Array.from({ length: 7 }).map((_, idx) => {
            const hatchWidth = 74;
            const gap = 17;
            const startX = 302 + idx * (hatchWidth + gap);
            return (
              <g key={`hatch-${idx}`}>
                {/* Raised hatch coaming */}
                <rect
                  x={startX}
                  y="160"
                  width={hatchWidth}
                  height="16"
                  rx="2.5"
                  fill="url(#hatch-grad)"
                  stroke="#64748b"
                  strokeWidth="1.4"
                />
                {/* Hatch hydraulic dividing seal */}
                <line x1={startX + hatchWidth / 2} y1="160" x2={startX + hatchWidth / 2} y2="176" stroke="#f4f8fc" strokeWidth="1.8" />
                <line x1={startX + 4} y1="164" x2={startX + hatchWidth - 4} y2="164" stroke="rgba(15,36,64,0.18)" strokeWidth="1" />
                {/* Hatch identification label */}
                <text
                  x={startX + hatchWidth / 2}
                  y="172"
                  fill="#52627a"
                  fontSize="7.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  H0{idx + 1}
                </text>
              </g>
            );
          })}

          {/* Deck Walkway Rails & Bollards */}
          <line x1="288" y1="174" x2="945" y2="174" stroke="#52627a" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* ── SUPERSTRUCTURE & BRIDGE TOWER (Aft / Left) ── */}
          {/* Lower Accommodation Deck */}
          <rect x="145" y="142" width="130" height="44" rx="2" fill="url(#superstructure-grad)" stroke="#64748b" strokeWidth="1.5" />
          {/* Deck 2 */}
          <rect x="155" y="112" width="112" height="30" rx="2" fill="url(#superstructure-grad)" stroke="#64748b" strokeWidth="1.5" />
          {/* Deck 3 / Nav Bridge Wings */}
          <rect x="162" y="86" width="100" height="26" rx="2" fill="url(#superstructure-grad)" stroke="#64748b" strokeWidth="1.5" />
          {/* Bridge Wings Extension */}
          <rect x="150" y="88" width="124" height="6" rx="1.5" fill="#0f2440" stroke="#64748b" strokeWidth="1" />

          {/* Bridge Windows (Dark Navy Glass with soft amber interior light) */}
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={`win-${i}`}
              x={168 + i * 9.5}
              y="92"
              width="6.5"
              height="8"
              rx="1"
              fill="#e3eff9"
              stroke="#0284c7"
              strokeWidth="0.8"
            />
          ))}

          {/* Lower Porch/Cabin Portholes */}
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={`port-${i}`} cx={170 + i * 16} cy="126" r="3" fill="#f4f8fc" stroke="#cbd5e1" strokeWidth="1" />
          ))}

          {/* Funnel Superstructure (Exhaust Stack with Indian Maritime saffron accent band) */}
          <g>
            {/* Funnel casing */}
            <path
              d="M 166 86 L 174 42 L 202 42 L 200 86 Z"
              fill="#f4f8fc"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Funnel Saffron Band (Indian maritime touch) */}
            <path
              d="M 171 58 L 173 48 L 201 48 L 200 58 Z"
              fill="#b45309"
            />
            {/* Subtle white & green thin stripes inside band */}
            <line x1="172" y1="53" x2="201" y2="53" stroke="#fff" strokeWidth="1.2" />
            <line x1="172.5" y1="56" x2="200.5" y2="56" stroke="#10b981" strokeWidth="1.2" />

            {/* Exhaust pipes top */}
            <rect x="180" y="36" width="5" height="6" fill="#475569" />
            <rect x="190" y="34" width="6" height="8" fill="#cbd5e1" />
          </g>

          {/* Radar Mast & Navigation Sensors (Aft Mast) */}
          <g stroke="#52627a" strokeWidth="1.8" strokeLinecap="round">
            <line x1="216" y1="86" x2="216" y2="30" />
            <line x1="208" y1="46" x2="224" y2="46" />
            <line x1="210" y1="62" x2="222" y2="62" />
            {/* Rotating Radar Scanner */}
            <line x1="210" y1="32" x2="226" y2="30" stroke="#b45309" strokeWidth="2.5" />
            {/* Satcom Radome Dome */}
            <ellipse cx="232" cy="78" rx="6" ry="7" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
          </g>

          {/* Fore Mast (Forward / Bow) */}
          <g stroke="#52627a" strokeWidth="2" strokeLinecap="round">
            <line x1="945" y1="174" x2="945" y2="105" />
            <line x1="936" y1="124" x2="954" y2="124" />
            <line x1="945" y1="105" x2="962" y2="174" strokeWidth="1" stroke="#64748b" opacity="0.6" />
          </g>

          {/* ── NAVIGATION LIGHTS (IMO Regulations) ── */}
          {/* Masthead White Light (Forward) */}
          <circle cx="945" cy="104" r="3.5" fill="#fff" filter="url(#nav-glow)">
            <animate attributeName="opacity" values="1;0.6;1" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Masthead White Light (Aft Higher) */}
          <circle cx="216" cy="28" r="4" fill="#fff" filter="url(#nav-glow)">
            <animate attributeName="opacity" values="1;0.7;1" dur="2.8s" repeatCount="indefinite" />
          </circle>

          {/* Starboard Green Light (Facing viewer) */}
          <circle cx="274" cy="88" r="3.8" fill="#10b981" filter="url(#nav-glow)">
            <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* Stern White Light */}
          <circle cx="124" cy="192" r="3" fill="#0284c7" filter="url(#nav-glow)" />

          {/* ── HUD SENSOR SCAN LINE ── */}
          <g opacity="0.45">
            <line x1="280" y1="140" x2="970" y2="140" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="6 12" />
            <line x1="450" y1="140" x2="450" y2="260" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="4 8" />
            <line x1="720" y1="140" x2="720" y2="260" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="4 8" />
          </g>
        </svg>

        {/* ── 4 FLOATING TELEMETRY CALLOUT CARDS WITH CONNECTORS ── */}
        {/* Callout 1: VESSEL CLASS (Upper Left) */}
        <div
          onMouseEnter={() => setActiveTelemetry("class")}
          onMouseLeave={() => setActiveTelemetry(null)}
          className={`absolute left-4 top-2 sm:left-10 sm:top-6 z-20 flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-300 ${
            activeTelemetry === "class"
              ? "border-amber-400 shadow-md scale-105"
              : "border-slate-300 hover:border-amber-500 hover:shadow-md"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-900">Class</span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span className="font-mono text-[10px] font-bold text-slate-600">IMO 982143</span>
            </div>
            <p className="text-[14px] font-black text-slate-950">BULK CARRIER</p>
            <p className="font-mono text-[10px] font-semibold text-slate-600">65,000–85,000 DWT</p>
          </div>
        </div>

        {/* Callout 2: CARGO (Lower Left) */}
        <div
          onMouseEnter={() => setActiveTelemetry("cargo")}
          onMouseLeave={() => setActiveTelemetry(null)}
          className={`absolute left-6 bottom-4 sm:left-16 sm:bottom-8 z-20 flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-300 ${
            activeTelemetry === "cargo"
              ? "border-sky-400 shadow-md scale-105"
              : "border-slate-300 hover:border-sky-500 hover:shadow-md"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-900 border border-sky-300">
            <Weight size={18} />
          </div>
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-sky-900">Stem Cargo</span>
            <p className="text-[14px] font-black text-slate-950">—</p>
            <p className="font-mono text-[10px] font-semibold text-slate-600">Data unavailable</p>
          </div>
        </div>

        {/* Callout 3: UTILIZATION (Upper Right) */}
        <div
          onMouseEnter={() => setActiveTelemetry("util")}
          onMouseLeave={() => setActiveTelemetry(null)}
          className={`absolute right-4 top-2 sm:right-12 sm:top-6 z-20 flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-300 ${
            activeTelemetry === "util"
              ? "border-emerald-400 shadow-md scale-105"
              : "border-slate-300 hover:border-emerald-500 hover:shadow-md"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Gauge size={18} />
          </div>
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-900">Load Factor</span>
            <p className="text-[14px] font-black text-slate-950">—</p>
            <p className="font-mono text-[10px] font-semibold text-slate-600">Data unavailable</p>
          </div>
        </div>

        {/* Callout 4: STATUS (Lower Right) */}
        <div
          onMouseEnter={() => setActiveTelemetry("status")}
          onMouseLeave={() => setActiveTelemetry(null)}
          className={`absolute right-6 bottom-4 sm:right-20 sm:bottom-8 z-20 flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-300 ${
            activeTelemetry === "status"
              ? "border-amber-400 shadow-md scale-105"
              : "border-slate-300 hover:border-amber-500 hover:shadow-md"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
            <Navigation size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-900">Bulk cargo routes</span>
            </div>
            <p className="text-[14px] font-black text-slate-950">East Coast India</p>
            <p className="font-mono text-[10px] font-semibold text-slate-600">Vizag · Paradip · Haldia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
