# Tasks: Property Management Demo

**Feature**: 001-property-management | **Amended**: 2026-10-19
**Sources**: [spec](spec.md), [plan](plan.md), [policy](demo-policy.md),
[model](data-model.md), [API intent](contracts/api-design.md),
[mock plan](mock-data-plan.md), [research](research.md),
[local delivery addendum](compose-delivery-addendum.md).

Existing T001–T096 IDs are preserved. T097–T112 add documentation, fixtures, roles and
remediation work. T113 adds the user-requested root Makefile. Numeric ID order is not execution order after this amendment; use the
explicit dependency graph and phase order. Checked items below are observed planning/data
artifacts and isolated compatibility evidence only, not application acceptance. No completed
code task is overwritten. The later user instruction authorizes all remaining feature tasks
and Coding/QA dispatch; delivery evidence is recorded separately in pipeline-state.json.

## Gates and Conventions

- G0 RESOLVED: the user explicitly enabled implementation and Coding/QA through the defined
  pipeline; see execution-authorization.md. No deployment is requested.
- G6: the drafted defaults are the authorized implementation baseline. T112 records the
  refreshed checklist and read-only semantic analysis; no QA/runtime waiver is implied.
- G7 RESOLVED by T001: exact pins and isolated compatibility evidence are recorded in
  toolchain.json, research.md and compatibility-evidence.json. Actual app checks remain.
- G1–G5 from the old draft are superseded by the contract direction and demo baseline.
- Contract authority, Asia/Taipei, whole TWD, scoped roles, uploads and the documented
  windows/limits are the implementation baseline. No manual check-in/out is planned.
- Use Views -> VMs -> Models/services, generated API DTOs, backend Managers/Handlers and
  the same server-side permission and transactional invariants for every mutation.
- Behavioral tests must reach intended RED after setup compiles; setup/import failure is
  not meaningful RED. Contract definitions precede handlers; generation is serialized.
- Shared app.module/App/AppShell/client output ownership is serialized by dependencies.
  Domain handlers explicitly register providers/routes; Views register router/nav entries.
- No [P] markers are assigned while prerequisite/review gates remain open. Future parallel
  cohorts require independent ownership, completed prerequisites and isolated service data.
- Source PRD/Architecture/constitution/spec are preserved. Handoff/dispatch requires real
  validation and tool receipts. Static fixture validation is distinct from application QA.

## Phase 1: Demo Decisions, Design Drafts and Setup

**Checkpoint:** Follow resolved planning gates and dependencies; mark application work only after observed checks.

- [x] T001 Verify and record a compatible, pinned toolchain in `specs/001-property-management/research.md`, `specs/001-property-management/toolchain.json`, `specs/001-property-management/compatibility-evidence.json`, `specs/001-property-management/compatibility-registry.json`

  **Priority:** P1 | **Depends:** None | **Gates:** Resolved by the later execution instruction and recorded isolated verification.

  **Acceptance:** Record exact versions, official sources, Bun/NestJS/Prisma/OpenAPI/test-tool compatibility evidence and limits. Sixteen isolated commands passed; application acceptance remains pending.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T097 Draft the demo policy and mock-data import plan in `specs/001-property-management/demo-policy.md`, `specs/001-property-management/mock-data-plan.md`

  **Priority:** P1 | **Depends:** None | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Document confirmed user directions separately from proposed defaults, role/ownership rules, fixed clock, dataset stories and future isolated import/reset without writing a loader.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-032, FR-036, FR-037, FR-038, FR-039); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T002 Record contract-driven occupancy and interval proposals in `specs/001-property-management/research.md`

  **Priority:** P1 | **Depends:** T097 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** User contract authority and Asia/Taipei are recorded; inclusive/exclusive, capacity and history defaults are explicitly proposed for review, not falsely marked confirmed.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-003, FR-005, FR-006, FR-007, FR-008, FR-029, FR-030, FR-031); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T003 Record the proposed demo billing defaults in `specs/001-property-management/research.md`

  **Priority:** P1 | **Depends:** T097 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Record exact whole TWD, explicit periods/due dates, seven/thirty-day windows, status precedence and append-only correction/overpayment proposals for review.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-010, FR-011, FR-014, FR-015, FR-016, FR-032, FR-033, FR-034, FR-035); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T004 Record the reopened demo access and role policy draft in `specs/001-property-management/research.md`

  **Priority:** P1 | **Depends:** T097 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** User request reopens policy drafting; Owner/Manager/Viewer, grants, ownership, sessions and upload restrictions are documented as proposals, with no credential creation.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-012, FR-013, FR-024, FR-025, FR-027); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T005 Record proposed demo smoke and recovery budgets in `specs/001-property-management/research.md`

  **Priority:** P1 | **Depends:** T097 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Separate confirmed Asia/Taipei from proposed three-session/two-second smoke and five-minute reimport recovery budgets; no production SLA or stress-test project is implied.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T098 Create deterministic synthetic fixture records in `specs/001-property-management/mock-data/fixtures.json`

  **Priority:** P1 | **Depends:** T097 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Provide stable-ID users/grants/properties/resources/tenants/contracts/obligations/payments and synthetic document bytes with no credentials or real personal data.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-038, SC-007); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T006 Amend the specification and requirement checklist for the requested demo fixes in `specs/001-property-management/spec.md`, `specs/001-property-management/checklists/requirements.md`

  **Priority:** P1 | **Depends:** T002, T003, T004, T005 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Preserve existing FR/SC/story IDs, add US7 and new requirements, replace check-in/out with contracts, identify proposed defaults and keep runtime/review gates explicit.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T099 Create and verify scoped golden results and scenario expectations in `specs/001-property-management/mock-data/expected-results.json`

  **Priority:** P1 | **Depends:** T098 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Verify IDs/FKs, capacity, money/status arithmetic, document sizes/hashes, role-scoped totals and negative cases at the fixed Taiwan date; fixture validation is not an app runtime pass.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-038, FR-039, SC-002, SC-003, SC-006, SC-007); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T007 Draft the architecture-aligned demo data model in `specs/001-property-management/data-model.md`

  **Priority:** P1 | **Depends:** T006 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Provide data-model.md with users/grants, ownership, contract-derived Stay, exact date/money, append-only payments, idempotency and BYTEA relationships; draft status is explicit.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T008 Draft API intent and the demo validation quickstart in `specs/001-property-management/contracts/api-design.md`, `specs/001-property-management/quickstart.md`

  **Priority:** P1 | **Depends:** T007 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Provide policy-scoped operations and explicit registration ownership, plus present-versus-future command/fixture guidance. No runtime OpenAPI or executable command result is fabricated.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T009 Record updated demo plan and research disposition in `specs/001-property-management/plan.md`, `specs/001-property-management/research.md`

  **Priority:** P1 | **Depends:** T006, T007, T008 | **Gates:** Draft deliverable completed; policy review remains separate.

  **Acceptance:** Reviewed corrections and missing design drafts are linked. Version verification, policy review and fresh analysis remain implementation gates; no completed formal runtime stage is claimed.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T112 Review proposed demo defaults and rerun artifact readiness analysis in `specs/001-property-management/demo-policy.md`, `specs/001-property-management/checklists/requirements.md`, `specs/001-property-management/checklists/implementation-readiness.md`, `specs/001-property-management/analysis.md`, `specs/001-property-management/execution-authorization.md`

  **Priority:** P1 | **Depends:** T001, T009, T097, T099 | **Gates:** Later implementation instruction accepts the documented baseline; this task resolves G6 through fresh analysis.

  **Acceptance:** Record the later user implementation authorization and PM interpretation of the drafted defaults, evaluate readiness checklists and fresh read-only cross-artifact analysis. Retain compatibility limits; do not claim application QA or weaken constitution.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-032, FR-036, FR-037, FR-038, FR-039); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T010 Initialize the Bun workspace and shared TypeScript/quality configuration in `package.json`, `bun.lock`, `tsconfig.base.json`, `.gitignore`

  **Priority:** P1 | **Depends:** T001, T009, T112 | **Gates:** G0, G6, G7.

  **Acceptance:** Use the selected exact versions; workspace commands resolve frontend/backend checks and omit secrets/generated noise according to the accepted output policy.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T011 Initialize the React/Vite frontend package in `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`, `frontend/index.html`, `frontend/main.tsx`, `frontend/Views/App.tsx`

  **Priority:** P1 | **Depends:** T010 | **Gates:** G0, G6, G7.

  **Acceptance:** Create a minimal runnable React entry/App before service startup. It compiles/builds with pinned tooling and can later be enhanced by T022/T028 without waiting for feature code.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T012 Initialize the NestJS backend package in `backend/package.json`, `backend/tsconfig.json`, `backend/nest-cli.json`, `backend/Src/main.ts`, `backend/Src/app.module.ts`

  **Priority:** P1 | **Depends:** T010 | **Gates:** G0, G6, G7.

  **Acceptance:** Create a minimal runnable NestJS entry/root module and health response before T013; start without domain/database modules until T019 enhances bootstrap. Verify Bun DI/decorator support.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T013 Configure the four local services and environment boundaries in `compose.yaml`, `frontend/Dockerfile`, `backend/Dockerfile`, `.dockerignore`, `.env.example`, `.env.development.example`, `.env.staging.example`, `.env.production.example`

  **Priority:** P1 | **Depends:** T011, T012 | **Gates:** G0, G6, G7.

  **Acceptance:** Start all four services and basic health checks using T011/T012 minimal entries. Database/Redis persistence/config are available before later infrastructure/security enhancements; no dependency on T019/T022 startup. Supply separate environment examples with no real secrets and preserve required example files in ignore rules.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T113 Provide the requested Compose convenience targets in `Makefile`

  **Priority:** P1 | **Depends:** T013 | **Gates:** Active retry gate; local delivery addendum OP-001.

  **Acceptance:** PHONY up/down/build invoke docker compose up/down/build respectively. reload runs down, build, up sequentially and stops on failure even under parallel make. Preserve foreground up and volumes on down. Verify make dry-runs, including reload order, and document usage in T095. Independent QA includes this file; post-QA local startup is a separately tracked delivery action OP-002.

  **Sources:** spec.md#constitutional-acceptance-and-open-decisions-mandatory (shared local delivery prerequisite); compose-delivery-addendum.md#makefile-contract-op-001; Architecture.md#backend.

