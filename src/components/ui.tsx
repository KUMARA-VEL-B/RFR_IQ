import type { ReactNode } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "../utils/cn";
import { weatherRisk, type WeatherState } from "../services/liveWeatherService";
import type { MarineState } from "../services/liveMarineService";
import type { FxState } from "../services/liveFxService";
import { useCurrency } from "../state/currency";
import { CurrencyToggle } from "./CurrencyToggle";

/* ── Operational KPI card ── */
export function KpiCard({ label, value, sub, delta, deltaDir, icon }: {
  label: string; value: string; sub?: string;
  delta?: string; deltaDir?: "up" | "down" | "flat";
  icon?: ReactNode; accent?: string;
}) {
  return (
    <div className="cmd-panel cmd-panel-hover anim-fade-up relative overflow-hidden rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-100 bg-sky-50/80 text-sky-700 shadow-xs">
            {icon}
          </span>
        )}
      </div>
      <p className="tnum mt-1.5 font-mono text-[21px] font-extrabold tracking-tight text-slate-900">{value}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {delta && (
          <span className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold ring-1",
            deltaDir === "up" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : deltaDir === "down" ? "bg-rose-50 text-rose-800 ring-rose-200" : "bg-slate-100 text-slate-700 ring-slate-200"
          )}>
            {deltaDir === "up" ? <TrendingUp size={12} /> : deltaDir === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}
            {delta}
          </span>
        )}
        {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}

/* ── Badges (Light Liquid Glass) ── */
export function RiskBadge({ level, size = "md" }: { level: string; size?: "sm" | "md" }) {
  const map: Record<string, string> = {
    Low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    LOW: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    Medium: "bg-amber-50 text-amber-800 ring-amber-200",
    MEDIUM: "bg-amber-50 text-amber-800 ring-amber-200",
    MODERATE: "bg-amber-50 text-amber-800 ring-amber-200",
    High: "bg-rose-50 text-rose-800 ring-rose-200",
    HIGH: "bg-rose-50 text-rose-800 ring-rose-200",
    Critical: "bg-red-50 text-red-800 ring-red-200",
    CRITICAL: "bg-red-50 text-red-800 ring-red-200",
    BULLISH: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    BEARISH: "bg-rose-50 text-rose-800 ring-rose-200",
    STABLE: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  const dot =
    level.toLowerCase().includes("low") || level === "BULLISH" ? "bg-emerald-600" :
    level.toLowerCase().includes("medium") ? "bg-amber-600" :
    level.toLowerCase().includes("high") ? "bg-rose-600" :
    level === "STABLE" ? "bg-slate-500" : "bg-red-600";
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-bold ring-1 ring-inset shadow-2xs",
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
      map[level] ?? "bg-slate-100 text-slate-700 ring-slate-200"
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {level}
    </span>
  );
}

