# RFR-IQ — API Integration and Data Integrity Report

**Engineering Verification Report**
**Timestamp**: 2026-09-29
**Platform Target**: RFR-IQ Maritime Decision Intelligence (East Coast India)

---

## APIs Investigated

1. **Open-Meteo Weather API (`api.open-meteo.com/v1/forecast`)**:
   - Free, unauthenticated, non-commercial public API. Provides hourly temperature, wind speed, gusts, and precipitation risk across East Coast port coordinates.
2. **Open-Meteo Marine API (`marine-api.open-meteo.com/v1/marine`)**:
   - Free, unauthenticated public API. Provides significant wave height, swell wave height, wave period, and Douglas sea state observations derived from global oceanographic models (ECMWF/Copernicus).
3. **The World Bank Indicators API v2 (`api.worldbank.org/v2/country/...`)**:
   - Official unauthenticated open data API. Provides annual macroeconomic indicators (GDP growth annual %) for India and trading partner origin corridors.
4. **ExchangeRate-API (`open.er-api.com/v6/latest/USD`) & Frankfurter ECB API (`api.frankfurter.dev/v1/latest`)**:
   - Free, unauthenticated public currency feeds. Provides USD/INR landed conversion rates and maritime benchmark currency pairs (SGD, AUD, ZAR, BRL, CNY).
5. **NOAA CO-OPS Marine Observations (`tidesandcurrents.noaa.gov`)**:
   - Public oceanographic and tidal telemetry. Investigated for coastal coverage; determined to be strictly limited to United States waters and US territories.
6. **NOAA MarineCadastre AIS (`marinecadastre.gov`)**:
   - Public vessel traffic telemetry. Investigated for live AIS feasibility; determined to be strictly limited to United States oceanographic and coastal waters.
7. **Free Commercial AIS Feeds (AISStream / VesselFinder / MarineTraffic)**:
   - Investigated for live East Coast Indian coastal feeds. No documented, unauthenticated, stable, free CORS-accessible public API exists for Indian coastal waters without commercial API subscription keys or credential exposure.

---

## APIs Integrated

1. **Open-Meteo Weather API**:
   - Real-time meteorological observations for 12 East Coast Indian ports. Integrated via `src/services/liveWeatherService.ts` and `src/services/livePortTelemetry.ts`.
2. **Open-Meteo Marine API**:
   - Real-time oceanographic wave, swell, and Douglas sea state telemetry for Bay of Bengal port approaches. Integrated via `src/services/liveMarineService.ts` and `src/services/livePortTelemetry.ts`.
3. **World Bank Indicators API v2**:
   - Real-time programmatic macroeconomic indicator extraction for key trade partners (`IND`, `AUS`, `CHN`, `BRA`, `ZAF`, `IDN`). Integrated via `src/services/liveMacroService.ts`.
4. **ExchangeRate-API / Frankfurter ECB**:
   - Real-time foreign exchange benchmark extraction (USD/INR, SGD, AUD, ZAR). Integrated via `src/services/liveFxService.ts`.
5. **Indicative Freight Service**:
   - Standalone simulation service adapter (DS07 synthetic time-series generator). Integrated via `src/services/mockFreightService.ts`.

---

## APIs Rejected

1. **NOAA CO-OPS Marine Telemetry**:
   - *Reason for Rejection*: Geographic mismatch. NOAA CO-OPS monitors only North American coastal waters and US island stations. Repurposing US buoy telemetry for Indian East Coast ports would violate the fundamental non-fabrication rule.
2. **NOAA MarineCadastre AIS**:
   - *Reason for Rejection*: Geographic mismatch. Covers only US coastal traffic. Cannot be represented as Indian coastal vessel traffic.
3. **Scraped / Unauthenticated Third-Party AIS Portals**:
   - *Reason for Rejection*: Fragile, unverified, terms-of-service violations, and lack of reliable Indian waters coverage. Truthful `UNAVAILABLE` status implemented instead.

---

## Live Data

- **Atmospheric Weather**: Temperature (°C), wind velocity (km/h), gusts (km/h), precipitation risk (%) from Open-Meteo Weather.
- **Oceanographic Marine**: Significant wave height (m), swell height (m), swell direction (°), wave period (s), and Douglas sea state classifications from Open-Meteo Marine.
- **Foreign Exchange**: USD/INR benchmark spot rate, USD/SGD, USD/AUD, USD/ZAR from Open Exchange Rates and European Central Bank.
- **Macroeconomic Indicators**: Annual GDP growth rates (%) by trading partner nation from the World Bank Indicators API v2.

---

## Historical Data

- **Dataset DS01**: World Bank Pink Sheet commodity price history.
- **Dataset DS02**: Historical macroeconomic indicators (country × indicator baseline).
- **Dataset DS03**: Historical regional vessel traffic aggregates.
- **Dataset DS04**: Port statistical records and throughput aggregates.
- **Dataset DS05**: Indian East Coast port infrastructure directory, permissible drafts, LOA, and berth inventories.
- **Dataset DS07**: Historical dry bulk freight indices (2012–2019: Handysize, Supramax, Panamax, Capesize).

---

## Indicative Data