## Phase 2: Shared Infrastructure and Access

**Checkpoint:** Follow resolved planning gates and dependencies; mark application work only after observed checks.

- [x] T014 Implement the approved Prisma schema and initial migration in `backend/prisma/schema.prisma`, `backend/prisma/migrations/0001_initial/migration.sql`, `backend/tests/fixtures.ts`

  **Priority:** P1 | **Depends:** T007, T013 | **Gates:** G0, G6, G7.

  **Acceptance:** Implement approved demo entity/FK/uniqueness/BYTEA design and fresh migrations. Provide isolated valid fixture loading for tests before business endpoints exist, with environment-supplied credentials and no production reset.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-005, FR-009, FR-013, FR-014, FR-028, FR-036, FR-037, FR-038); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T015 Provide database, transaction, Redis and environment adapters in `backend/Src/Infrastructure/database.ts`, `backend/Src/Infrastructure/redis.ts`, `backend/Src/Infrastructure/config.ts`

  **Priority:** P1 | **Depends:** T014 | **Gates:** G0, G6, G7.

  **Acceptance:** Adapters use injected dependencies, validated environment settings and controlled lifecycle; cache loss cannot lose authoritative records; real-service smoke checks pass.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-028); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T016 Write access-policy and session boundary tests in `backend/tests/integration/access.test.ts`

  **Priority:** P1 | **Depends:** T008, T015 | **Gates:** G0, G6, G7.

  **Acceptance:** Tests cover the confirmed sign-in/session flow, allowed/denied roles, property boundaries and document access; record meaningful behavioral RED without import/setup failures.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T018 Write request, error, rate-limit and sensitive-log tests in `backend/tests/integration/transport.test.ts`

  **Priority:** P1 | **Depends:** T008, T015 | **Gates:** G0, G6, G7.

  **Acceptance:** Assert invalid requests, failure response shapes, approved rate-limit behavior and absence of secrets/document contents/tenant-sensitive fields in logs; observe intended RED. Rate limits are 10 login attempts/IP/minute and 120 authenticated requests/principal/minute; assert 429/Retry-After and CSRF/origin denial.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-026, FR-027); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T017 Implement the approved authentication and authorization boundary in `backend/Src/Infrastructure/access.ts`, `backend/Src/Contracts/session.contract.ts`, `backend/Src/Handler/session-logic.ts`

  **Priority:** P1 | **Depends:** T016 | **Gates:** G0, G6, G7.

  **Acceptance:** Enforce approved demo server sessions and Owner/Manager/Viewer property scope; T016 passes. Persist durable roles/grants in PostgreSQL; invalidate role-changed sessions; no client role-switch trust. Session read DTO also supplies business_date/timezone/demo_mode so the early themed shell can label the server clock before US7 adds privileged clock-change operations. Session context also includes scoped property IDs/names and owner IDs for early ownership controls; changes to grants/password/enabled state invalidate affected sessions.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T019 Implement NestJS bootstrap and shared transport protections in `backend/Src/main.ts`, `backend/Src/app.module.ts`, `backend/Src/Infrastructure/transport.ts`

  **Priority:** P1 | **Depends:** T017, T018 | **Gates:** G0, G6, G7.

  **Acceptance:** Enhance the runnable T012 entry/module with database/Redis, validation, documented errors and redacted logging. Pass T018 and register session/access boundaries; do not recreate startup as a late prerequisite.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-026, FR-027); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T020 Wire deterministic backend schema export and frontend generation in `backend/OpenAPI/openapi.json`, `frontend/Generated/`, `frontend/Services/client.ts`, `openapi-ts.config.ts`, `package.json`

  **Priority:** P1 | **Depends:** T008, T019 | **Gates:** G0, G6, G7.

  **Acceptance:** NestJS definitions export a validated schema; pinned hey-api generates a compiling client/types/models; repeat generation is deterministic and generated files are not hand-edited.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T021 Write application-provider and approved session UI tests in `frontend/tests/application.test.tsx`, `frontend/tests/session.test.tsx`

  **Priority:** P1 | **Depends:** T011, T020 | **Gates:** G0, G6, G7.

  **Acceptance:** Cover query/router setup, sign-in/session outcomes, loading/errors and protected navigation against the approved policy; test setup compiles before behavioral RED is recorded.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T022 Implement application providers and the approved sign-in/session flow in `frontend/Views/App.tsx`, `frontend/Views/SignIn.tsx`, `frontend/VMs/session.vm.ts`, `frontend/Services/query.ts`

  **Priority:** P1 | **Depends:** T021 | **Gates:** G0, G6, G7.

  **Acceptance:** Enhance the runnable T011 App with session/query/router providers and generated operations; T021 passes. Preserve entry startup and keep I/O/business rules out of Views.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 3: US6 — Devices and Themes (P1)

**Independent acceptance:** Basic essential actions across four device categories/two themes; no formal browser matrix.

