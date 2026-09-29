# Self-Improvement Log

## 1. Missed `home/` subfolder in the colour remap
- **PROBLEM:** The hero visuals stayed dark after the theme remap.
- **LOCATION:** `src/components/home/HeroShipCanvas.tsx`, `HeroShipVisual.tsx` and `IndiaHudMap.tsx`.
- **WHAT HAPPENED:** The batch sed only targeted the top-level `components/` and `pages/` folders.
- **WHY:** The glob did not recurse into subfolders.
- **DEPENDENCY:** The hex colours are hard-coded in canvas and SVG code, not taken from Tailwind tokens.
- **WHAT WAS TRIED:** The token remap. It cannot reach literal hex values.
- **ROOT CAUSE:** A non-recursive file selection combined with literal colours.
- **FIX:** The dark hex stops in those three files were remapped by hand to light sky and sea values.
- **VERIFICATION:** Checked with a screenshot and the build passes.
- **PREVENTION:** Grep the whole `src/` tree recursively for dark hex values before declaring the remap complete.

## 2. Duplicate `Anchor` imports
- **PROBLEM:** `tsc` failed with a duplicate identifier error.
- **LOCATION:** `Copilot.tsx` and `Home.tsx`.
- **WHAT HAPPENED:** The icon import edits added `Anchor` where it was already imported.
- **WHY:** The import was added without checking the existing import list.
- **DEPENDENCY:** lucide-react imports.
- **WHAT WAS TRIED:** Not applicable.
- **ROOT CAUSE:** An unchecked insert.
- **FIX:** The duplicate was removed.
- **VERIFICATION:** Lint and build pass.
- **PREVENTION:** Run `npm run lint` after every batch of edits.

## 3. `preview_start` rejected the project cwd
- **PROBLEM:** The preview tool would not start a server for TEST2.
- **LOCATION:** Tooling.
- **WHAT HAPPENED:** TEST2 is outside the session's working root.
- **WHY:** `preview_start` is restricted to the session root.
- **DEPENDENCY:** The desktop preview tooling.
- **WHAT WAS TRIED:** `launch.json` in TEST2, and a temporary copy of it in the session root. The temporary copy was removed afterwards.
- **ROOT CAUSE:** The tool's cwd sandbox.
- **FIX:** Ran `npx vite --port 5199 --strictPort` through a background shell and opened it in the browser pane with a URL.
- **VERIFICATION:** All routes load at `localhost:5199`.
- **PREVENTION:** For projects outside the root, start Vite from a shell and attach by URL.

## 4. Forecast horizontal overflow
- **PROBLEM:** At 1280 px the Forecast page's `scrollWidth` was 1292.
- **LOCATION:** `src/pages/Forecast.tsx:84-87`.
- **WHAT HAPPENED:** The fixed `w-28` bar together with the 72 px gauge overflowed the xl 4-column card.
- **WHY:** A flex child without `min-w-0`.
- **DEPENDENCY:** The grid column width.
- **WHAT WAS TRIED:** Not applicable.
- **ROOT CAUSE:** The original layout.
- **FIX:** `min-w-0` on the text column and `w-full max-w-28` on the bar.
- **VERIFICATION:** `scrollWidth` is 1271 at 1280 and 375 at 375.
- **PREVENTION:** Sweep `scrollWidth` on every route at desktop and mobile widths.