- **Indicative Market State**: Simulated freight index changes (HSI, SI, PI, CI), 1-day/7-day variations, volatility, and trend indicators produced by the mock freight server adapter.
- **Scenario Curves**: Simulated freight trajectories under NORMAL, RISING, FALLING, VOLATILE, and SHOCK conditions.
- **Voyage Planning Assumptions**: User-controlled demurrage exposure slider ($/day, delay days) and bunker fuel price assumption ($/MT).

---

## Removed Fake Data

1. **Hardcoded Currency Rate Fallbacks**: Removed arbitrary static fallbacks (`SGD: 1.28`, `AUD: 1.42`, `EUR: 0.88`, `CNY: 6.71`, `ZAR: 17.5`, `IDR: 15800`, `BRL: 5.4`, `₹96.0`). Currency rates now strictly reflect API return values; missing rates display as `Unavailable`.
2. **Hardcoded Port Wait Times**: Removed synthetic `(1.8d)` wait label in `IndiaHudMap.tsx`. Replaced with static terminal designation (`Major Bulk Hub`).
3. **Random Number Generation**: Replaced `Math.random()` in dossier reference numbering with deterministic, timestamp-based audit IDs.
4. **False "Verified" / "Real-Time" Claims**: Cleaned all user-facing tags across `Layout.tsx`, `Overview.tsx`, `Decision.tsx`, `Ports.tsx`, `ui.tsx`, and `CharteringDossierModal.tsx`.
5. **Dark Mode Toggle**: Removed automatic switching to dark mode and `prefers-color-scheme: dark` listener, preserving pure Light Liquid Glass styling.
6. **Backend Engineering Diagnostics on Overview**: Replaced raw technical datasets table with 6 clean domain overview cards (Market Conditions, Weather, Marine Conditions, Port Information, Vessel Information, Risk).

---

## Decision Integrity

The RFR-IQ decision engine (`src/domain/decision.ts`) strictly derives `ENTER / WAIT / WATCH` recommendations only from valid, verified inputs:

1. **Shipment Validation**: Requires positive cargo quantity, origin, and East Coast destination port.
2. **Port Capacity Constraint**: Checks stem quantity against verified maximum DWT from the port directory. Evaluates to `UNKNOWN` if port data is unlisted; fails if cargo exceeds DWT limit.
3. **Weather Risk**: Evaluates real-time Open-Meteo wind, gust, and precipitation thresholds. If weather API is unavailable, the risk step marks `UNAVAILABLE` and does not penalize the decision.
4. **Marine Sea State & Swell**: Evaluates real-time Open-Meteo Marine wave and swell against safe berthing thresholds. High swell triggers an `ADVISORY` hold (`WAIT`). If marine API is unavailable, step marks `UNAVAILABLE`.
5. **Vessel Availability**: Accurately reports `UNAVAILABLE` for Indian waters. Recommends direct verification with the terminal authority rather than inventing a phantom lineup.
6. **Market Trend**: Evaluates historical reference index trend (DS07) or indicative simulation signal. Never fabricates a spot commercial fixture price.
7. **Delivery Requirement**: High delivery urgency allows `ENTER` when physical constraints (DWT, weather, marine) are clear.

---

## Failure Handling

- **Timeouts**: Every external API call (Open-Meteo Weather, Open-Meteo Marine, World Bank, ExchangeRate-API, Mock Freight) is governed by an `AbortController` with an 8-second hard timeout.
- **HTTP / Network Failures**: All network errors catch gracefully and transition state to `status: "unavailable"` or `status: "error"`.
- **Malformed Payloads**: Type validators (`validateObs`, `validateMarketState`, `numOrNull`) reject unexpected shapes and return descriptive error states.
- **Missing Mock Freight Server**: When `VITE_MOCK_FREIGHT_BASE_URL` is unconfigured, the service returns `status: "unavailable"` with reason `"Indicative freight service unconfigured"`. It never silently substitutes historical DS07 data as a live signal.

---

## Geographic Coverage

- **Weather & Marine**: Strictly East Coast India coordinates (Visakhapatnam 17.68°N 83.21°E, Paradip 20.26°N 86.67°E, Gangavaram 17.62°N 83.23°E, Dhamra 20.80°N 86.97°E, Chennai 13.08°N 80.29°E, Haldia 22.02°N 88.06°E, etc.).
- **Vessel Traffic**: Explicitly disclosed that real-time unauthenticated AIS queue data is unavailable for Indian coastal waters.
- **Macroeconomics**: Sovereign indicators for India and partner export corridors (Australia, China, Brazil, South Africa, Indonesia).

---

## UI Integrity

- **Theme**: Strict Light Liquid Glass design system maintained (`#eef4fa` surface, navy typography, ocean blue glass panels). Automatic dark mode listeners removed.
- **Terminology**: Replaced all ungrounded claims of "verified" or "real-time" with "validated operational data", "live open feeds", or "unavailable".
- **Responsive Layout**: Validated responsive grid structures across desktop (1280px) and mobile (375px) viewports with zero horizontal overflow.

---

## Stage 1 Integrity

All Stage 1 baseline datasets (`ds01.json`, `ds02.json`, `ds03.json`, `ds04.json`, `ds05.json`, `ds07.json`) remain intact and unaltered in their original read-only state.

---

## Build

- **Lint**: PASS (`tsc --noEmit`, 0 errors)
- **Build**: PASS (`vite build`, exit code 0)

---

## Final Status

**PASS**