- [x] T023 [US6] Write theme preference and system-detection VM tests in `frontend/tests/theme.vm.test.ts`

  **Priority:** P1 | **Depends:** T022 | **Gates:** G0, G6, G7.

  **Acceptance:** Test no preference, system preference, manual override, persistence, return visits, and unavailable preference storage using meaningful behavioral failures.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-022, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T024 [US6] Write shell, responsive-component and theme acceptance tests in `frontend/tests/shell.test.tsx`, `tests/e2e/shell-theme.spec.ts`

  **Priority:** P1 | **Depends:** T022 | **Gates:** G0, G6, G7.

  **Acceptance:** Specify essential shared-shell/theme behavior for basic four-device-category/two-theme smoke. Do not add a formal multi-browser certification or automated viewport-matrix project.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022, FR-023, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T025 [US6] Implement theme model and presentation actions in `frontend/Models/theme.ts`, `frontend/VMs/theme.vm.ts`

  **Priority:** P1 | **Depends:** T023 | **Gates:** G0, G6, G7.

  **Acceptance:** System/manual precedence, persistence and fallback behavior pass T023; no server data is duplicated into local state.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-022, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T027 [US6] Implement responsive shared form, table, dialog and status components in `frontend/Views/shared/ResponsiveTable.tsx`, `frontend/Views/shared/FormLayout.tsx`, `frontend/Views/shared/ResponsiveDialog.tsx`, `frontend/Views/shared/StatusBadge.tsx`

  **Priority:** P1 | **Depends:** T024 | **Gates:** G0, G6, G7.

  **Acceptance:** Essential information/actions remain accessible at supported viewport categories and statuses include labels/icons beyond color; matching component tests pass. Use locally owned accessible shadcn/ui components with the pinned Radix primitives and Tailwind; avoid introducing a separate UI framework.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022, FR-023, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T026 [US6] Implement the themed shell and theme controls in `frontend/Views/AppShell.tsx`, `frontend/Views/ThemeControl.tsx`, `frontend/Views/styles.css`

  **Priority:** P1 | **Depends:** T024, T025 | **Gates:** G0, G6, G7.

  **Acceptance:** Implement readable themed navigation/theme controls and a visible fixed Asia/Taipei demo-date label; privileged date change controls are integrated by US7.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022, FR-023, FR-039, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T028 [US6] Integrate the themed shell with application providers in `frontend/Views/App.tsx`

  **Priority:** P1 | **Depends:** T022, T026, T027 | **Gates:** G0, G6, G7.

  **Acceptance:** Routes render inside the shell with saved theme restored before normal use; session and query behavior remain correct.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022, FR-024, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T029 [US6] Verify basic shell/theme/device smoke in `tests/e2e/shell-theme.spec.ts`

  **Priority:** P1 | **Depends:** T028 | **Gates:** G0, G6, G7.

  **Acceptance:** Record essential shell/dialog/status/theme behavior in the four constitutional device categories and both themes. Formal browser certification and background timer tests are skipped.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022, FR-023, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T030 [US6] Record US6 acceptance evidence in `specs/001-property-management/validation/us6.md`

  **Priority:** P1 | **Depends:** T029 | **Gates:** G0, G6, G7.

  **Acceptance:** Link actual commands/results for the shell matrix and VM/component suites; scope evidence to implemented UI and retain full-workflow checks for later stories.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 4: US7 — Ownership, Roles and Property Access (P1)

**Independent acceptance:** Owner/Manager/Viewer allow/deny checks, ownership/grant edits, last-Owner protection and explicit demo date.

- [x] T100 [US7] Define user, ownership, grants and demo-context operations in `backend/Src/Contracts/user.contract.ts`, `backend/Src/Contracts/property-access.contract.ts`, `backend/Src/Contracts/demo-context.contract.ts`

  **Priority:** P1 | **Depends:** T008, T020 | **Gates:** G0, G6, G7.

  **Acceptance:** Specify Owner-only account/role/grant/owner operations, read scopes, last-Owner conflicts and explicit demo-date/reset permissions without exposing credentials.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-036, FR-037, FR-039, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T101 [US7] Write role, grant, ownership and last-Owner integration tests in `backend/tests/integration/users-roles.test.ts`

  **Priority:** P1 | **Depends:** T100 | **Gates:** G0, G6, G7.

  **Acceptance:** Cover allowed/denied actions for all three roles, out-of-scope IDs, Viewer content denial, last enabled Owner and property-owner demotion, session invalidation and demo-date privileges. Include simultaneous Owner demotions and ownership reassignments versus demotion; transactional protection must remain true across both paths.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-036, FR-037, FR-039, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T102 [US7] Implement account, property-grant and owner administration use cases in `backend/Managers/users-manager.ts`

  **Priority:** P1 | **Depends:** T101 | **Gates:** G0, G6, G7.

  **Acceptance:** Pass role/grant/ownership transaction tests; prevent escalation and invalid owner changes; invalidate affected sessions and keep password hashes out of outputs.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-036, FR-037, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T103 [US7] Implement and register user/ownership/demo-context handlers in `backend/Src/Handler/users-logic.ts`, `backend/Src/Handler/property-access-logic.ts`, `backend/Src/Handler/demo-logic.ts`, `backend/Src/app.module.ts`

  **Priority:** P1 | **Depends:** T100, T102 | **Gates:** G0, G6, G7.

  **Acceptance:** Register handlers/providers and owner-only clock/reset boundaries in root module; exported schema contains them and unauthorized payloads fail server-side. Actual fixture-loader integration follows T110.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-036, FR-037, FR-039, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T104 [US7] Regenerate the client for role/ownership/demo-context operations in `backend/OpenAPI/openapi.json`, `frontend/Generated/`

  **Priority:** P1 | **Depends:** T020, T103 | **Gates:** G0, G6, G7.

  **Acceptance:** Compile registered operations with deterministic generator output before property-domain export; never hand-edit generated files.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-036, FR-037, FR-039); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T105 [US7] Write role/ownership VM and browser acceptance tests in `frontend/tests/users.vm.test.ts`, `tests/e2e/users-roles.spec.ts`

  **Priority:** P1 | **Depends:** T030, T104 | **Gates:** G0, G6, G7.

  **Acceptance:** Specify Owner administration, scoped Manager/Viewer navigation, denied role escalation/downloads, ownership reassignment and explicit demo-date controls before UI behavior.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-036, FR-037, FR-039, SC-001, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [x] T106 [US7] Implement role, property-access and demo-context presentation actions in `frontend/Models/user.ts`, `frontend/VMs/users.vm.ts`

  **Priority:** P1 | **Depends:** T105 | **Gates:** G0, G6, G7.

  **Acceptance:** Reuse generated DTOs and server session/context facts; permitted role/grant/date changes invalidate affected queries and session views; no client-only role switch.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-024, FR-036, FR-037, FR-039); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T107 [US7] Implement and register account/property-access/demo-context Views in `frontend/Views/Users.tsx`, `frontend/Views/PropertyAccess.tsx`, `frontend/Views/DemoContext.tsx`, `frontend/Views/App.tsx`, `frontend/Views/AppShell.tsx`

  **Priority:** P1 | **Depends:** T106 | **Gates:** G0, G6, G7.

  **Acceptance:** Register routes/nav and bind VMs with role-aware controls, ownership selection, last-Owner conflict feedback and visible manual demo date.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-021, FR-022, FR-024, FR-036, FR-037, FR-039, SC-004, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T108 [US7] Verify and record ownership/role management acceptance in `specs/001-property-management/validation/us7.md`

  **Priority:** P1 | **Depends:** T107 | **Gates:** G0, G6, G7.

  **Acceptance:** Record actual backend/UI allow/deny, session invalidation, owner protection and manual date-change results; no independent QA or dispatch claimed.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-036, FR-037, FR-039, SC-001, SC-005); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 5: US1 — Properties and Resources (P1)

**Independent acceptance:** Create/edit/reopen properties/resources and reject capacity/mode/ownership violations.

