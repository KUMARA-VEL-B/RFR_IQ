# RFR-IQ Complete Prototype Test Report

## Executive Result
**PASS WITH WARNINGS.** All 8 pages load and navigate, and decision cases A–D behave as `decision.ts` specifies. The freight server outage and recovery work gracefully, and lint and build pass.

One defect was found and fixed:
- **D1:** the Forecast badge wording. See the Product UI section.

No Stage 1 file needed a change.

## Environment
- **Stack:** Vite 7, React 19, TypeScript and Tailwind 4, built as a single file with hash routes.
- **Dev server:** :5199.
- **Freight mock server:** :3000, configured through `VITE_MOCK_FREIGHT_BASE_URL` in `.env.local`.
- **Browser:** the in-app browser, at 1280px and 375px.
- **Platform:** Windows 11.

## Page-by-Page
| Page | Loads | Banned terms | 1280 overflow | 375 overflow | Result |
|---|---|---|---|---|---|
| Home | yes | none | no | no | PASS |
| Overview | yes | none | no | no | PASS |
| Freight Forecast | yes | none | no | no | PASS (after D1) |
| Vessel | yes | none | no | no | PASS (shows UNAVAILABLE, "No verified live vessel feed connected.") |
| Ports | yes | none | no | no | PASS |
| Simulator | yes | none | no | no | PASS |
| Risk | yes | none | no | no | PASS |
| Decision | yes | none | no | no | PASS |

## End-to-End Decision Tests
Input for every case: Coal, 75,000 t, Australia → Paradip.

| Case | Condition | Expected | Actual | Result |
|---|---|---|---|---|
| A | Normal | ENTER (the DS07 trend is RISING: PI 1891 on 2019-07-31 vs a mean of 1469) | ENTER | PASS |
| B | High delivery pressure | ENTER (rule 3) | ENTER | PASS |
| — | Low delivery pressure | ENTER (a RISING trend takes precedence) | ENTER | PASS |
| C | High weather (Simulator) | WAIT (rule 2) | WAIT | PASS |
| — | Market LOW (Simulator) | WAIT (the effective trend becomes FALLING) | WAIT | PASS |
| — | Market HIGH (Simulator) | ENTER | ENTER | PASS |
| D | Freight server stopped | ENTER. The freight signal is marked "UNAVAILABLE: not factored in". | ENTER | PASS |

Other checks:
- **Port check:** PASS. Max DWT is 320,000, against a 75,000 t shipment.
- **`decision.ts` audit:** the rule order is port FAIL, then weather HIGH, then pressure HIGH, then the effective trend, then the pressure fallback. The freight signal is only used to break ties. The code matches the documented methodology.

## Freight Service
- **Endpoints:** health, latest, history, market-state and scenario all respond.
- **Provenance gate:** enforced by the adapter. It requires SIMULATED, `is_simulated` and DS07.
- **Scenarios:** NORMAL, RISING, FALLING, VOLATILE and SHOCK all render. None shows NaN or undefined.
- **Indices:** HSI, SI, PI and CI all selectable.
- **Outage:** Forecast, Simulator, Risk and Decision show "Freight market signal currently unavailable… Please try again." plus a "Try again" button.
- **Recovery:** after restarting the server, "Try again" brings back "CALCULATED FROM INDICATIVE DATA".

## Live Weather
The Risk page shows "Source: Open-Meteo (weather, not freight data)" with a Live badge. Risk is LOW and wind is 8.1 km/h.

Paradip has no port coordinates in the dataset. Weather for that route therefore shows "UNAVAILABLE: not factored in", which is honest and not fabricated.

## Vessel / Port
- **Vessel:** there is no verified live vessel feed, so it shows UNAVAILABLE. By design, nothing is fabricated.
- **Port:** capacity data comes from the generated datasets and the check works.

## Risk
Risk renders Open-Meteo weather, and the indicative freight volatility card sits in a separate card.

## Simulator
Every control responds:
- Pressure: LOW, NORMAL, HIGH.
- Market: BASE, HIGH, LOW.
- Weather: LIVE, HIGH.
- Index: HSI, SI, PI, CI.
- Scenario: the five listed above.

The decision updates according to the rules.

## Error Handling
- **Server down:** the page shows the unavailable message and "Try again", with no technical text, no ECONNREFUSED in the UI and no fallback values.
- **Adapter code paths:** timeout (8 s), HTTP errors, malformed JSON and missing configuration are all handled. These were verified in the earlier integration tests.

## Console
The only errors are `net::ERR_CONNECTION_REFUSED`, from the browser network layer during the deliberate Case D outage. The app itself logs no errors.

## Network
Freight requests go only to the configured base URL. React StrictMode in development produces duplicate aborted requests, which is expected.

## Data Integrity
- `Math.random` appears only in `HeroShipCanvas.tsx`, for decorative background particles. It is not used for any data.
- No invented values. When data is missing, the page shows UNAVAILABLE or "Not available".
- The historical DS07 series and the simulated series are kept separate.

## Product UI
- **D1 (fixed):** the `Forecast.tsx` badge read "MODEL-DEVELOPMENT", which is internal wording. It now reads "EXPERIMENTAL / MODEL-BASED". Retested: PASS.
- No banned terms appear on any page. Freight is labelled "Indicative", never live or a market price.

## Performance
The build is `dist/index.html` at 1,376.93 kB (gzip 339.75 kB), over Vite's 500 kB advisory. This was already the case with the single-file build.

## Security/Configuration
- A grep of `src` for api_key, secret, token and password assignments found no matches.
- The only environment value is the freight base URL.
- No file paths or secrets are rendered in the UI.

## Known Limitations
1. The DS07 historical data ends 2019-07-31.
2. The freight signal is indicative (simulated), not live market data.
3. There is no live vessel feed.
4. Paradip has no coordinates, so live weather is unavailable for that route.
5. The bundle size is over the advisory, as above.
6. npm audit reports vulnerabilities in existing dependencies. No dependencies were changed.

## Stage 1 Integrity
None of the following were modified: `src/data/generated/`, `datasetRegistry.ts`, `mockFreightService.ts`, the mock server, `STAGE1_*`, `soul.md`, `freightiq-main.zip`, TEST1 or `docs/archive`. Only `src/pages/Forecast.tsx` was edited, for D1.

## Build
- `npm run lint`: pass.
- `npm run build`: pass.

## Final Status
PASS WITH WARNINGS
