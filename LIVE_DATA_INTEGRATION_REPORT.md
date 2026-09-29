# RFR-IQ — Live Data Integration Report

## Endpoint
- The app calls `GET https://api.open-meteo.com/v1/forecast` from `src/services/liveWeatherService.ts`.

## Why This Endpoint
- It is free and needs no API key.
- It supports CORS, so the browser can call it directly with no backend.
- It returns current conditions in one call.
- Open-Meteo provides weather data only. It is **not** a freight, AIS or port data source.

## Key Requirement
- No API key is needed. The app has no environment variables and no secrets.

## Variables
- **current:** `temperature_2m`, `wind_speed_10m`, `wind_gusts_10m`, `precipitation`, `weather_code`
- **hourly:** `precipitation_probability`. The app reads the value for the current IST hour.
- **timezone:** `Asia/Kolkata`

## Coordinates
- Latitude and longitude come from DS05 (India East Coast Port Infrastructure) and are sent to Open-Meteo unchanged.
- If a port has no coordinates, the app makes no call and weather shows **UNAVAILABLE**. For example, Kolkata/Haldia is SOURCE FAILED in DS05.

## Error Handling
- **Missing coordinates:** status `unavailable`.
- **HTTP error:** status `error` with the message "HTTP <code>".
- **Timeout (8 seconds, through AbortController):** status `error` with the message "Timed out".
- **Network failure:** status `error`.
- **Response not in the expected shape:** status `error` with the message "Unexpected response".
- **Individual fields that are missing or not finite:** set to `null` and shown as UNAVAILABLE. They are never replaced with 0.
- **Weather risk:** becomes `UNAVAILABLE` when there is no data. The decision then adds the reason "Weather UNAVAILABLE: not factored in".

## Provenance
- Raw weather values are labelled **LIVE**.
- The weather risk level is labelled **DERIVED**.
- If the fetch fails, both are labelled **UNAVAILABLE**.

## Risk Derivation (Prototype Rule)
This is a prototype rule, not a validated marine-operations standard.

| Risk | Condition |
|---|---|
| HIGH | Gusts ≥ 50 km/h, **or** wind ≥ 38 km/h, **or** rain probability ≥ 70% |
| MODERATE | Gusts ≥ 30 km/h, **or** wind ≥ 20 km/h, **or** rain probability ≥ 40% |
| LOW | None of the above |
| UNAVAILABLE | No data |

- A **HIGH** weather risk makes the decision **WAIT**.

## Files Changed
- **Added:** `src/services/liveWeatherService.ts`
- **Uses the weather data:** `src/domain/decision.ts`, `src/pages/Decision.tsx` and `src/pages/Simulator.tsx` (shared through `src/state/shipment.tsx`)

## Validation
| Check | Result |
|---|---|
| Live fetch (Gangavaram, Paradip) returns values with the LIVE badge | PASS |
| Open-Meteo blocked in the browser: weather step shows UNAVAILABLE and the decision still returns ENTER with a reason | PASS |
| Port with no coordinates (Kolkata/Haldia): no fetch, weather UNAVAILABLE, port feasibility UNKNOWN | PASS |
| `tsc --noEmit` | PASS |
| `npm run build` | PASS |