- [ ] T031 [US1] Define property and resource NestJS operation contracts in `backend/Src/Contracts/property.contract.ts`

  **Priority:** P1 | **Depends:** T008, T020 | **Gates:** G0, G6, G7.

  **Acceptance:** Define Owner creation/ownership/mode versus Manager editable fields, resource capacity, contract-derived availability, validation, operation IDs, errors and property scope.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-029, FR-037); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T032 [US1] Write property/resource Manager and integration tests in `backend/tests/unit/properties-manager.test.ts`, `backend/tests/integration/properties.test.ts`

  **Priority:** P1 | **Depends:** T031 | **Gates:** G0, G6, G7.

  **Acceptance:** Cover save/reopen, invalid input, capacity fields, transaction failure, protected scope and preserved prior records; observe intended RED.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-026, FR-028, FR-029, SC-001); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T033 [US1] Implement property and resource business operations in `backend/Managers/properties-manager.ts`

  **Priority:** P1 | **Depends:** T032 | **Gates:** G0, G6, G7.

  **Acceptance:** Property/resource operations preserve owner/mode constraints and validate capacity reductions against effective contract intervals using the same transactional lock protocol as Contract Manager.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-028, FR-029, FR-030, FR-037); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T034 [US1] Implement property and resource HTTP operation handlers in `backend/Src/Handler/properties-logic.ts`, `backend/Src/Handler/resources-logic.ts`, `backend/Src/app.module.ts`

  **Priority:** P1 | **Depends:** T031, T033, T103 | **Gates:** G0, G6, G7.

  **Acceptance:** Implement and register property/resource handlers/providers in the root or explicitly owned feature module. Exported schema contains the operations; role and capacity checks precede success.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-024, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T035 [US1] Regenerate the client for property/resource operations in `backend/OpenAPI/openapi.json`, `frontend/Generated/`

  **Priority:** P1 | **Depends:** T020, T034, T104 | **Gates:** G0, G6, G7.

  **Acceptance:** Generated operations/models compile and match the exported property/resource contract without manual generated-file edits.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T036 [US1] Write property/resource VM tests in `frontend/tests/properties.vm.test.ts`

  **Priority:** P1 | **Depends:** T035 | **Gates:** G0, G6, G7.

  **Acceptance:** Test list/detail/forms, validation feedback, loading/empty/error states, generated-client use and query invalidation with intended RED.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-020, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T037 [US1] Write property/resource user-journey acceptance tests in `tests/e2e/properties.spec.ts`

  **Priority:** P1 | **Depends:** T030, T035 | **Gates:** G0, G6, G7.

  **Acceptance:** Define create/edit/reopen, invalid-save preservation and capacity display checks across representative device/theme contexts before Views are built.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-021, FR-022, FR-026, SC-001, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T038 [US1] Define property/resource presentation models in `frontend/Models/property.ts`

  **Priority:** P1 | **Depends:** T035, T036 | **Gates:** G0, G6, G7.

  **Acceptance:** Represent display/form concepts using generated DTOs at the boundary without independently duplicating API request/response interfaces.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T039 [US1] Implement property/resource presentation actions in `frontend/VMs/properties.vm.ts`

  **Priority:** P1 | **Depends:** T036, T038 | **Gates:** G0, G6, G7.

  **Acceptance:** VM tests pass; successful changes refresh relevant server queries, errors preserve user input, and Views do not make raw API calls.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-020, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T040 [US1] Implement property/resource list, detail and form Views in `frontend/Views/Properties.tsx`, `frontend/Views/Resources.tsx`, `frontend/Views/App.tsx`, `frontend/Views/AppShell.tsx`

  **Priority:** P1 | **Depends:** T027, T037, T039, T108 | **Gates:** G0, G6, G7.

  **Acceptance:** Implement property/resource forms/list/detail plus route/nav registration. Owner-only creation/mode/owner actions and scoped Manager edits follow policy, with contract-derived occupancy and responsive/theme behavior.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-001, FR-002, FR-003, FR-021, FR-022, FR-023, FR-026, FR-029); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T041 [US1] Verify and record US1 acceptance in `specs/001-property-management/validation/us1.md`

  **Priority:** P1 | **Depends:** T040 | **Gates:** G0, G6, G7.

  **Acceptance:** Record backend, VM and browser results proving create/edit/reopen, relationship consistency and invalid-save behavior; do not claim independent QA.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 6: US2 — Tenants and Contract Occupancy (P1)

**Independent acceptance:** Tenant contact CRUD and current/upcoming/ended occupancy from valid isolated contract fixtures, with no manual movement actions.

- [ ] T042 [US2] Define tenant CRUD and read-only contract-occupancy contracts in `backend/Src/Contracts/stay.contract.ts`

  **Priority:** P1 | **Depends:** T008, T034 | **Gates:** G0, G6, G7.

  **Acceptance:** Define tenant contacts and read-only Stay/history/date projections. No movement/status-mutation endpoints or manual arrival/departure fields. Assignment writes belong to contract operations.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008, FR-031, FR-033); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T043 [US2] Write tenant CRUD and contract-projection boundary tests in `backend/tests/unit/stays-manager.test.ts`, `backend/tests/unit/tenants-manager.test.ts`

  **Priority:** P1 | **Depends:** T042 | **Gates:** G0, G6, G7.

  **Acceptance:** Test tenant create/contact edit/invalid data and contract start-inclusive/end-exclusive, termination, future terms and history using isolated fixture contracts; no manual check-in/out transitions. Standalone Owner creation and Manager scoped edits are covered; Manager creation with a first contract is verified in T056.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008, FR-031, FR-033, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T044 [US2] Write fixture-based occupancy and capacity-edit integration tests in `backend/tests/integration/occupancy.test.ts`

  **Priority:** P1 | **Depends:** T042 | **Gates:** G0, G6, G7.

  **Acceptance:** Using persisted contract fixtures, test shared capacity/date projection, capacity reduction rejection and failed/concurrent capacity edits. Full concurrent contract mutation coverage is T109 after its contract definitions exist.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-003, FR-005, FR-028, FR-029, FR-030, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T045 [US2] Implement tenant record business operations in `backend/Managers/tenants-manager.ts`

  **Priority:** P1 | **Depends:** T043 | **Gates:** G0, G6, G7.

  **Acceptance:** Maintain tenant name/contact fields with scope validation; tenant identity is separate from contract-derived history. Tenant CRUD tests from T043 pass. Standalone unassigned creation is Owner-only; scoped Managers update visible contacts. Atomic Manager new-contact creation is Contract Manager responsibility in T058.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-024, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T046 [US2] Implement read-only contract-derived occupancy projections in `backend/Managers/stays-manager.ts`

  **Priority:** P1 | **Depends:** T033, T043, T044, T045 | **Gates:** G0, G6, G7.

  **Acceptance:** Project current/upcoming/ended occupancy and availability from effective contract terms in Asia/Taipei. T043/T044 pass; no independent writable Stay/movement authority is introduced.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-003, FR-005, FR-006, FR-007, FR-008, FR-028, FR-029, FR-030, FR-031, FR-033); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T047 [US2] Implement and register tenant CRUD and occupancy-read handlers in `backend/Src/Handler/tenants-logic.ts`, `backend/Src/Handler/stays-logic.ts`, `backend/Src/app.module.ts`

  **Priority:** P1 | **Depends:** T042, T045, T046 | **Gates:** G0, G6, G7.

  **Acceptance:** Register tenant CRUD and read-only Stay/projection operations/providers; document scope/errors and expose them in generated schema. No check-in/out endpoint exists.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008, FR-024, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T048 [US2] Regenerate the client for tenant/stay operations in `backend/OpenAPI/openapi.json`, `frontend/Generated/`

  **Priority:** P1 | **Depends:** T035, T047 | **Gates:** G0, G6, G7.

  **Acceptance:** Generation is serialized after property/resource export and all new tenant/stay operations compile.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T049 [US2] Write tenant/contact and contract-occupancy VM/journey tests in `frontend/tests/stays.vm.test.ts`, `tests/e2e/stays.spec.ts`

  **Priority:** P1 | **Depends:** T040, T048 | **Gates:** G0, G6, G7.

  **Acceptance:** Cover contact edits, invalid/out-of-scope input, current/upcoming/ended contract fixtures, history and explicit demo-date refresh before implementing Views.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-020, FR-030, FR-031, SC-001, SC-003, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T050 [US2] Define tenant/contact and contract-occupancy presentation models in `frontend/Models/stay.ts`

  **Priority:** P1 | **Depends:** T048, T049 | **Gates:** G0, G6, G7.

  **Acceptance:** Reuse generated DTOs for contacts and read-only contract assignment/history; no independently editable movement or occupancy business rules.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T051 [US2] Implement tenant/contact and occupancy presentation actions in `frontend/VMs/stays.vm.ts`

  **Priority:** P1 | **Depends:** T049, T050 | **Gates:** G0, G6, G7.

  **Acceptance:** Generated contact/projection operations drive tests; refresh scoped queries on permitted updates/manual refresh/explicit demo-date changes, without manual movement commands.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008, FR-020, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T052 [US2] Implement and register tenant and contract-occupancy Views in `frontend/Views/Tenants.tsx`, `frontend/Views/Stays.tsx`, `frontend/Views/App.tsx`, `frontend/Views/AppShell.tsx`

  **Priority:** P1 | **Depends:** T027, T049, T051 | **Gates:** G0, G6, G7.

  **Acceptance:** Register usable tenant/history screens with contract-derived status and contact forms; no check-in/out button. Show proposed contract intervals and permitted role actions across themes.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-004, FR-005, FR-006, FR-007, FR-008, FR-021, FR-022, FR-023, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T053 [US2] Integrate resource refresh for contract projections and explicit demo-date changes in `frontend/VMs/properties.vm.ts`, `frontend/Views/Resources.tsx`

  **Priority:** P1 | **Depends:** T040, T046, T052 | **Gates:** G0, G6, G7.

  **Acceptance:** Resource/tenant/history views agree when the explicit demo date or valid fixture contracts change; successful later contract mutations use the same query invalidation path. Serialize shared-file edits.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-003, FR-020, FR-029, FR-030); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T054 [US2] Verify and record US2 acceptance in `specs/001-property-management/validation/us2.md`

  **Priority:** P1 | **Depends:** T053 | **Gates:** G0, G6, G7.

  **Acceptance:** Record tenant CRUD, contract start/end/termination projections, shared capacity and cross-view agreement using fixture contracts; reserve actual contract mutation evidence for US3.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-003, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 7: US3 — Contracts and Documents (P2)

