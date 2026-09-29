import type { ReactNode } from "react";
import { Card, StatusBadge } from "./ui";
import type { FreightState, MarketState } from "../services/mockFreightService";

// Shared SIMULATED-freight renderers. Never shows a value unless the adapter validated it.
export function FreightStatus<T>({ st, retry, children }: { st: FreightState<T>; retry: () => void; children: (d: T) => ReactNode }) {
  if (st.status === "loading") return <p className="text-[13px] text-slate-500">Loading market signal…</p>;
  if (st.status === "ok") return <>{children(st.data)}</>;
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
      <StatusBadge tone="slate">Unavailable</StatusBadge>
      <span>Freight market signal currently unavailable. Market data is temporarily unavailable. Please try again.</span>
      <button className="font-bold text-sky-700 underline cursor-pointer" onClick={retry}>Try again</button>
    </div>
  );
}

const pct = (x: number) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(2)}%`;

export function MarketStateCard({ ms, title = "Indicative market signal", className }: { ms: FreightState<MarketState> & { retry: () => void }; title?: string; className?: string }) {
  return (
    <Card title={title} subtitle="Indicative only · not a market price or broker quote" className={className}
      action={<StatusBadge tone="amber">Indicative</StatusBadge>}>
      <FreightStatus st={ms} retry={ms.retry}>{(d) => (<>
        <p className="mb-2 text-[11px] font-bold tracking-wide text-amber-800">CALCULATED FROM INDICATIVE DATA</p>
        <dl className="grid grid-cols-2 gap-2 text-[13px] sm:grid-cols-3">
          {([["Index", d.index], ["Indicative level", d.latest_value.toFixed(1)], ["Trend", d.trend], ["Change 1d", pct(d.change_1d)],
            ["Change 7d", pct(d.change_7d)], ["Volatility", d.volatility.toFixed(4)]] as const).map(([k, v]) => (
            <div key={k}><dt className="text-slate-500">{k}</dt><dd className="font-bold text-slate-900">{v}</dd></div>
          ))}
        </dl>
      </>)}</FreightStatus>
    </Card>
  );
}
