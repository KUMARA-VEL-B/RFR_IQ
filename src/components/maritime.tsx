import { PORTS } from "../domain/port";
import { cn } from "../utils/cn";

const PORT_XY: Record<string, { x: number; y: number }> = {
  haldia: { x: 308, y: 116 },
  paradip: { x: 286, y: 172 },
  dhamra: { x: 296, y: 202 },
  gopalpur: { x: 270, y: 248 },
  vizag: { x: 255, y: 298 },
  gangavaram: { x: 245, y: 326 },
};

const AUS = { x: 340, y: 430 };
const SAF = { x: 52, y: 400 };
const BRA = { x: 22, y: 118 };
const VIZAG = PORT_XY.vizag;

const AUS_VIZAG = `M ${AUS.x} ${AUS.y} Q ${(AUS.x + VIZAG.x) / 2 + 26} ${(AUS.y + VIZAG.y) / 2 - 8} ${VIZAG.x} ${VIZAG.y}`;
const SAF_VIZAG = `M ${SAF.x} ${SAF.y} C ${SAF.x + 62} ${SAF.y - 12}, ${VIZAG.x - 82} ${VIZAG.y + 52}, ${VIZAG.x} ${VIZAG.y}`;
const BRA_VIZAG = `M ${BRA.x} ${BRA.y} C ${BRA.x + 46} ${BRA.y + 84}, ${VIZAG.x - 104} ${VIZAG.y + 44}, ${VIZAG.x} ${VIZAG.y}`;

function routeTo(id: string, from: { x: number; y: number }): string {
  const P = PORT_XY[id] ?? VIZAG;
  if (from === AUS) return `M ${AUS.x} ${AUS.y} Q ${(AUS.x + P.x) / 2 + 26} ${(AUS.y + P.y) / 2 - 8} ${P.x} ${P.y}`;
  if (from === SAF) return `M ${SAF.x} ${SAF.y} C ${SAF.x + 62} ${SAF.y - 12}, ${P.x - 82} ${P.y + 52}, ${P.x} ${P.y}`;
  return `M ${BRA.x} ${BRA.y} C ${BRA.x + 46} ${BRA.y + 84}, ${P.x - 104} ${P.y + 44}, ${P.x} ${P.y}`;
}

