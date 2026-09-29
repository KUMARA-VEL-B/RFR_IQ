# RFR-IQ Architecture Cleanup Report

## 1. Objective
Remove the fake data and mock decision logic left over from the prototype. The goal is a clean UI shell that is ready to receive Stage 1 data. The light liquid-glass UI, layout, charts and accessibility are kept.

## 2. Scope and Constraints
- Scope: TEST2 only.
- STAGE1, TEST1, `soul.md` and `freightiq-main.zip` were not used, referenced or modified.
- Added nothing that fabricates data: no backend, database, live APIs or ML.
- Missing data is shown as missing, and unknown values stay unknown.

## 3. Removed
- `src/data/*`: mock market, port, vessel and risk datasets.
- `src/engine/decisionEngine.ts`: the fake scoring and recommendation engine.
- `src/utils/dateUtils.ts`: only the mock data used it.
- Fake UI content:
  - scores, confidence values and ₹ figures
  - Panamax
  - the "CHART NOW" verdict
  - the ticker
  - "live", "AI" and "real-time" claims
  - all "FreightIQ" branding, now RFR-IQ
- `node_modules` and `dist` were deleted. Running validation regenerated them from `package.json`.

## 4. Refactored
- The 8 pages (Home, Overview, Forecast, Vessel, Ports, Simulator, Risk, Decision) no longer compute values. They show only the approved placeholders.
- `FreightChart` renders an "Awaiting Stage 1 data" state when it has no data. It keeps the recharts rendering path for later use.
- `Copilot`, `Layout`, `maritime` and `ui` components have had their fake content removed. Their visual styling is unchanged.
- An orphaned keyframe body was removed from `index.css`; it had been breaking the Tailwind build.

## 5. Preserved
- The liquid-glass styling, layout, navigation (hash router) and responsive behaviour.
- The hero image and the decorative hero canvas. The canvas uses `Math.random` for particle animation only; no data comes from it.
- Accessibility attributes.

## 6. Architecture Created
- `src/domain/freight.ts`: lane and vessel vocabulary, plus the `FreightPoint` series contract. It holds no values.
- `src/domain/port.ts`: port identities and schematic map positions only.
- `src/types/provenance.ts`:
  - the `Provenance` enum (REAL, SYNTHETIC, DERIVED, SIMULATED, ESTIMATED, UNKNOWN)
  - a `DatasetMetadata` contract whose fields are nullable
- `docs/archive/`: the 3 historical reports.
- `README.md`: rewritten for the current system and future integration.

## 7. Validation
| Check | Result |
|---|---|
| `npm install` | PASS |
| Lint (`tsc --noEmit`) | PASS |
| Build (`tsc --noEmit && vite build`) | PASS |
| Runtime: 8 routes at 1280px | PASS |
| Runtime: 8 routes at 375px (no horizontal overflow) | PASS |
| Console errors | PASS (none) |
| Source audit grep (FreightIQ, Panamax, ₹, CHART NOW, ticker, live, AI, real-time) | PASS |
| `soul.md` SHA-256 unchanged | PASS |
| `freightiq-main.zip` SHA-256 unchanged | NOT TESTED (file not found under SIH26006) |

## 8. Remaining Issues
- Every metric shows a placeholder, because no dataset is connected yet. This is by design.
- The `Provenance` and `DatasetMetadata` types are not yet attached to any rendered value.
- The Simulator and Decision controls are UI-only. Their inputs do not drive any computation.
- `node_modules` and `dist` exist again because validation regenerated them.

## 9. Stage 1 Readiness
Ready.
- Stage 1 integration should produce `FreightPoint[]` together with `DatasetMetadata`.
- Pages should replace each placeholder only when validated, provenance-tagged data exists.
