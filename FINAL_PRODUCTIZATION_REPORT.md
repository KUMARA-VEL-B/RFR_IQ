# RFR-IQ Final Productization Report

## Productization Result
All 8 pages load and navigate at 1280px and 375px. No banned internal terminology is rendered, and nothing overflows horizontally. The freight signal fails gracefully when unavailable.

## User-Facing Cleanup
- `WorkflowModal.tsx`: "Decision Architecture" → "Decision Framework".
- `Home.tsx`: "Core Architecture" → "Core Framework", "Watch Architecture" → "Watch Framework".
- `Forecast.tsx`: the limitation text inherited from the registry ("…supported by DS07.") is rendered as "…supported by the historical data." This is a display-only replace; `datasetRegistry.ts` is untouched.
- `Simulator.tsx`: the scenario card subtitle now reads "Planning assumptions, separate from observed conditions; not a forecast."
- `FreightSignal.tsx` (earlier pass): labels are "Indicative market signal" and "Indicative only · not a market price or broker quote", with a clean unavailable message and a "Try again" button.

## Navigation
Home, Overview, Freight Forecast, Vessel, Ports, Simulator, Risk and Decision were all reached by hash navigation, and each renders content.

## Browser QA
Banned-term regex scanned on `document.body.innerText` of every page: Stage 1–6, DS01–DS10, backend, frontend, mock, synthetic generator, localhost, API endpoint, integration pending/awaiting integration, prototype, developer, implementation, architecture, pipeline, Copilot, AI assistant, fake telemetry, ECONNREFUSED.

### Desktop — 1280px
| Page | Banned hits | scrollWidth / innerWidth |
|---|---|---|
| Home, Overview, Forecast, Vessel, Ports, Simulator, Risk, Decision | none | 1271 / 1280 (no overflow) |

- **Decision:** the rendered output includes ENTER, WAIT and WATCH verdict states.
- **Forecast, Simulator, Risk:** "Indicative" labelling is present.

### Mobile — 375px
| Page | Banned hits | scrollWidth |
|---|---|---|
| All 8 pages | none | 375 (no overflow) |

- **Simulator:** the scenario buttons respond; clicking RISING switches the scenario. "Planning assumptions" is shown.
- **Forecast, Simulator, Risk:** the unavailable message and "Try again" are shown while the freight server is down.

## Console / Runtime
- The page was reloaded before checking.
- The only errors are `net::ERR_CONNECTION_REFUSED` from the browser's network layer, caused by the freight server being intentionally down. The app itself logs nothing and shows no technical text.
- The Vite "Failed to reload Copilot.tsx" entry and the 404 are stale, left over from the earlier file deletion.
- The StrictMode duplicate/aborted requests are ignored as expected in development.

## Freight Signal
It is labelled indicative, not live or a market price. No value is shown unless the adapter validated it.

## Error Handling
With the freight server down, Forecast, Simulator and Risk show "Freight market signal currently unavailable… Please try again." plus a "Try again" button.
- There are no fabricated fallback values.
- No ECONNREFUSED or other technical error is rendered.
- Decision runs without the freight signal.

## Copilot
Removed. There is no Copilot, chat or AI assistant in the DOM or the source.

## Stage 1 Integrity
No Stage 1 file needed a change. This pass did not modify `src/data/generated`, `datasetRegistry.ts`, `mockFreightService.ts`, the mock server, `STAGE1_*`, `soul.md`, `freightiq-main.zip`, TEST1 or `docs/archive`. These files are untracked in git, so this rests on the edit record rather than a git diff.

## Build
- `npm run lint`: pass.
- `npm run build`: pass. `dist/index.html` is 1,376.94 kB (gzip 339.75 kB).

## Remaining Warnings
1. The bundle size is over Vite's 500 kB advisory, as a single-file build. This was already the case.
2. npm audit reports vulnerabilities in existing dependencies. No dependencies were changed.
3. The historical data ends 2019-07-31.
4. The freight signal is indicative, not a live market price.

The dev server on :5199 was already running before this pass. It was attached to, not started, and the preview session was stopped afterwards. No mock server was running.

## Final Status
PASS WITH WARNINGS
