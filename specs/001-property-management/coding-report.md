# Coding report

Scope: entire accepted Property Management Demo. Received PM packet preserved under coding/received. Protected PRD, architecture, constitution, specification and plan are not edited.

## Architecture

Frontend Views → VMs → generated-client services / Models. Backend NestJS contracts → exported OpenAPI → hey-api generated client. Managers own business operations; HTTP *-logic handlers adapt requests. PostgreSQL/Prisma stores durable data and BYTEA; Redis stores temporary sessions/rate limits.

## Intake

PM validator: valid=true, dispatch_eligible=true. Shared gate retry_count=0/revision=0/ACTIVE. requirements checklist 16/16 and implementation-readiness 20/20. No .specify/extensions.yml; no pre/post hooks configured. Spec Kit prerequisite helper resolves this feature.

## Technical sources

Pinned versions preserved from toolchain.json. No stack changes. Reviewed Prisma v6 raw queries https://www.prisma.io/docs/orm/v6/prisma-client/using-raw-sql/raw-queries and transaction guidance https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions; Nest validation https://docs.nestjs.com/application/validation. Installed pinned APIs are checked through compilation and runtime tests.

## Observed checks

Initial bun install, bun run typecheck, bun run build: PASS. React/Vite minimal App and compiled Nest bootstrap build successfully. These setup checks do not establish domain acceptance.

- T010: PASS bun install; strict workspace typecheck/build. Logs coding/logs/bootstrap-*.txt; exact bun.lock.

- T011: PASS minimal Vite React build, coding/logs/T011.txt.

- T012: PASS compiled Nest bootstrap/health HTTP on port3100; coding/logs/T012.txt. Port3000 belongs to unrelated Docker service; preserved.

- T013: PASS docker compose up -d --build --wait; all four healthy; API3100 and frontend5173 respond. Initial install stalled at network48; pinned Bun network-concurrency8 fixed; ignore scripts with later explicit Prisma generation. Logs T013-compose-retry.txt.

- T113: PASS make -n up down build reload; make -j 4 -n reload. Sequential recursive recipes preserve ordering and stop-on-error; down preserves volumes. Logs T113-make.txt.

- T014: PASS Prisma validate/generate; two fresh PG migrations; isolated test fixture load3users15BYTEA. T014-migrate.txt. Exact @prisma/client root dependency added by Prisma6 generator; approved version preserved.

- T015: PASS strict backend typecheck; real PostgreSQL transaction/advisory lock and Redis set/get/lifecycle. Log T015.txt.

- T016: Observed behavioral RED3fail0pass against callable compiled setup: valid credentials rejected; Owner scope rejected. T016-RED.txt. Content-specific HTTP denial follows document integration.

- T018: Observed behavioral RED: cross-origin/CSRF accepted by callable placeholders. Redis login10/auth120 limits exercised. T018-RED.txt. HTTP/log integration deferred to T019.

- T017: PASS access integration3tests after behavioral RED. Opaque8h Redis sessions; PostgreSQL roles/grants/session_version, scoped session context and clock; password hashes never returned. T017-GREEN.txt.

- T019: PASS transport/access suites6tests and real HTTP boundary2tests144assertions: cookies,csrf/origin,limits/retry-after,logout,redacted logs. T019-GREEN.txt/T019-HTTP.txt.

- T020: PASS Nest-owned OpenAPI3.0.0 export; operation registration assertion; two identical hey-api generations; generated services compile strict. T020-generate.txt.

- T021: Observed meaningful DOM/hook RED3tests: no loading/protected boundary, missing session transition/error. Test setup runs. T021-RED.txt.

- T022: PASS3DOM/hook session tests and strict Vite build; TanStack server state, generated-only IO, RHF/Zod. T022-GREEN.txt. Initial screen check required preload correction; VM RED was behavioral, hooks now await asynchronous Query notifications.

- T023: Observed behavioral RED: system dark preference ignored; manual/persistence fallback absent. T023-RED.txt.

- T024: Observed shell DOM RED missing navigation/date/theme control. Basic4device/2theme Chromium acceptance defined before shell implementation; executed T029. T024-RED.txt.

- T027: PASS accessible dialog/table/status DOM checks2tests; local shadcn-style Radix/cva/Tailwind primitives; basic viewport checks T029. T027.txt.

- T025: PASS2theme VM tests system/media changes/manual persistence/return visits/blocked storage. Test media port corrected to support multiple subscriptions. T025-GREEN.txt.

- T026: PASS shell/shared DOM checks and strict types; themed responsive shell/nav/date/status/forms/dialog. CSS variables cover both themes; media breakpoints preserve actions. T026-GREEN.txt.

- T028: PASS8VM/DOM checks and frontend build; saved theme applied before rendering, TanStack providers/session protected shell retained; mobile sign-out accessible. T028.txt.

- T029: PASS4Chromium browser tests on isolated PostgreSQL API: mobile390/tablet768/laptop1366/desktop1920, light+dark switching/persistence/date/nav/no horizontal page overflow. Initial harness env forwarding corrected; T029-browser.txt.

- T030: US6 acceptance recorded validation/us6.md with real8VM/DOM and4browser evidence, scope limits and architecture mapping.

- T100: PASS typed validated user/account/grant/ownership/demo contracts with secret writeOnly fields, versions, documented common errors; strict backend compile.

- T101: Observed meaningful RED3fail1pass: Owner account creation unavailable; valid scope/session/concurrent-owner scenarios cannot proceed. Direct denial tests pass. T101-RED.txt; HTTP date/Viewer content follow registered handlers/documents.

- T102: PASS4real PostgreSQL/Redis role/owner/session tests; administrative advisory lock covers creation/update/grants/owner assignment and concurrent demotions. DTO/Manager never returns hashes. T102-GREEN.txt.

- T103: PASS registered role/ownership/date HTTP routes Owner allowed/Manager+Viewer denied; lastOwner409; invaliddate400; sessionclockrefresh. T103-HTTP.txt. Reset authorization registered; fixture implementation explicitly T110.

- T104: PASS generated roles/ownership/context SDK strict compile and operation discovery; backend-owned DTOs contain versions and writeOnly passwords. T104-generate.txt.

- T105: Observed2behavioral UsersVM RED: missing result/query refresh and conflict feedback. Owner/Manager/Viewer browser scenarios authored before UI. T105-RED.txt.

- T106: PASS2injected UsersVM tests and strict workspace types; observable action state; generated DTOs/services; TanStack query invalidation, conflict/input preservation. T106-GREEN.txt.