**Independent acceptance:** Create/edit/terminate contracts, test cross-path capacity concurrency, and upload/retrieve permitted document bytes.

- [ ] T055 [US3] Define contract/document operation contracts in `backend/Src/Contracts/contract.contract.ts`, `backend/Src/Contracts/document.contract.ts`

  **Priority:** P2 | **Depends:** T008, T047 | **Gates:** G0, G6, G7.

  **Acceptance:** Specify contract assignment/date/rent/deposit/termination and protected document operations using demo policy. Contract writes are occupancy authority and exported errors include shared capacity conflicts. Define createContract with exactly one of tenant_id or new_tenant contact details; Manager new contacts require this atomic scoped first-contract flow.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013, FR-024, FR-025, FR-033); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T056 [US3] Write contract classification and effective-term tests in `backend/tests/unit/contracts-manager.test.ts`

  **Priority:** P2 | **Depends:** T055 | **Gates:** G0, G6, G7.

  **Acceptance:** Test Upcoming/Active/Expiring Soon/Expired/Terminated precedence, inclusive/exclusive dates, future/effective termination and explicit date refresh with no manual movements. Cover atomic new-tenant/first-contract creation, out-of-scope denial and rollback leaving no orphan tenant.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-032, FR-033, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T057 [US3] Write protected upload, BYTEA retrieval and failure integration tests in `backend/tests/integration/documents.test.ts`

  **Priority:** P2 | **Depends:** T055 | **Gates:** G0, G6, G7.

  **Acceptance:** Cover metadata/relationship preservation, unchanged bytes, approved limits/types, denied access, failed upload rollback and omission of binaries from ordinary lists.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-012, FR-013, FR-024, FR-025, FR-026, FR-028, SC-005, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T109 [US3] Write contract-mutation versus capacity-edit concurrency tests in `backend/tests/integration/contract-capacity.test.ts`

  **Priority:** P2 | **Depends:** T033, T055 | **Gates:** G0, G6, G7.

  **Acceptance:** Test interval event-sweep, shared full-room rejection, simultaneous term/capacity edits, reassignment lock order and termination/end exclusivity; both mutation paths must preserve capacity.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-003, FR-028, FR-029, FR-030, FR-031, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T058 [US3] Implement transactional contract assignment, edit and termination operations in `backend/Managers/contracts-manager.ts`

  **Priority:** P2 | **Depends:** T046, T056, T109 | **Gates:** G0, G6, G7.

  **Acceptance:** Contract Manager owns assignments and term changes; use the same resource locks as capacity edits, enforce event-sweep capacity and transaction/version guards, and pass T056/T109. Atomically create new tenant contact with its scoped first contract when new_tenant is supplied; no independent tenant grants or duplicate assignment authority.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-032, FR-033); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T059 [US3] Implement protected transactional document storage operations in `backend/Managers/documents-manager.ts`

  **Priority:** P2 | **Depends:** T057 | **Gates:** G0, G6, G7.

  **Acceptance:** Persist metadata/BYTEA and applicable tenant/property/stay/contract relationships atomically; approved access/restrictions and byte-integrity tests pass.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-012, FR-013, FR-024, FR-025, FR-028, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T060 [US3] Implement contract/document HTTP operation handlers in `backend/Src/Handler/contracts-logic.ts`, `backend/Src/Handler/documents-logic.ts`, `backend/Src/app.module.ts`

  **Priority:** P2 | **Depends:** T055, T058, T059 | **Gates:** G0, G6, G7.

  **Acceptance:** Implement and register protected contract/document operations and their providers; exported schema includes them, occupancy derives from resulting contract terms and file data stays BYTEA.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013, FR-024, FR-025, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T061 [US3] Regenerate the client for contract/document operations in `backend/OpenAPI/openapi.json`, `frontend/Generated/`

  **Priority:** P2 | **Depends:** T048, T060 | **Gates:** G0, G6, G7.

  **Acceptance:** Serialized generation preserves prior operations, compiles file-transfer types and matches exported contracts without manual edits.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T062 [US3] Write contract/document VM and browser acceptance tests in `frontend/tests/contracts.vm.test.ts`, `tests/e2e/contracts-documents.spec.ts`

  **Priority:** P2 | **Depends:** T052, T061 | **Gates:** G0, G6, G7.

  **Acceptance:** Define association, expiry display, upload/download, permission/size/type failures and retained input before frontend behavior implementation. Include Manager new-contact creation through the first-contract form and failed-save rollback feedback.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013, FR-025, FR-026, SC-001, SC-003, SC-004, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T063 [US3] Define contract/document presentation models in `frontend/Models/contract.ts`, `frontend/Models/document.ts`

  **Priority:** P2 | **Depends:** T061, T062 | **Gates:** G0, G6, G7.

  **Acceptance:** Represent agreement forms and metadata display using generated transport types; do not place file contents into list/presentation caches unnecessarily.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T064 [US3] Implement contract/document presentation actions in `frontend/VMs/contracts.vm.ts`

  **Priority:** P2 | **Depends:** T062, T063 | **Gates:** G0, G6, G7.

  **Acceptance:** VM tests pass for agreement edits, metadata upload/download, failed-operation feedback and affected query invalidation.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013, FR-020, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T065 [US3] Implement contract and document Views in `frontend/Views/Contracts.tsx`, `frontend/Views/Documents.tsx`, `frontend/Views/App.tsx`, `frontend/Views/AppShell.tsx`

  **Priority:** P2 | **Depends:** T027, T062, T064 | **Gates:** G0, G6, G7.

  **Acceptance:** Register agreement/document routes and navigation; forms manage tenant/resource terms and show proposed classifications and metadata; enforce allowed actions via server plus clear role-aware UI. Provide the Manager new-contact/initial-contract flow in the contract form; Owner standalone contacts remain supported.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-010, FR-011, FR-012, FR-013, FR-021, FR-022, FR-023, FR-025); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T066 [US3] Link associated contracts/documents from property and tenant/stay records in `frontend/Views/Properties.tsx`, `frontend/Views/Tenants.tsx`, `frontend/Views/Stays.tsx`

  **Priority:** P2 | **Depends:** T040, T052, T065 | **Gates:** G0, G6, G7.

  **Acceptance:** Applicable records open the correct associated agreement/files; ownership/access scope and navigation context are preserved.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-009, FR-012, FR-013, FR-020, FR-024); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T067 [US3] Verify and record US3 acceptance in `specs/001-property-management/validation/us3.md`

  **Priority:** P2 | **Depends:** T066 | **Gates:** G0, G6, G7.

  **Acceptance:** Record contract date/termination results, upload restrictions, byte integrity, denied access and responsive/theme user journeys.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-003, SC-004, SC-005, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 8: US4 — Rental Payments (P2)

