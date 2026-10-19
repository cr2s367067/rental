# US6 — shared shell acceptance

PASS: `bun test --preload ./frontend/tests/setup.ts frontend/tests` (8 VM/DOM tests), `bun run --filter frontend build`, `bun scripts/e2e.ts tests/e2e/shell-theme.spec.ts` (4 Chromium tests, each light/dark).

Evidence: coding/logs/T023-RED.txt → T025-GREEN.txt; T024-RED.txt → T026-GREEN.txt; T028.txt; T029-browser.txt. Four categories: 390×844, 768×1024, 1366×768, 1920×1080. Navigation, demo date, theme selection and reload persistence work; no whole-page horizontal overflow. Dialog/table/status accessibility is exercised by DOM tests. Later full feature regression verifies domain forms/actions at the same device/theme categories. No formal browser certification/background clock scheduler is claimed.

Session server state lives in TanStack Query; all HTTP calls are generated SDK operations. Theme preference is local presentation state behind injected preference/media ports. Shell View applies resolved theme to html. Static component styling uses DOM/build/browser verification instead of tests mirroring CSS.
