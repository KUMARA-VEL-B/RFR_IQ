import {
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";
import type { FreightPoint } from "../domain/freight";
import { cn } from "../utils/cn";

export default function FreightChart({ data = [], caption, compact = false }: {
  data?: FreightPoint[]; caption?: string; compact?: boolean;
}) {
  const h = compact ? "h-[260px]" : "h-[320px] sm:h-[360px]";
  return (
    <div>
      {data.length === 0 ? (
        <div className={cn("flex w-full items-center justify-center rounded-xl border border-dashed border-slate-400/40 text-[13px] font-medium text-slate-500", h)}>
          Data unavailable
        </div>
      ) : (
        <div className={cn("w-full", h)}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.14)" strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#52627a" }} tickLine={false} axisLine={{ stroke: "rgba(15,36,64,0.1)" }} interval="preserveStartEnd" minTickGap={28} />
              <YAxis tick={{ fontSize: 10, fill: "#52627a", fontFamily: "IBM Plex Mono, monospace" }} tickLine={false} axisLine={false} width={52} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid rgba(15,36,64,0.12)", background: "#f4f8fc", fontSize: 12, color: "#0f2440" }}
                labelFormatter={(_, payload) => (payload?.[0]?.payload?.date as string) ?? ""}
              />
              {!compact && <Legend wrapperStyle={{ fontSize: 11, color: "#52627a" }} />}
              <Area type="monotone" dataKey="upper" stroke="none" fill="#10b981" fillOpacity={0.12} legendType="none" tooltipType="none" connectNulls />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#f4f8fc" fillOpacity={1} legendType="none" tooltipType="none" connectNulls />
              <Line type="monotone" dataKey="historical" stroke="#0284c7" strokeWidth={2.5} dot={false} name="Historical" connectNulls />
              <Line type="monotone" dataKey="forecast" stroke="#059669" strokeWidth={2.5} strokeDasharray="7 4" dot={false} name="Forecast" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
      {caption && <p className="mt-2 font-mono text-[10px] tracking-wide text-slate-500">{caption}</p>}
    </div>
  );
}