**Independent acceptance:** Explicit obligations, exact due/paid/balance, status precedence, reversal/replacement, overpayment and duplicate cases.

- [ ] T068 [US4] Define rent-obligation, payment and adjustment operation contracts in `backend/Src/Contracts/payment.contract.ts`

  **Priority:** P2 | **Depends:** T008, T047 | **Gates:** G0, G6, G7.

  **Acceptance:** Define explicit obligation creation and exact whole-TWD payment/reversal operations, due-day/period inputs, manual partial amounts, precedence and request-key conflict rules; no automatic proration.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-032, FR-034, FR-035); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T069 [US4] Write billing, balance and status-precedence unit tests in `backend/tests/unit/payments-manager.test.ts`

  **Priority:** P2 | **Depends:** T068 | **Gates:** G0, G6, G7.

  **Acceptance:** Use policy fixtures for explicit periods/due dates, integer-TWD validation, Paid/Overdue/Partial/Unpaid precedence, reversals/replacements and rejected overpayment; record meaningful RED.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-032, FR-034, FR-035, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T070 [US4] Write payment duplicate, correction and concurrency integration tests in `backend/tests/integration/payments.test.ts`

  **Priority:** P2 | **Depends:** T068 | **Gates:** G0, G6, G7.

  **Acceptance:** Assert identical-key retries return the original result, conflicting reuse fails, reversals remain single/append-only, overpayments preserve records and concurrent/failed writes retain valid balances.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-020, FR-028, FR-035, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T071 [US4] Implement rental-obligation and due-period operations in `backend/Managers/billing-manager.ts`

  **Priority:** P2 | **Depends:** T046, T069 | **Gates:** G0, G6, G7.

  **Acceptance:** Create/retrieve explicit unique contract-period obligations with stored due dates/amounts. Do not auto-post historic or prorated charges; policy cases pass.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-017, FR-032); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T072 [US4] Implement transactional payment and adjustment operations in `backend/Managers/payments-manager.ts`

  **Priority:** P2 | **Depends:** T069, T070, T071 | **Gates:** G0, G6, G7.

  **Acceptance:** Paid totals, outstanding balance and status follow confirmed rules atomically; duplicate/concurrency/rollback cases pass.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-028, FR-032, FR-034, FR-035); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T073 [US4] Implement rental payment HTTP operation handlers in `backend/Src/Handler/payments-logic.ts`, `backend/Src/app.module.ts`

  **Priority:** P2 | **Depends:** T068, T071, T072, T060 | **Gates:** G0, G6, G7.

  **Acceptance:** Register scoped obligation/payment/reversal operations/providers and export schemas. Serialize root-module edits after contract/document registration; retain documented conflicts and exact amounts.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-024, FR-026, FR-035); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T074 [US4] Regenerate the client for rental payment operations in `backend/OpenAPI/openapi.json`, `frontend/Generated/`

  **Priority:** P2 | **Depends:** T061, T073 | **Gates:** G0, G6, G7.

  **Acceptance:** Serialized generation retains existing APIs and compiles payment amounts/status/adjustment operations without manual generated edits.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T075 [US4] Write payment VM and rental-period user-journey tests in `frontend/tests/payments.vm.test.ts`, `tests/e2e/payments.spec.ts`

  **Priority:** P2 | **Depends:** T052, T074 | **Gates:** G0, G6, G7.

  **Acceptance:** Cover amount due/paid/balance, unpaid tenant identification, Overdue/partial precedence, adjustments, duplicates and error/input preservation before UI implementation.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-020, FR-026, FR-034, FR-035, SC-001, SC-003, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T076 [US4] Define payment presentation models and exact-money display mapping in `frontend/Models/payment.ts`

  **Priority:** P2 | **Depends:** T074, T075 | **Gates:** G0, G6, G7.

  **Acceptance:** Display/format the approved currency and precision without floating-point business calculations or duplicated API models.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-032); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T077 [US4] Implement rental payment presentation actions in `frontend/VMs/payments.vm.ts`

  **Priority:** P2 | **Depends:** T075, T076 | **Gates:** G0, G6, G7.

  **Acceptance:** Generated operations drive period filters, recording and approved adjustments; success invalidates balances/status queries and duplicate clicks are handled safely.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-020, FR-026, FR-035); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T078 [US4] Implement rental-period and outstanding-rent Views in `frontend/Views/Payments.tsx`, `frontend/Views/PaymentPanel.tsx`, `frontend/Views/App.tsx`, `frontend/Views/AppShell.tsx`

  **Priority:** P2 | **Depends:** T027, T075, T077, T065 | **Gates:** G0, G6, G7.

  **Acceptance:** Register payment routes/navigation and show due/paid/outstanding amounts, overdue/partial cues and permitted actions. Owner/Manager create obligations and payments; Viewer reads only.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-016, FR-017, FR-021, FR-022, FR-023, FR-034, FR-035); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T079 [US4] Integrate payment panels with tenant/stay records in `frontend/Views/Tenants.tsx`, `frontend/Views/Stays.tsx`

  **Priority:** P2 | **Depends:** T066, T078 | **Gates:** G0, G6, G7.

  **Acceptance:** The selected tenant/stay shows its own payment periods/status; saved payments refresh associated views without leaking another property scope.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-014, FR-015, FR-017, FR-020, FR-024); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T080 [US4] Verify and record US4 acceptance in `specs/001-property-management/validation/us4.md`

  **Priority:** P2 | **Depends:** T079 | **Gates:** G0, G6, G7.

  **Acceptance:** Record exact-money/date fixtures, duplicate/concurrent/failure cases, correction/overpayment outcomes and browser workflows.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-003, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 9: US5 — Dashboard (P2)

**Independent acceptance:** Compare scoped dashboard totals and drill-downs to fixed-date golden results.

