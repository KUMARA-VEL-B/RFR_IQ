# RFR-IQ — Final Validation Report

Only results that were actually tested are marked PASS. Anything that was not tested is labelled NOT TESTED.

## 1. Branding
- **Visible brand:** "RFR-IQ" in the UI and in `index.html`.
  - Title: "RFR-IQ — Maritime Decision Intelligence | East Coast India".
  - The meta description and theme-color `#eef4fa` are set.
- **Internal name:** "Recursion Freight-IQ" appears only in documentation and metadata.
- **README:** the title is "RFR-IQ — Maritime Decision Intelligence Platform". No URLs were invented.
- **`deploy.yml`:** only the `name:` line was changed.
- **Identifiers:** no identifiers were renamed. The package name, file names, variables and storage keys are unchanged.
- **Route sweep:** no visible "FreightIQ" text on any of the 8 routes. **PASS**

## 2. Build
| Step | Result |
|---|---|
| `npm install` (clean) | PASS |
| `npm run lint` (`tsc --noEmit`) | PASS |
| `npm run build` | PASS. `dist/index.html` is 968.32 kB (263.88 kB gzip) |

## 3. Runtime per page
Tested on the Vite dev server at `localhost:5199` with a 1280 px viewport.

| Route | Heading | Charts | Tables | Buttons | JS errors | Overflow |
|---|---|---|---|---|---|---|
| home | Smarter Freight. Stronger India. | 0 | 0 | 7 | 0 | none |
| overview | (no h1) | 3 | 0 | 35 | 0 | none |
| forecast | Freight Market Terminal | 3 | 0 | 23 | 0 | none |
| vessel | Vessel Charter Optimizer | 0 | 1 | 17 | 0 | none |
| ports | East Coast Port Intelligence | 1 | 1 | 29 | 0 | none |
| simulator | What-If Command Center | 1 | 0 | 29 | 0 | none |
| risk | Maritime Risk Command | 0 | 0 | 26 | 0 | none |
| decision | CHARTER DECISION | 0 | 0 | 18 | 0 | none |

- **Overflow:** "none" means `scrollWidth` was 1271 at 1280. An earlier pass also measured 375 at a 375 px width on all routes.
- **Copilot panel:** it opens from "Ask Copilot" with no console errors. **PASS**
- **Copilot messaging:** sending a message was **NOT TESTED**.
- **Production preview:** the built `dist/` was **NOT TESTED** in a browser. Only the dev server was.

## 4. UI preservation
- **Theme:** the light liquid-glass theme is kept and there is no dark mode.
- **Layout:** the JSX layout structure is unchanged. The only layout edit is the Forecast overflow fix at `src/pages/Forecast.tsx:84-87`.

**PASS** (visual check by screenshot and DOM checks)

## 5. Logic preservation: YES
No edits were made to `src/engine/`, `src/data/`, or the forecasting, scoring, risk, simulator, decision or routing logic.

## 6. Issues remaining
- **Demo data only.** The data is representative. The "Terminal live" badge on Forecast is original copy with no live feed behind it.
- **Bundle size.** The single-file bundle is 968 kB. No size reduction was done.
- **Overview heading.** The Overview page has no `h1`.
- **Accessibility.** A full WCAG audit and screen-reader testing were NOT TESTED.
- **Safari.** The `backdrop-filter` rendering in Safari was NOT TESTED.

## Integrity
These files were not modified. Their SHA-256 hashes are the same before and after the work.

| File | SHA-256 |
|---|---|
| `soul.md` | `e172878b6b8e59ea7b670d12b896f1eb147e431209b6bf8c1a05220ba4238c1e` |
| `freightiq-main.zip` | `f2edfdb70147b91d44e503b53a4516988f2e546e2ded6d1a0a729aa20431b920` |

STAGE1 and TEST1 were not used, referenced or modified.
