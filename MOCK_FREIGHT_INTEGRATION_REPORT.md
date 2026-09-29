# Mock Freight Integration Report

**Final status: PASS WITH WARNINGS**

## 1. Architecture
TEST2 (Vite/React) talks to the standalone DS07 Synthetic Freight Mock Server over HTTP only. No server code, data or zip contents were copied into TEST2. Pages consume the adapter via hooks; the adapter is the single point that knows the URL.

## 2. Adapter
`src/services/mockFreightService.ts`
- `getLatestFreight(index)`, `getFreightHistory(index, days)`, `getMarketState(index)`, `getFreightScenario(index, scenario)`
- 8 s timeout (AbortController), caller abort supported.
- Validates every payload: index match, ISO date, finite positive level, finite log_return, market-state fields, trend enum, and provenance gate (`provenance === "SIMULATED"`, `is_simulated === true`, `reference_dataset === "DS07"`).
- Returns `FreightState<T>`: `loading | ok | invalid{reason} | unavailable{reason}`.
- Hooks `useMarketState`, `useFreightHistory`, `useFreightScenario` expose `retry()`.
- Shared UI badge/fallback in `src/components/FreightSignal.tsx`.

## 3. Environment variable
`VITE_MOCK_FREIGHT_BASE_URL` (typed in `src/vite-env.d.ts`), set in `.env.local` = `http://localhost:3000`; documented in `.env.example`. If unset, every call returns UNAVAILABLE ("VITE_MOCK_FREIGHT_BASE_URL is not configured"); no default URL exists in code.

## 4. Endpoints
- `GET /api/freight/health`
- `GET /api/freight/latest?index=`
- `GET /api/freight/history?index=&days=`
- `GET /api/freight/market-state?index=`
- `GET /api/freight/scenario?index=&scenario=NORMAL|RISING|FALLING|VOLATILE|SHOCK`

## 5. Provenance
Three classes kept separate in UI and code:
| Class | Source | Label |
|---|---|---|
| HISTORICAL | DS07 (2012-08-01 → 2019-07-31) | HISTORICAL |
| LIVE | Open-Meteo weather only | LIVE (weather, not freight) |
| SIMULATED | Mock server | SIMULATED / DERIVED FROM SIMULATED DATA |

No simulated value is labelled LIVE, REAL-TIME, ACTUAL, CURRENT MARKET PRICE, BALTIC LIVE, BROKER QUOTE or INDIA ROUTE RATE.

## 6. Failure handling
- Server down → UNAVAILABLE "server unreachable" + Retry button; no console errors; no fallback values.
- Timeout → UNAVAILABLE "timeout after 8s".
- Non-2xx → UNAVAILABLE "HTTP <code>".
- Bad JSON / schema / provenance → INVALID with the exact reason.
- Missing values are never turned into 0, PASS, FALSE or invented numbers. Stale data is dropped when inputs change.

## 7. Historical vs simulated
DS07 historical series and generated data (`src/data/generated/`) are untouched and remain the only source for historical charts. Simulated series render in separate cards with synthetic-date captions. They are never merged into historical series.

## 8. Forecast
A separate "Simulated mock signal" section, captioned "SIMULATED PI · 60 synthetic points · dates are synthetic, not market dates". The historical forecast is unchanged.

## 9. Decision
Shows "Freight signal: SIMULATED" and "DERIVED FROM SIMULATED DATA". `src/domain/decision.ts` takes an optional `simulatedFreight` input that is used only as a tie-breaker and is shown in the flow as "Simulated mock PI level … (DS07-derived synthetic, not a market price)". If it is unavailable, the decision runs without it.

## 10. Simulator
"SIMULATED SCENARIO · mock freight path" card, captioned "SIMULATED <SCENARIO> scenario · <index> · 30 synthetic points · not market prices".

## 11. Risk
"SIMULATED FREIGHT VOLATILITY · <index>" card with "DERIVED FROM SIMULATED DATA": level, trend, 1d/7d change, volatility. It sits next to the Open-Meteo LIVE weather card, which stays labelled as weather, not freight.

## 12. Copilot (removed)
The Copilot integration was removed in the final QA pass (see FINAL_QA_REPORT.md). No chat or AI assistant remains.

## 13. Desktop (1280px)
Decision, Forecast, Simulator and Risk were verified in the browser: labels present and the layout intact.

## 14. Mobile (375px)
Simulator and Risk: `scrollWidth` = 375, so there is no horizontal overflow, and the cards render.

## 15. Build / lint
- `npm run lint`: pass.
- `npm run build`: pass. Warning: the main chunk is about 1,388 kB (gzip 342 kB), which is over Vite's 500 kB advisory. This is pre-existing and not caused by this integration.

Tests run:
- 10 invalid-payload cases, all INVALID with a reason.
- Missing env var gives UNAVAILABLE.
- Server stopped gives UNAVAILABLE plus Retry.
- Server restarted: the data returns on reload/retry.

## 16. Limitations
- DS07 historical data ends 2019-07-31.
- The mock is SIMULATED, not live market data.
- No India route rates, no broker quotes, and no Baltic Exchange data.
- Prototype only; not for commercial decisions.
- No future prices are produced or implied. Synthetic dates are not market dates.
- The index is chosen by quantity band (CI ≥100k, PI ≥60k, SI ≥35k, else HSI), which is a heuristic.
- DS06 and DS08–10 were not fabricated.