export function StatusBadge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "slate" | "navy" | "saffron" | "red" | "rose" }) {
  const tones: Record<string, string> = {
    blue: "bg-sky-50 text-sky-800 ring-sky-200",
    green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    navy: "bg-slate-900 text-white ring-slate-800",
    saffron: "bg-amber-100 text-amber-900 ring-amber-300",
    red: "bg-rose-50 text-rose-800 ring-rose-200",
    rose: "bg-rose-50 text-rose-800 ring-rose-200",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset shadow-2xs", tones[tone])}>{children}</span>;
}

/* ── Light glass panel shell ── */
export function Card({ title, subtitle, action, children, className, pad = true }: {
  title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string; pad?: boolean;
}) {
  return (
    <section className={cn("cmd-panel anim-fade-up relative overflow-hidden rounded-2xl", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 bg-white/40 px-5 py-4">
          <div>
            {title && <h3 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-slate-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-[12px] text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(pad && "p-5")}>{children}</div>
    </section>
  );
}

/* ── Form controls (Light Liquid Glass) ── */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export const selectCls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[13px] font-medium text-slate-900 shadow-xs outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 [&>option]:bg-white [&>option]:text-slate-900";

export function SegButtons<T extends string | number>({ options, value, onChange, size = "md" }: {
  options: readonly T[] | T[]; value: T; onChange: (v: T) => void; size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={String(o)}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-lg border font-bold transition-all cursor-pointer shadow-2xs",
            size === "sm" ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-[12px]",
            value === o
              ? "border-sky-600 bg-sky-600 text-white shadow-xs"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}


/* ── Command page heading ── */
export function PageHead({ title, subtitle, eyebrow, right }: {
  title: string; subtitle: string; eyebrow?: string; right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-700">
          <span className="inline-block h-px w-6 bg-sky-500" />
          {eyebrow ?? "Maritime Decision Intelligence"}
        </p>
        <h1 className="mt-1.5 text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-[26px]">{title}</h1>
        <p className="mt-1 text-[13px] text-slate-600">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

const PROV_LABEL: Record<string, string> = { REAL: "Validated Data", HISTORICAL: "Historical", SIMULATED: "Indicative", LIVE: "Live", UNAVAILABLE: "Unavailable", DERIVED: "Calculated", UNKNOWN: "Not available" };
export function ProvenanceBadge({ p }: { p: string }) {
  return <StatusBadge tone={p === "REAL" || p === "LIVE" ? "green" : p === "UNKNOWN" || p === "UNAVAILABLE" ? "slate" : p === "DERIVED" ? "blue" : "amber"}>{PROV_LABEL[p] ?? "Not available"}</StatusBadge>;
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white/70">
      <table className="w-full min-w-max text-left text-[12px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-700">
            {head.map((h) => <th key={h} className="px-3 py-2.5 font-bold">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-sky-50/40 transition-colors">
              {r.map((c, j) => <td key={j} className="px-3 py-2 align-top text-slate-800">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cleanLimit = (l: string) => l
  .replace(/SOURCE FAILED/g, "information unavailable").replace(/ DS\d+ /g, "the historical data")
  .replace(/India AIS/g, "India vessel positions").replace(/UI shows/g, "Shows");
export function Limitations({ items }: { items: string[] }) {
  return (
    <Card title="Limitations" className="mt-4">
      <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-slate-700">{items.map((l) => <li key={l}>{cleanLimit(l)}</li>)}</ul>
    </Card>
  );
}

/* ── Live weather (Open-Meteo) ── */
export function WeatherCard({ port, w }: { port: string; w: WeatherState }) {
  const risk = weatherRisk(w.status === "ok" ? w.data : null);
  const f = (v: number | null, u: string) => (v == null ? "Unavailable" : `${v} ${u}`);
  return (
    <Card title={`Weather · ${port}`} subtitle="Source: Open-Meteo (weather, not freight data)"
      action={<div className="flex items-center gap-1.5"><ProvenanceBadge p={w.status === "ok" ? "LIVE" : "UNAVAILABLE"} /><RiskBadge level={risk} size="sm" /><ProvenanceBadge p="DERIVED" /></div>}>
      {w.status === "loading" && <p className="text-[13px] text-slate-500">Loading live weather…</p>}
      {w.status === "unavailable" && <p className="text-[13px] text-slate-600"><b>Weather unavailable</b> · {w.message}</p>}
      {w.status === "error" && <p className="text-[13px] text-slate-600"><b>Weather unavailable</b> · Unable to retrieve live weather right now.</p>}
      {w.status === "ok" && (
        <div className="grid grid-cols-2 gap-3 text-[13px] text-slate-700 sm:grid-cols-4">
          <div><Field label="Wind">{f(w.data.wind, "km/h")}</Field></div>
          <div><Field label="Gusts">{f(w.data.gusts, "km/h")}</Field></div>
          <div><Field label="Rain probability">{f(w.data.rainProb, "%")}</Field></div>
          <div><Field label="Temperature">{f(w.data.temp, "°C")}</Field></div>
          <p className="col-span-full text-[11px] text-slate-500">Updated {w.data.time.replace("T", " ")} IST · risk from weather thresholds</p>
        </div>
      )}
    </Card>
  );
}

/* ── Live Marine Oceanography (Open-Meteo Marine) ── */
export function MarineCard({ port, m }: { port: string; m: MarineState }) {
  const f = (v: number | null, u: string) => (v == null ? "Unavailable" : `${v.toFixed(2)} ${u}`);
  const berthingTone =
    m.status === "ok"
      ? m.data.berthingSafety === "SAFE"
        ? "green"
        : m.data.berthingSafety === "CAUTION"
        ? "amber"
        : "slate"
      : "slate";

  return (
    <Card
      title={`Ocean & Sea Conditions · ${port}`}
      subtitle="Source: Open-Meteo Marine (Live sea surface waves & swell)"
      action={
        <div className="flex items-center gap-1.5">
          <ProvenanceBadge p={m.status === "ok" ? "LIVE" : "UNAVAILABLE"} />
          {m.status === "ok" && (
            <StatusBadge tone={berthingTone}>
              {m.data.berthingSafety === "SAFE"
                ? "Normal Berthing"
                : m.data.berthingSafety === "CAUTION"
                ? "Swell Caution"
                : "Swell Advisory"}
            </StatusBadge>
          )}
          <ProvenanceBadge p="DERIVED" />
        </div>
      }
    >
      {m.status === "loading" && <p className="text-[13px] text-slate-500">Loading live marine data…</p>}
      {m.status === "unavailable" && (
        <p className="text-[13px] text-slate-600"><b>Marine data unavailable</b> · {m.message}</p>
      )}
      {m.status === "error" && (
        <p className="text-[13px] text-slate-600"><b>Marine data unavailable</b> · Unable to retrieve live oceanographic conditions right now.</p>
      )}
      {m.status === "ok" && (
        <div className="grid grid-cols-2 gap-3 text-[13px] text-slate-700 sm:grid-cols-4">
          <div><Field label="Wave Height">{f(m.data.waveHeight, "m")}</Field></div>
          <div><Field label="Swell Height">{f(m.data.swellHeight, "m")}</Field></div>
          <div><Field label="Wave Period">{m.data.wavePeriod ? `${m.data.wavePeriod.toFixed(1)} s` : "Unavailable"}</Field></div>
          <div><Field label="Sea State">{m.data.seaState}</Field></div>
          <p className="col-span-full text-[11px] text-slate-500">
            Updated {m.data.time.replace("T", " ")} IST · Douglas Sea State scale · Wave direction {m.data.waveDirection ?? "—"}°
          </p>
        </div>
      )}
    </Card>
  );
}

/* ── Live Foreign Exchange & Bunker Rates ── */
export function LiveFxCard({ fx }: { fx: FxState & { retry?: () => void } }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <Card
      title="Live Foreign Exchange Rates & Currency Converter"
      subtitle="Source: ExchangeRate-API / European Central Bank (Open Public Feeds)"
      action={
        <div className="flex items-center gap-2">
          <CurrencyToggle showRateBadge size="sm" />
          <ProvenanceBadge p={fx.status === "ok" ? "LIVE" : "UNAVAILABLE"} />
          {fx.retry && (
            <button
              onClick={fx.retry}
              className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer"
            >
              Refresh
            </button>
          )}
        </div>
      }
    >
      {fx.status === "loading" && <p className="text-[13px] text-slate-500">Loading live exchange rates…</p>}
      {fx.status === "error" && (
        <p className="text-[13px] text-slate-600"><b>Exchange rates unavailable</b> · {fx.message}</p>
      )}
      {fx.status === "ok" && (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              onClick={() => setCurrency(currency === "USD" ? "INR" : "USD")}
              className={`rounded-xl border p-3 cursor-pointer transition-all hover:shadow-xs ${
                currency === "INR"
                  ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                  : "border-sky-500/30 bg-sky-50/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">USD / INR</span>
                <span className="rounded bg-white px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-800 shadow-2xs">
                  Active {currency}
                </span>
              </div>
              <p className="tnum mt-1 font-mono text-[20px] font-bold text-sky-900">
                {fx.data.INR != null ? `₹${fx.data.INR.toFixed(2)}` : "Unavailable"}
              </p>
              <span className="text-[10px] text-slate-600">Click to switch USD/INR</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/50 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">USD / SGD</span>
              <p className="tnum mt-1 font-mono text-[20px] font-bold text-slate-800">
                {fx.data.SGD != null ? `$${fx.data.SGD.toFixed(3)}` : "Unavailable"}
              </p>
              <span className="text-[10px] text-slate-500">Singapore bunker benchmark</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/50 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">USD / AUD</span>
              <p className="tnum mt-1 font-mono text-[20px] font-bold text-slate-800">
                {fx.data.AUD != null ? `$${fx.data.AUD.toFixed(3)}` : "Unavailable"}
              </p>
              <span className="text-[10px] text-slate-500">Australia bulk coal origin</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/50 p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">USD / ZAR</span>
              <p className="tnum mt-1 font-mono text-[20px] font-bold text-slate-800">
                {fx.data.ZAR != null ? `R ${fx.data.ZAR.toFixed(2)}` : "Unavailable"}
              </p>
              <span className="text-[10px] text-slate-500">South Africa RBCT coal</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            Feed: {fx.data.source} · Last updated {fx.data.lastUpdated} · Click USD/INR card or toggle above to switch currencies
          </p>
        </div>
      )}
    </Card>
  );
}

