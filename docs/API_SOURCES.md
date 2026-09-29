# RFR-IQ — Verified External API Sources & Integration Registry

This registry documents every external data source integrated into the RFR-IQ decision intelligence platform. In accordance with RFR-IQ data integrity principles, only legitimate, verified, free and open public APIs are integrated. No private tokens are exposed, and no synthetic/fallback data is ever disguised as live telemetry.

---

### 1. Open-Meteo Weather API

- **Name**: Open-Meteo Weather Forecast & Current Conditions API
- **Purpose**: Real-time meteorological observations for East Coast Indian bulk ports (ambient temperature, wind speed at 10m, wind gusts, precipitation probability, and weather codes) to evaluate cargo handling and squall risks.
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Authentication**: None required (free, open, non-commercial public feed)
- **Rate Limit**: Up to 10,000 daily API calls per client IP; hourly bursts allowed
- **Geographic Coverage**: Global high-resolution atmospheric models covering all East Coast Indian ports (lat/lon coordinates: Visakhapatnam, Paradip, Gangavaram, Dhamra, Chennai, Haldia, etc.)
- **Data Fields Used**: `temperature_2m`, `wind_speed_10m`, `wind_gusts_10m`, `precipitation`, `weather_code`, `hourly.precipitation_probability`
- **Refresh Strategy**: On-demand per selected port with client-side session caching; multi-port dashboard refreshes every 5 minutes with manual refresh option
- **Failure Behavior**: On HTTP error, network timeout (8 seconds), or missing port coordinates, returns `status: "unavailable"` or `status: "error"`. Never fabricates weather conditions.
- **License / Terms**: Open data under Attribution 4.0 International (CC BY 4.0); free for non-commercial and research use
- **User-Facing Label**: `Live Weather` (Open-Meteo)
- **Last Verification Date**: 2026-09-29

---

### 2. Open-Meteo Marine API

- **Name**: Open-Meteo Global Marine & Oceanographic Wave API
- **Purpose**: Real-time significant wave height, swell wave height, swell direction, wave period, and Douglas sea state observations for outer anchorages, roadsteads, and port approaches to assess berthing and lighterage safety.
- **Endpoint**: `https://marine-api.open-meteo.com/v1/marine`
- **Authentication**: None required (free, open, non-commercial public feed)
- **Rate Limit**: Up to 10,000 daily API calls per client IP
- **Geographic Coverage**: Global oceanographic coverage derived from ECMWF/Copernicus marine forecast models, including Bay of Bengal and Indian East Coast coastal waters
- **Data Fields Used**: `wave_height`, `wave_direction`, `wave_period`, `wind_wave_height`, `swell_wave_height`, `swell_wave_direction`
- **Refresh Strategy**: On-demand per selected port; multi-port background sync every 5 minutes
- **Failure Behavior**: On HTTP error, timeout (8s), or missing coordinates, returns `status: "unavailable"` / `status: "error"`. Safe berthing evaluated as `UNAVAILABLE` when live marine data is missing.
- **License / Terms**: Open data under CC BY 4.0
- **User-Facing Label**: `Live Marine Sea State` (Open-Meteo Marine)
- **Last Verification Date**: 2026-09-29

---

### 3. World Bank Indicators API v2

- **Name**: The World Bank Group Indicators API v2
- **Purpose**: Official annual macroeconomic indicator statistics (annual GDP growth %: `NY.GDP.MKTP.KD.ZG`) for key dry bulk trading partners (India destination + Australia, China, Brazil, South Africa, Indonesia origin corridors).
- **Endpoint**: `https://api.worldbank.org/v2/country/{countryCode}/indicator/{indicatorCode}?format=json`
- **Authentication**: None required (public open data)
- **Rate Limit**: Unauthenticated public access, reasonable throughput (up to 30 records per page)
- **Geographic Coverage**: Sovereign national indicators for India (`IND`), Australia (`AUS`), China (`CHN`), Brazil (`BRA`), South Africa (`ZAF`), and Indonesia (`IDN`)
- **Data Fields Used**: `countryiso3code`, `country.value`, `date`, `value` (GDP growth annual %)
- **Refresh Strategy**: Fetched once on component mount with 10-minute client cache; historical indicators change annually
- **Failure Behavior**: On network failure, HTTP error, or timeout (8s), returns `status: "unavailable"` with descriptive error message. Never fabricates GDP growth figures.
- **License / Terms**: World Bank Open Data Terms of Use (CC BY 4.0)
- **User-Facing Label**: `World Bank Indicators` (World Bank Open API v2)
- **Last Verification Date**: 2026-09-29

---

### 4. Foreign Exchange Benchmark Feeds (ExchangeRate-API / Frankfurter ECB)

- **Name**: Open Exchange Rates & European Central Bank Reference Feeds
- **Purpose**: Current USD/INR conversion rate for landed cost estimation, plus international maritime currency pairs (USD/SGD bunker hub, USD/AUD coking coal, USD/ZAR thermal coal).
- **Primary Endpoint**: `https://open.er-api.com/v6/latest/USD`
- **Fallback Endpoint**: `https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR,SGD,AUD,EUR,CNY,ZAR,BRL`
- **Authentication**: None required (free open feeds, CORS enabled)
- **Rate Limit**: ExchangeRate-API free tier provides cached updates; Frankfurter provides ECB rates without key limits
- **Geographic Coverage**: Global currency benchmarks
- **Data Fields Used**: `rates.INR`, `rates.SGD`, `rates.AUD`, `rates.ZAR`, `rates.BRL`, `rates.EUR`, `time_last_update_utc`
- **Refresh Strategy**: 10-minute client-side caching window with explicit manual refresh capability
- **Failure Behavior**: If both primary and secondary feeds fail or timeout (8s), returns `status: "error"` and landed INR conversion displays as `Unavailable`. No hardcoded fallback rates (such as ₹96.0 or arbitrary AUD/SGD constants) are ever substituted.
- **License / Terms**: Free public tier for open exchange rates; ECB public domain
- **User-Facing Label**: `Foreign Exchange Rates` (Open Public Feeds)
- **Last Verification Date**: 2026-09-29

---

### 5. Indicative Freight Service (Standalone Mock Adapter)

- **Name**: RFR-IQ Indicative Synthetic Freight Generator
- **Purpose**: Generates indicative market state signals and scenario trajectories based on the DS07 time-series model.
- **Endpoint**: Configured via `VITE_MOCK_FREIGHT_BASE_URL` (`/api/freight/latest`, `/api/freight/market-state`, `/api/freight/history`, `/api/freight/scenario`)
- **Authentication**: Optional reverse-proxy / direct HTTP
- **Rate Limit**: Local / container service dependent
- **Geographic Coverage**: Route indices (HSI, SI, PI, CI)
- **Data Fields Used**: `index`, `latest_value`, `change_1d`, `change_7d`, `trend`, `volatility`, `observation_count`
- **Refresh Strategy**: Reactive on user index selection
- **Failure Behavior**: If `VITE_MOCK_FREIGHT_BASE_URL` is undefined, unreachable, or returns malformed payload, returns `status: "unavailable"`. Does NOT silently fall back to historical DS07 data as a live substitute.
- **License / Terms**: Internal prototype model
- **User-Facing Label**: `Indicative Market Signal` (Simulation)
- **Last Verification Date**: 2026-09-29
