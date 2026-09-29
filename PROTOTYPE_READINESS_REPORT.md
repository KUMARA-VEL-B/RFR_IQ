# RFR-IQ — Prototype Readiness Report

## Demo Flow
1. **Home, then Overview:** shows dataset health and provenance.
2. **Ports:** shows DS05 infrastructure and DS04 statistics. **Vessel:** shows DS03, which covers US ports only.
3. **Forecast:** shows the DS07 market history for 2012–2019.
4. **Decision:** enter cargo, quantity, origin and destination port. The page shows six steps (input, market, port feasibility, vessel, weather, decision) and then **ENTER / WAIT / WATCH** with the reasons.
5. **Simulator:** uses the same shipment and the same `decide()` function. It runs five scenarios: base case, high freight pressure, low freight pressure, high delivery pressure and high weather risk.

## Data Classification
| Class | Items |
|---|---|
| REAL | DS01–DS05 and DS07 records; DS05 port max DWT and coordinates |
| LIVE | Open-Meteo weather at the selected port |
| DERIVED | Market trend (DS07 last value vs its 60-point mean), weather risk level, the decision |
| SIMULATED | Simulator scenario overrides (freight pressure, delivery pressure, weather) |
| UNKNOWN / UNAVAILABLE | Vessel availability (no verified live feed); India AIS; DS06 and DS08–DS10; Kolkata/Haldia port data; any failed weather fetch |

## Limitations
- DS07 ends in July 2019. The market signal is historical context, not a current rate.
- The weather thresholds and the decision rules are prototype rules and have not been validated.
- No vessel feed is connected, so vessel availability is always UNAVAILABLE.
- DS03 covers only one US day. DS04 has 9 failed sources. Kolkata/Haldia is SOURCE FAILED in DS05.
- The Copilot was removed in the final QA pass; there is no chat or AI assistant.

## Validation
| Check | Result |
|---|---|
| `tsc --noEmit` | PASS |
| `npm run build` (single file, about 1.38 MB) | PASS |
| 8 pages at 1280px and 375px: no horizontal overflow, no "Stage N" text | PASS |
| Simulator: BASE gives ENTER, HIGH freight gives ENTER, LOW freight gives WAIT, HIGH delivery gives ENTER, HIGH weather gives WAIT; changing inputs changes all cards | PASS |
| Decision (Coal, 50,000 t, Australia to Gangavaram) with live weather gives ENTER | PASS |
| Weather API blocked gives UNAVAILABLE, with no invented values | PASS |
| Stage 1 source files unmodified; no secrets, paths or new dependencies | PASS |

## Non-Blocking Limitations
- `STAGE1_INTEGRATION_REPORT.md` still says Simulator and Decision are locked. That report is historical and was left unchanged.
- The bundle is large (1.38 MB) because the datasets are inlined.