export function IndiaCoastMap({ selectedId, onSelect, showRoutes = true, className }: {
  selectedId: string; onSelect: (id: string) => void; showRoutes?: boolean; className?: string;
}) {
  return (
    <svg viewBox="0 0 400 470" className={cn("w-full", className)} role="img" aria-label="East Coast India maritime corridor">
      <defs>
        <radialGradient id="iq-sea" cx="50%" cy="38%" r="80%">
          <stop offset="0%" stopColor="#e3eff9" />
          <stop offset="100%" stopColor="#cfe3f3" />
        </radialGradient>
        <linearGradient id="iq-land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#12294f" />
          <stop offset="100%" stopColor="#f4f8fc" />
        </linearGradient>
        <filter id="iq-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="400" height="470" rx="16" fill="url(#iq-sea)" stroke="rgba(15,36,64,0.08)" />
      {/* graticule */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} x1={40 * (i + 1)} y1="8" x2={40 * (i + 1)} y2="462" stroke="rgba(148,163,184,0.09)" strokeWidth="1" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="8" y1={44 * (i + 1)} x2="392" y2={44 * (i + 1)} stroke="rgba(148,163,184,0.09)" strokeWidth="1" />
      ))}

      {/* stylised India */}
      <path
        d="M118 66 C150 52 200 50 236 62 C268 72 288 92 296 118 C302 140 296 160 288 178 C300 200 296 226 284 250 C272 276 262 300 252 326 C244 348 232 366 214 372 C198 377 186 366 180 344 C172 316 164 288 156 260 C146 226 136 192 130 158 C126 130 118 96 118 66 Z"
        fill="url(#iq-land)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.2"
      />
      {/* east-coast highlight */}
      <path d="M296 118 C292 150 290 165 288 172 C292 190 296 196 298 202 C288 220 278 234 272 248 C264 272 260 285 256 298 C252 312 249 319 246 326"
        fill="none" stroke="#b45309" strokeWidth="1.6" opacity="0.4" />
      <text x="176" y="222" fontSize="10" fill="rgba(148,163,184,0.55)" letterSpacing="3" fontWeight="700">INDIA</text>
      <text x="120" y="238" fontSize="8" fill="rgba(148,163,184,0.4)" letterSpacing="1.5">EAST COAST CORRIDOR</text>
      {/* Sri Lanka + Chennai context */}
      <circle cx="212" cy="392" r="3.5" fill="rgba(148,163,184,0.4)" />
      <text x="220" y="395" fontSize="8" fill="rgba(148,163,184,0.5)">Sri Lanka</text>
      <circle cx="258" cy="350" r="2.5" fill="rgba(148,163,184,0.45)" />
      <text x="264" y="353" fontSize="8" fill="rgba(148,163,184,0.5)">Chennai</text>

      <text x="330" y="248" fontSize="9" fill="rgba(148,163,184,0.5)" letterSpacing="2.5" transform="rotate(72 330 248)">BAY OF BENGAL</text>
      <text x="86" y="446" fontSize="9" fill="rgba(148,163,184,0.5)" letterSpacing="2.5">INDIAN OCEAN</text>

      {/* compass */}
      <g opacity="0.7">
        <circle cx="52" cy="52" r="17" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.2" />
        <polygon points="52,38 56,54 52,51 48,54" fill="#b45309" />
        <text x="52" y="72" fontSize="9" fill="#52627a" textAnchor="middle" fontWeight="700">N</text>
      </g>

      {/* origin nodes */}
      {[
        { p: AUS, code: "AUS", name: "Australia" },
        { p: SAF, code: "SAF", name: "South Africa" },
        { p: BRA, code: "BRA", name: "Brazil" },
      ].map((o) => (
        <g key={o.code}>
          <rect x={o.p.x - 16} y={o.p.y - 11} width={52} height={22} rx={6} fill="rgba(15,36,64,0.06)" stroke="rgba(15,36,64,0.14)" />
          <circle cx={o.p.x - 7} cy={o.p.y} r="3" fill="#0284c7" />
          <text x={o.p.x} y={o.p.y + 3.5} fontSize="8.5" fill="#0f2440" fontWeight="700">{o.code}</text>
        </g>
      ))}

      {showRoutes && (
        <g fill="none">
          {/* base lanes to Vizag */}
          <path d={BRA_VIZAG} stroke="rgba(56,189,248,0.28)" strokeWidth="1.6" className="route-flow-slow" />
          <path d={SAF_VIZAG} stroke="rgba(56,189,248,0.34)" strokeWidth="1.6" className="route-flow-slow" />
          <path d={AUS_VIZAG} stroke="rgba(56,189,248,0.4)" strokeWidth="1.8" className="route-flow" />
          {/* active lane to selected port */}
          {PORT_XY[selectedId] && selectedId !== "vizag" && (
            <path d={routeTo(selectedId, AUS)} stroke="#b45309" strokeWidth="2.2" className="route-flow" filter="url(#iq-glow)" opacity="0.95" />
          )}
          {selectedId === "vizag" && (
            <path d={AUS_VIZAG} stroke="#b45309" strokeWidth="2" className="route-flow" filter="url(#iq-glow)" opacity="0.9" />
          )}
          {/* sailing vessels */}
          <g filter="url(#iq-glow)">
            <circle r="5" fill="#f4f8fc" stroke="#d97706" strokeWidth="2">
              <animateMotion dur="8s" repeatCount="indefinite" path={AUS_VIZAG} />
            </circle>
            <circle r="4" fill="#f4f8fc" stroke="#0284c7" strokeWidth="2" opacity="0.95">
              <animateMotion dur="13s" begin="-5s" repeatCount="indefinite" path={AUS_VIZAG} />
            </circle>
            <circle r="4" fill="#f4f8fc" stroke="#0284c7" strokeWidth="2" opacity="0.85">
              <animateMotion dur="17s" begin="-9s" repeatCount="indefinite" path={SAF_VIZAG} />
            </circle>
          </g>
        </g>
      )}

      {/* ports */}
      {PORTS.map((p) => {
        const xy = PORT_XY[p.id];
        if (!xy) return null;
        const active = p.id === selectedId;
        const dot = "#52627a";
        const anchorEnd = xy.x > 272;
        return (
          <g key={p.id} onClick={() => onSelect(p.id)} className="cursor-pointer">
            {active && <circle cx={xy.x} cy={xy.y} r="10" fill={dot} className="port-ping" />}
            <circle cx={xy.x} cy={xy.y} r="13" fill={dot} opacity={active ? 0.22 : 0.1} />
            <circle cx={xy.x} cy={xy.y} r={active ? 7.5 : 6} fill="#f4f8fc" stroke={active ? "#b45309" : dot}
              strokeWidth={active ? 2.6 : 2.2} style={{ transition: "all .2s" }} />
            <circle cx={xy.x} cy={xy.y} r="2.4" fill={active ? "#b45309" : dot} />
            <text x={anchorEnd ? xy.x - 15 : xy.x + 15} y={xy.y + 1} fontSize="11" fontWeight="800"
              fill={active ? "#d97706" : "#0f2440"} textAnchor={anchorEnd ? "end" : "start"}>{p.name}</text>
            <text x={anchorEnd ? xy.x - 15 : xy.x + 15} y={xy.y + 13} fontSize="8.5" fontFamily="IBM Plex Mono, monospace"
              fill="#52627a" textAnchor={anchorEnd ? "end" : "start"}>Port profile</text>
          </g>
        );
      })}

      {/* scale */}
      <g opacity="0.6">
        <line x1="288" y1="452" x2="352" y2="452" stroke="#52627a" strokeWidth="1.5" />
        <line x1="288" y1="448" x2="288" y2="456" stroke="#52627a" strokeWidth="1.5" />
        <line x1="352" y1="448" x2="352" y2="456" stroke="#52627a" strokeWidth="1.5" />
        <text x="320" y="444" fontSize="8" fill="#52627a" textAnchor="middle">500 nm</text>
      </g>
    </svg>
  );
}

