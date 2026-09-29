// Reads Stage 1 source files READ-ONLY and writes compact JSON for the UI.
// Source values are never altered; missing values stay null (rendered as UNKNOWN).
// Usage: node scripts/build-stage1.mjs [path-to-STAGE1]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const S1 = resolve(process.argv[2] ?? "../STAGE1");
const OUT = resolve("src/data/generated");
mkdirSync(OUT, { recursive: true });
const read = (p) => JSON.parse(readFileSync(join(S1, p), "utf8"));
const write = (name, data) => writeFileSync(join(OUT, name), JSON.stringify(data));
const range = (dates) => { const d = dates.filter(Boolean).sort(); return d.length ? [d[0], d[d.length - 1]] : null; };
const isValid = (r) => r.validation_status === "VALID" && r.value !== null && r.value !== undefined;

// DS01 — World Bank Pink Sheet: one series per commodity
{
  const recs = read("01_COMMODITY_PRICES/data/commodity_prices_worldbank_pinksheet.json");
  const by = {};
  for (const r of recs) (by[r.entity] ??= { unit: r.unit, currency: r.currency, points: [] }).points.push([r.date, isValid(r) ? r.value : null]);
  for (const s of Object.values(by)) s.points.sort((a, b) => a[0].localeCompare(b[0]));
  write("ds01.json", { records: recs.length, valid: recs.filter(isValid).length, dateRange: range(recs.map((r) => r.date)), series: by });
}

// DS02 — macro indicators: summary per country × indicator (full series not needed by UI)
{
  const recs = read("02_MACROECONOMIC_INDICATORS/data/macroeconomic_indicators.json").records;
  const by = {};
  for (const r of recs) {
    const k = `${r.country_code}|${r.indicator_code}`;
    const s = (by[k] ??= { country: r.country_name, indicator: r.indicator_name, unit: r.unit, frequency: r.frequency, n: 0, valid: 0, first: null, last: null, latest: null });
    s.n++;
    if (!isValid(r)) continue;
    s.valid++;
    if (!s.first || r.date < s.first) s.first = r.date;
    if (!s.last || r.date > s.last) { s.last = r.date; s.latest = r.value; }
  }
  write("ds02.json", { records: recs.length, valid: recs.filter(isValid).length, dateRange: range(recs.map((r) => r.date)), rows: Object.values(by) });
}

// DS04 — port statistics: keep geographic level explicit; country rows are NOT port-level
{
  const d = read("04_PORT_STATISTICS/data/port_statistics.json");
  const rows = d.records.map((r) => ({
    level: r.geographic_level ?? (r.port_name ? "PORT" : "UNKNOWN"), country: r.port_country ?? null, port: r.port_name ?? null, year: r.year ?? null,
    tonnes: r.throughput_tonnes ?? null, teu: r.throughput_teu ?? null, calls: r.vessel_calls ?? null,
    source: r.source ?? null, dataType: r.data_type ?? null,
  }));
  write("ds04.json", { records: rows.length, rows, sourcesUsed: d.sources_used?.length ?? 0, failed: d.failed_sources.map((f) => ({ source: f.source_name, reason: f.reason })) });
}

// DS05 — India east coast infrastructure: ports and berths kept separate
{
  const d = read("05_INDIA_EAST_COAST_PORT_INFRASTRUCTURE/data/india_east_coast_port_infrastructure.json");
  const recs = Array.isArray(d) ? d : d.records;
  const flat = (r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) {
      if (v && typeof v === "object" && "value" in v) o[k] = { v: v.value ?? null, u: v.unit ?? null, s: v.status ?? null };
      else if (v === null || typeof v !== "object") o[k] = v;
    }
    return o;
  };
  const kind = (r) => (r.record_type ?? r.type ?? (r.berth_id ? "BERTH" : "PORT")).toString().toUpperCase();
  const ports = recs.filter((r) => kind(r).includes("PORT")).map(flat);
  const berths = recs.filter((r) => kind(r).includes("BERTH")).map(flat);
  write("ds05.json", { records: recs.length, ports, berths });
  console.log("DS05 ports", ports.length, "berths", berths.length, "port keys", Object.keys(ports[0] ?? {}).join(","));
}

// DS03 — AIS: aggregates per region (no raw positions shipped to the UI)
{
  const recs = read("03_AIS_VESSEL_TRAFFIC/data/ais_vessel_traffic.json").records;
  const by = {};
  for (const r of recs) {
    const g = (by[r.port_region] ??= { records: 0, vessels: new Set(), types: {}, speedSum: 0, speedN: 0, first: r.timestamp, last: r.timestamp });
    g.records++; g.vessels.add(r.mmsi);
    const t = r.vessel_type_normalized ?? "UNKNOWN"; g.types[t] = (g.types[t] ?? 0) + 1;
    if (typeof r.speed === "number") { g.speedSum += r.speed; g.speedN++; }
    if (r.timestamp < g.first) g.first = r.timestamp;
    if (r.timestamp > g.last) g.last = r.timestamp;
  }
  const regions = Object.entries(by).map(([region, g]) => ({ region, records: g.records, vessels: g.vessels.size, types: g.types, meanSpeedKn: g.speedN ? +(g.speedSum / g.speedN).toFixed(2) : null, first: g.first, last: g.last }));
  write("ds03.json", { records: recs.length, valid: recs.filter((r) => r.validation_status === "VALID").length, regions });
}

// DS07 — Baltic sub-indices (Mendeley mirror): daily series, empty cells stay null
{
  const lines = readFileSync(join(S1, "07_FREIGHT_RATES/real/mendeley_t76ckh2ygg_baltic_subindices_daily_REAL_provenance_flagged.csv"), "utf8").trim().split(/\r?\n/);
  const head = lines[0].split(",");
  const keys = ["HSI", "SI", "PI", "CI", "DTI", "CTI"];
  const rows = lines.slice(1).map((l) => {
    const c = l.split(","); const get = (k) => c[head.indexOf(k)];
    return [get("date"), ...keys.map((k) => (get(k) === "" || get(k) === undefined ? null : Number(get(k))))];
  });
  write("ds07.json", { records: rows.length, keys, provenanceFlag: lines[1].split(",")[head.indexOf("provenance")], rows });
}
console.log("Stage 1 compact JSON written to", OUT);
