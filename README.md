# RFR-IQ

Maritime decision support for bulk raw-material shipping to East Coast India.

## Main capabilities
- **Freight Market** — historical freight index series with a separate, clearly labelled indicative market signal.
- **Vessel Intelligence** — vessel class and capacity information for the planned shipment.
- **Port Intelligence** — port capacity and readiness checks against shipment size.
- **Risk Intelligence** — weather conditions for the route plus indicative freight volatility.
- **Scenario Planning** — adjust delivery pressure, market direction and weather to see how the recommendation changes.
- **Charter Decision** — a rule-based recommendation (ENTER, WAIT or WATCH) with supporting reasons.

## Data behavior
- Historical freight data comes from bundled datasets and is shown separately from the indicative signal.
- The indicative freight signal is labelled as indicative. It is not a market price or broker quote.
- Weather comes from Open-Meteo when route coordinates are available.
- When information is missing, the app shows "Information unavailable" instead of estimating a value.

## Running locally
```bash
npm install
npm run dev
```
Other scripts: `npm run lint` (type check) and `npm run build` (single-file production build in `dist/`).

## Environment
Copy `.env.example` to `.env.local` and set:
- `VITE_MOCK_FREIGHT_BASE_URL` — the base URL of the indicative freight signal service. Optional: when unset, freight signal cards show "unavailable" and everything else works.

No secrets or credentials are required.

## Important limitations
- Historical freight data ends 2019-07-31.
- The freight signal is indicative, not live market data.
- There is no live vessel feed.
- Some port and weather information may be unavailable (for example, ports without coordinates).
