import { useState } from "react";
import { Card, PageHead, ProvenanceBadge, SegButtons, StatusBadge } from "../components/ui";
import FreightChart from "../components/FreightChart";
import { dataset, ds07 } from "../data/registry/datasetRegistry";
import { useFreightHistory, type FreightIndex } from "../services/mockFreightService";
import { FreightStatus } from "../components/FreightSignal";
import type { PageKey } from "../components/Layout";

export default function Forecast(_props: { go: (p: PageKey) => void }) {
  const [key, setKey] = useState(ds07.keys[0]);
  const idx = ds07.keys.indexOf(key);
  const meta = dataset("DS07");
  const [fi, setFi] = useState<FreightIndex>("PI");
  const h = useFreightHistory(fi, 60);
  const data = ds07.rows.map((r, i) => ({ day: i, label: r[0] as string, date: r[0] as string, historical: (r[idx + 1] as number | null) ?? undefined }));

  return (
    <div>
      <PageHead title="Historical Market Context 2012–2019" subtitle="Historical Freight Market · history only, no forecast" eyebrow="Forecast · Market history" />
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge tone="amber">EXPERIMENTAL / MODEL-BASED</StatusBadge>
        <StatusBadge tone="slate">INDIA ROUTE DATA: NOT AVAILABLE</StatusBadge>
        <ProvenanceBadge p={meta.provenance} />
      </div>
      <Card title={`${key} daily index`} subtitle={`${meta.dateRange?.join(" → ")} · ${meta.records} rows`} action={<SegButtons options={ds07.keys} value={key} onChange={setKey} size="sm" />}>
        <FreightChart data={data} caption="Source: historical freight index data" />
      </Card>
      <Card title="Indicative market signal" subtitle="Indicative series; kept separate from the historical reference above" className="mt-4"
        action={<SegButtons options={["HSI", "SI", "PI", "CI"] as FreightIndex[]} value={fi} onChange={setFi} size="sm" />}>
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge tone="amber">Indicative</StatusBadge>
          <StatusBadge tone="slate">NOT A REAL FORECAST</StatusBadge>
          <StatusBadge tone="slate">NO INDIA ROUTE PRICES</StatusBadge>
        </div>
        <FreightStatus st={h} retry={h.retry}>{(rows) => (
          <FreightChart data={rows.map((r, i) => ({ day: i, label: r.date, date: r.date, historical: r.level }))} caption={`Indicative ${fi} · ${rows.length} points · illustrative dates, not market dates`} />
        )}</FreightStatus>
      </Card>
      <Card title="Limitations" className="mt-4">
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-slate-700">
          {meta.limitations.map((l) => <li key={l}>{l.replace(/ by DS\d+/, " by the historical data")}</li>)}
          <li>No calibrated uncertainty bands; history only.</li>
        </ul>
      </Card>
    </div>
  );
}