- [ ] T081 [US5] Define dashboard metric and drill-down contracts in `backend/Src/Contracts/dashboard.contract.ts`

  **Priority:** P2 | **Depends:** T008, T047, T060, T073 | **Gates:** G0, G6, G7.

  **Acceptance:** Define the nine core metric categories with contract starts/ends replacing movements, explicit outstanding-period counts and separate TWD totals; share property/demo-date/filter context.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-020, FR-033); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T082 [US5] Write dashboard aggregate and drill-down consistency tests in `backend/tests/integration/dashboard.test.ts`

  **Priority:** P2 | **Depends:** T081 | **Gates:** G0, G6, G7.

  **Acceptance:** Known fixtures cover totals versus full record sets, empty data, date boundaries, pagination, shared occupancy, scope and concurrent refresh without unexplained discrepancies.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-020, FR-028, SC-002, SC-003); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T083 [US5] Implement dashboard calculations and shared filtered queries in `backend/Managers/dashboard-manager.ts`

  **Priority:** P2 | **Depends:** T046, T058, T072, T082 | **Gates:** G0, G6, G7.

  **Acceptance:** Every metric reuses authoritative rules and matching detail filters/date context; T082 passes and Redis never changes business truth.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-020, FR-033); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T084 [US5] Implement dashboard HTTP operation handlers in `backend/Src/Handler/dashboard-logic.ts`, `backend/Src/app.module.ts`

  **Priority:** P2 | **Depends:** T081, T083 | **Gates:** G0, G6, G7.

  **Acceptance:** Register dashboard handler/provider, expose schema operations, and enforce date/property scope identically for summary and drill-down records.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-020, FR-024, FR-026); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T085 [US5] Regenerate the client for dashboard operations in `backend/OpenAPI/openapi.json`, `frontend/Generated/`

  **Priority:** P2 | **Depends:** T074, T084 | **Gates:** G0, G6, G7.

  **Acceptance:** Serialized generation compiles all APIs and documents the final dashboard operation types without drift.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T086 [US5] Write dashboard VM and metric drill-down browser tests in `frontend/tests/dashboard.vm.test.ts`, `tests/e2e/dashboard.spec.ts`

  **Priority:** P2 | **Depends:** T079, T085 | **Gates:** G0, G6, G7.

  **Acceptance:** Test metric counts, empty/loading/error states, filter/date-preserving navigation and mutation refresh across supported device/theme contexts before UI implementation.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-020, FR-021, FR-022, FR-026, SC-002, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T087 [US5] Implement dashboard presentation state and query refresh in `frontend/VMs/dashboard.vm.ts`

  **Priority:** P2 | **Depends:** T086 | **Gates:** G0, G6, G7.

  **Acceptance:** Use generated responses and retained filter/date context. Refresh on page open/manual refresh, mutations and explicit demo-date changes; no background refresh scheduler.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-020); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T088 [US5] Implement the operational dashboard View in `frontend/Views/Dashboard.tsx`, `frontend/Views/App.tsx`, `frontend/Views/AppShell.tsx`

  **Priority:** P2 | **Depends:** T027, T086, T087 | **Gates:** G0, G6, G7.

  **Acceptance:** Register dashboard route/navigation and render scoped contract-driven metrics, empty states and separate outstanding TWD; show demo date and retain responsive/theme acceptance.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-018, FR-019, FR-021, FR-022, FR-023); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T089 [US5] Integrate drill-down filters into existing feature VMs in `frontend/VMs/properties.vm.ts`, `frontend/VMs/stays.vm.ts`, `frontend/VMs/contracts.vm.ts`, `frontend/VMs/payments.vm.ts`

  **Priority:** P2 | **Depends:** T053, T064, T077, T088 | **Gates:** G0, G6, G7.

  **Acceptance:** All dashboard destinations retain the same filters and business-date context; old feature journeys still pass after serialized shared-file updates.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-019, FR-020, SC-002); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T090 [US5] Verify and record US5 acceptance in `specs/001-property-management/validation/us5.md`

  **Priority:** P2 | **Depends:** T089 | **Gates:** G0, G6, G7.

  **Acceptance:** Record exact expected totals/full filtered lists, empty cases, mutation refresh and browser drill-down results with zero unexplained discrepancies.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-002, SC-003, SC-004); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Phase 10: Demo Import and Cross-Cutting Verification

**Checkpoint:** Follow resolved planning gates and dependencies; mark application work only after observed checks.

- [ ] T091 Verify cross-feature journeys, permissions and all device/theme combinations in `tests/e2e/regression.spec.ts`

  **Priority:** P1 | **Depends:** T030, T041, T054, T067, T080, T090 | **Gates:** G0, G6, G7.

  **Acceptance:** Verify the contract-driven journey, role/ownership boundaries, denied actions and basic four-device/two-theme essential workflows. No formal browser-certification matrix or background-clock project.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-020, FR-021, FR-022, FR-023, FR-024, FR-026, FR-028, SC-001, SC-002, SC-003, SC-004, SC-005, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T092 Record the small demo timing/session smoke in `specs/001-property-management/validation/performance.md`

  **Priority:** P1 | **Depends:** T005, T090 | **Gates:** G0, G6, G7.

  **Acceptance:** Record local environment and three-session common-action timings against the proposed two-second budget after policy review. This is a small manual smoke, not a new load/stress suite.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-008); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T111 Write repeatable seed/reset and golden-result integration tests in `backend/tests/integration/demo-fixtures.test.ts`

  **Priority:** P1 | **Depends:** T014, T017, T098, T099, T060, T073, T084, T103 | **Gates:** G0, G6, G7.

  **Acceptance:** Test reimport twice without duplicates, foreign keys/bytes, scoped golden API results after domain handlers exist, role-denied reset and non-demo refusal; separate import fixtures from app runtime expectations.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-038, FR-039, SC-002, SC-006, SC-007); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T110 Implement the explicit transactional demo fixture loader in `backend/prisma/seed.ts`, `backend/Src/Infrastructure/demo-fixtures.ts`, `package.json`

  **Priority:** P1 | **Depends:** T111, T060, T073, T103 | **Gates:** G0, G6, G7.

  **Acceptance:** Implement future demo:seed from static JSON with stable IDs, credential hashing from environment and BYTEA conversion. Atomic repeat/import/reset is explicit and isolated; integrate Owner-only reset without automatic startup seeding.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-038, FR-039, SC-006, SC-007); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T093 Verify migrations, backup restoration and document recovery in `backend/tests/operations/recovery.test.ts`, `specs/001-property-management/validation/recovery.md`

  **Priority:** P1 | **Depends:** T013, T014, T059, T072, T110 | **Gates:** G0, G6, G7.

  **Acceptance:** Verify fresh migration/one isolated backup-restore sample retains relational and BYTEA integrity; future fixture reimport meets the proposed five-minute recovery budget after services are ready.

  **Sources:** spec.md#functional-requirements / #success-criteria (FR-013, FR-028, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T094 Integrate the required build, generation and acceptance checks into CI in `.github/workflows/checks.yml`, `package.json`

  **Priority:** P1 | **Depends:** T091, T092, T093, T110 | **Gates:** G0, G6, G7.

  **Acceptance:** CI uses pinned install, generation drift, type/build and meaningful unit/integration/browser smoke checks; record manual demo timing/recovery evidence separately. No deployment, agent dispatch, formal browser certification or stress suite added.

  **Sources:** spec.md#functional-requirements / #success-criteria (Shared architecture/readiness prerequisite); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T095 Write the feature quickstart using actual implemented commands in `specs/001-property-management/quickstart.md`

  **Priority:** P1 | **Depends:** T094, T110, T111, T113 | **Gates:** G0, G6, G7.

  **Acceptance:** Refresh the existing design quickstart with actual implemented install/start/migrate/generate/seed/test commands and observed demo walkthrough outputs; keep secrets out. Document the Makefile commands and foreground up behavior; final startup is recorded after QA PASS.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-002, SC-003, SC-004, SC-005, SC-006); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

- [ ] T096 Record requirement coverage and final implementation verification evidence in `specs/001-property-management/validation/coverage.md`

  **Priority:** P1 | **Depends:** T091, T092, T093, T094, T095, T108, T110, T111 | **Gates:** G0, G6, G7.

  **Acceptance:** Map all FR-001–039 and SC-001–008 to observed evidence/open limits. Include contract authority, roles/ownership, demo clock, repeatable fixtures, basic device/theme smoke and preserved restrictions.

  **Sources:** spec.md#functional-requirements / #success-criteria (SC-001, SC-002, SC-003, SC-004, SC-005, SC-006, SC-007, SC-008); demo-policy.md; plan.md#project-structure / #verification-plan; Architecture.md#frontend / #backend / #api-flow.