/* ── Decision flow: MARKET → … → DECISION ────────────────────────── */
const FLOW = ["MARKET", "FORECAST", "VESSEL", "PORT", "RISK", "DECISION"];

export function DecisionFlow({ active = 5, onStepClick }: { active?: number; onStepClick?: (step: string, index: number) => void }) {
  return (
    <div className="flex flex-col gap-0 sm:flex-row sm:items-center">
      {FLOW.map((s, i) => {
        const done = i < active;
        const cur = i === active;
        const clickable = Boolean(onStepClick);
        return (
          <div key={s} className="flex flex-1 items-center gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => onStepClick?.(s, i)}
              disabled={!clickable}
              className={cn(
                "group flex items-center gap-2.5 text-left transition-all rounded-xl px-1.5 py-1",
                clickable && "hover:bg-white/[0.06] cursor-pointer"
              )}
            >
              <span className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ring-2 transition-all",
                cur ? "bg-amber-400 text-slate-950 ring-amber-400/40 shadow-[0_0_22px_rgba(251,191,36,0.5)]"
                  : done ? "bg-emerald-500/20 text-emerald-300 ring-emerald-400/40 group-hover:ring-emerald-400"
                  : "bg-white/5 text-slate-400 ring-white/10 group-hover:text-slate-200"
              )}>
                {done && !cur ? "✓" : `0${i + 1}`}
              </span>
              <span className={cn(
                "text-[11px] font-bold tracking-[0.1em] transition-colors",
                cur ? "text-amber-300" : done ? "text-emerald-300 group-hover:text-emerald-200" : "text-slate-400 group-hover:text-slate-200"
              )}>
                {s}
              </span>
            </button>
            {i < FLOW.length - 1 && (
              <>
                <div className={cn("mx-1 hidden h-px flex-1 sm:block", i < active ? "bg-gradient-to-r from-emerald-400/60 to-emerald-400/20" : "bg-white/10")} />
                <div className={cn("ml-11 h-5 w-px sm:hidden", i < active ? "bg-emerald-400/60" : "bg-white/10")} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