## Dependency and Ownership Notes

T011/T012 provide runnable entries before T013 health checks; T019/T022 enhance them.
Backend module registration is serialized T019 -> T103 -> T034 -> T047 -> T060 -> T073 ->
T084. Client exports serialize T020 -> T104 -> T035 -> T048 -> T061 -> T074 -> T085.
Frontend router/nav changes serialize T028 -> T107 -> T040 -> T052 -> T065 -> T078 -> T088.
Role administration follows shared session infrastructure and the themed shell, before
property screens. US2 projects valid isolated contract fixtures; US3 later owns contract
mutations, so there is no dependency cycle between occupancy reads and contract editing.
T109 runs before T058 and covers contract writes plus existing resource-capacity edits.
T111 defines import/API golden tests after domain registrations; T110 implements the loader.

Prospective independent cohorts: T011/T012 after T010; T023/T024 after T022;
T036/T037 after their external prerequisites; T056/T057/T109 after their own prerequisites;
T069/T070 after T068. These are opportunities, not started agents or current [P] markers.
All shared-database test cohorts require isolated data/ports and no conflicting writes.

## Requirement and Success-Criterion Coverage

| Key | Planned tasks |
| --- | --- |
| FR-001 | T031, T032, T033, T034, T035, T036, T037, T038, T039, T040 |
| FR-002 | T031, T032, T033, T034, T035, T036, T037, T038, T039, T040 |
| FR-003 | T002, T031, T032, T033, T034, T035, T036, T037, T038, T039, T040, T044, T046, T049, T053, T109 |
| FR-004 | T042, T043, T045, T047, T048, T049, T050, T051, T052 |
| FR-005 | T002, T014, T042, T043, T044, T045, T046, T047, T048, T049, T050, T051, T052 |
| FR-006 | T002, T042, T043, T046, T047, T048, T049, T050, T051, T052 |
| FR-007 | T002, T042, T043, T046, T047, T048, T049, T050, T051, T052 |
| FR-008 | T002, T042, T043, T046, T047, T048, T049, T050, T051, T052 |
| FR-009 | T014, T055, T056, T058, T060, T061, T062, T063, T064, T065, T066 |
| FR-010 | T003, T055, T056, T058, T060, T061, T062, T063, T064, T065 |
| FR-011 | T003, T055, T056, T058, T060, T061, T062, T063, T064, T065 |
| FR-012 | T004, T055, T057, T059, T060, T061, T062, T063, T064, T065, T066 |
| FR-013 | T004, T014, T055, T057, T059, T060, T061, T062, T063, T064, T065, T066, T093 |
| FR-014 | T003, T014, T068, T069, T070, T071, T072, T073, T074, T075, T076, T077, T078, T079 |
| FR-015 | T003, T068, T069, T070, T071, T072, T073, T074, T075, T076, T077, T078, T079 |
| FR-016 | T003, T068, T069, T072, T073, T074, T075, T076, T077, T078 |
| FR-017 | T068, T069, T071, T072, T073, T074, T075, T077, T078, T079 |
| FR-018 | T081, T082, T083, T084, T085, T086, T087, T088, T099 |
| FR-019 | T081, T082, T083, T084, T085, T086, T087, T088, T089, T099 |
| FR-020 | T036, T039, T049, T051, T053, T064, T066, T070, T075, T077, T079, T081, T082, T083, T084, T086, T087, T089, T091 |
| FR-021 | T011, T024, T026, T027, T028, T029, T037, T040, T052, T065, T078, T086, T088, T091, T107 |
| FR-022 | T011, T023, T024, T025, T026, T027, T028, T029, T037, T040, T052, T065, T078, T086, T088, T091, T107 |
| FR-023 | T024, T026, T027, T029, T040, T052, T065, T078, T088, T091 |
| FR-024 | T004, T016, T017, T019, T021, T022, T028, T034, T045, T047, T055, T057, T059, T060, T066, T073, T079, T084, T091, T097, T100, T101, T102, T103, T105, T106, T107 |
| FR-025 | T004, T055, T057, T059, T060, T062, T065 |
| FR-026 | T018, T019, T021, T022, T032, T034, T036, T037, T039, T040, T045, T047, T051, T052, T057, T060, T062, T064, T073, T075, T077, T084, T086, T091 |
| FR-027 | T004, T018, T019 |
| FR-028 | T014, T015, T032, T033, T044, T046, T057, T059, T070, T072, T082, T091, T093, T109 |
| FR-029 | T002, T031, T032, T033, T040, T044, T046, T053, T109 |
| FR-030 | T002, T033, T044, T046, T049, T053, T109 |
| FR-031 | T002, T042, T043, T046, T049, T109 |
| FR-032 | T003, T056, T058, T068, T069, T071, T072, T076, T097, T112 |
| FR-033 | T003, T042, T043, T046, T055, T056, T058, T081, T083 |
| FR-034 | T003, T068, T069, T072, T075, T078 |
| FR-035 | T003, T068, T069, T070, T072, T073, T075, T077, T078 |
| FR-036 | T014, T097, T100, T101, T102, T103, T104, T105, T106, T107, T108, T112 |
| FR-037 | T014, T031, T033, T097, T100, T101, T102, T103, T104, T105, T106, T107, T108, T112 |
| FR-038 | T014, T097, T098, T099, T110, T111, T112 |
| FR-039 | T026, T097, T099, T100, T101, T103, T104, T105, T106, T107, T108, T110, T111, T112 |
| SC-001 | T032, T037, T041, T049, T054, T062, T067, T075, T080, T090, T091, T095, T096, T105, T108 |
| SC-002 | T082, T086, T089, T090, T091, T095, T096, T099, T111 |
| SC-003 | T043, T044, T049, T054, T056, T062, T067, T069, T070, T075, T080, T082, T090, T091, T095, T096, T099, T109 |
| SC-004 | T023, T024, T025, T026, T027, T028, T029, T030, T037, T041, T049, T054, T062, T067, T075, T080, T086, T090, T091, T095, T096, T107 |
| SC-005 | T016, T017, T057, T067, T091, T095, T096, T100, T101, T102, T103, T105, T107, T108 |
| SC-006 | T057, T059, T062, T067, T091, T093, T095, T096, T099, T110, T111 |
| SC-007 | T096, T098, T099, T110, T111 |
| SC-008 | T092, T096 |

## Counts and Readiness

| Group | Tasks |
| --- | ---: |
| Shared | 35 |
| US1 | 11 |
| US2 | 13 |
| US3 | 14 |
| US4 | 13 |
| US5 | 10 |
| US6 | 8 |
| US7 | 9 |
| Total | 113 |

Completed planning/data/compatibility IDs: T001, T002, T003, T004, T005, T006, T007,
T008, T009, T097, T098, T099, T112. Coding currently reports T010 in progress; refer to
handoff.json/coding-report.md for live verified progress rather than this historical count.
Remaining tasks follow explicit dependencies. Local Makefile work is T113; actual final
Compose startup follows QA PASS and is tracked in pipeline-state.json, avoiding a QA cycle.
Suggested demo increment: minimal services -> access/roles and themed shell -> properties/
contract occupancy -> contract/documents -> payments -> dashboard -> explicit demo import.

## Generation/Verification Scope

The installed helpers resolve this feature; no extensions.yml hooks are configured.
Current implementation and Coding/QA dispatch are authorized. PM semantic and structural
planning checks passed, and isolated compatibility/static fixture evidence is recorded.
Application completion requires the task acceptance checks and independent QA. The local
Compose delivery addendum adds Makefile verification before QA and actual startup after QA.
Protected PRD/architecture/spec/constitution remain preserved.
