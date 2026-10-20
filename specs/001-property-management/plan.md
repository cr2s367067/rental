# Implementation Plan: Property Management Demo

**Feature**: 001-property-management | **Amended**: 2026-10-19
**Branch**: Existing master; no branch created/switched
**Spec**: [spec.md](spec.md)
**Status**: Implementation authorized; current planning gates/evidence and handoff are recorded separately.

## Summary

Retain the architecture's React/Bun/NestJS/PostgreSQL/Prisma/Redis stack and generated API
client flow. Contracts now own occupancy; Stay is a read-only projection. Add property
ownership, Owner/Manager/Viewer administration and scoped grants. Draft billing/access
policies are centralized in [demo-policy.md](demo-policy.md). Deterministic synthetic
fixtures and golden outputs are in [mock-data-plan.md](mock-data-plan.md).

The subsequent [execution authorization](execution-authorization.md) enables application
implementation and the complete PM → Coding → QA workflow for this demo baseline.
Original PRD/Architecture, constitution and specification are preserved. Old check-in/out
examples are superseded by the demo amendment. Deployment is outside this request.

## Technical Context

| Area | Decision |
| --- | --- |
| Language/runtime | TypeScript 5.9.3 strict mode, Bun 1.3.14; exact pins in toolchain.json. |
| Frontend | React/Vite, Tailwind CSS, shadcn/ui, MVVM Views/VMs/Models. |
| State/forms | TanStack Query server state; Zustand only if needed for local state; React Hook Form/Zod. |
| Backend | NestJS, contract definitions before business handlers, Managers for use cases/transactions. |
| API/client | Backend-generated OpenAPI/Swagger UI; hey-api generates all frontend communication/types. |
| Persistence | PostgreSQL, Prisma, Prisma Migrate; BYTEA document storage and metadata. |
| Redis | Temporary sessions/cache/rate limiting; never sole durable payment/idempotency authority. |
| Services | Separate frontend/backend; four-service Docker Compose with PostgreSQL/Redis. |
| Environment | Isolated development/staging/production configuration, secrets outside version control. |
| Calendar | Asia/Taipei; demo fixture date 2026-10-19, visibly frozen in demo mode. |
| Proposed money | Exact whole TWD, explicit obligation due dates/partial amounts; see policy. |
| Verification | Bun/DOM tests and API/database integration; basic responsive/theme acceptance, not formal browser certification. |
| Proposed demo budget | Three sessions, common actions within two seconds locally; small fixture/recovery smoke only. |
| Scope | Seven stories, 39 functional requirements, eight success criteria. |

No application package manifests/runtime implementation exist at PM handoff. Exact pins
and isolated executable compatibility results are recorded in [research](research.md),
[toolchain.json](toolchain.json) and [compatibility-evidence.json](compatibility-evidence.json).
The drafted demo defaults are the implementation baseline under the later authorization.
Application runtime acceptance remains required; compatibility probes do not satisfy it.

## Constitution Check

| Gate | Current disposition | Evidence / limits |
| --- | --- | --- |
| I. Centralized consistency | PASS for planning | Contract authority, transactional interval/capacity and payment invariants in model/policy. |
| II. Backend-owned API | Aligned in design | NestJS source -> generated OpenAPI -> generated client; no manual duplicate runtime schema. |
| III. Stack/storage | PASS for planning | Approved stack retained; exact pins and isolated BYTEA/migration/transaction evidence supplied. |
| IV. Devices/themes | Retained | Basic four-device/two-theme acceptance remains despite no formal browser matrix. |
| V. Protection/verification | PASS for planning | Owner/Manager/Viewer grants, document rules and meaningful tests specified; application QA remains pending. |
| Readiness | Reevaluate through analysis.md and handoff validator | Version/policy prerequisites resolved; structural and semantic checks precede dispatch. |
| Execution scope | PASS | Later user instruction enables implementation and Coding/QA; retry count 0/ACTIVE. |

No constitutional exception is requested. User-approved demo simplifications do not
remove server-side protection, responsive/theme support or relevant integrity tests.
Phase 0/1 planning is supported by the current research/design records. This does not
claim application acceptance, independent QA or production readiness.

## Project Structure

### Documentation

Existing feature files: spec.md, plan.md, research.md, tasks.md, checklists/requirements.md.
New/reconciled design: [data-model.md](data-model.md),
[contracts/api-design.md](contracts/api-design.md), [quickstart.md](quickstart.md),
[demo-policy.md](demo-policy.md), [mock-data-plan.md](mock-data-plan.md),
[mock-data/fixtures.json](mock-data/fixtures.json),
[mock-data/expected-results.json](mock-data/expected-results.json).

### Future source ownership

```text
frontend/
├── main.tsx                    (minimal runnable setup entry)
├── Views/App.tsx               (router and per-feature registration)
├── Views/AppShell.tsx          (per-feature navigation)
├── Views/                      (including Users and PropertyAccess screens)
├── VMs/
├── Models/
├── Services/
├── Generated/
└── tests/
backend/
├── Src/main.ts                 (minimal setup entry, later enhanced)
├── Src/app.module.ts           (setup module and per-feature registrations)
├── Src/Handler/
├── Src/Contracts/
├── Src/Infrastructure/
├── Managers/
├── OpenAPI/openapi.yaml        (generated export)
├── prisma/schema.prisma
├── prisma/seed.ts              (future explicit fixture loader; not created now)
└── tests/
tests/e2e/
```

Shared source ownership is serialized. T011/T012 own minimal runnable entries before
T013's four-service health checks; T019/T022 enhance existing bootstrap/provider files.
Domain handler tasks also own their app.module registrations. Domain View tasks own
App routes/AppShell navigation; schema checks confirm registered operations appear.
Role administration is US7 and extends the existing access boundary rather than creating
an independent authorization system or a client-authoritative demo role switch.

## Phase 0 — Decisions and Evidence

Confirmed changes: contract authority, ownership/roles in scope, Asia/Taipei, demo scope,
skipped background refresh/formal matrix. Drafted defaults: TWD, due/expiry windows,
permissions, sessions, uploads, adjustment behavior and smoke budgets. Review against
[policy](demo-policy.md); no product clarification marker is replaced by an undisclosed guess.

The pinned compatibility set is verified in isolated scratch probes: compiled NestJS on
Bun with DI/HTTP; OpenAPI 3.0.0 export and hey-api client compilation; Prisma migrations,
exact decimal/BYTEA/transaction locks against PostgreSQL 17.11; Redis 7.4.11; React/Vite
with Tailwind/query/forms and Bun DOM tests. T013 verifies the actual four-service app.

## Phase 1 — Draft Design

### Contract authority and model

[data-model.md](data-model.md) defines users/grants, property owner/mode, resources,
tenants, contracts, read-only Stay projections, obligations, append-only payments,
idempotency, and separate metadata/BYTEA payloads. No independent arrival/departure writes.

Use inclusive start/exclusive effective end in Asia/Taipei. A capacity event sweep with
end events before start events validates shared occupancy. Contract mutations and capacity
edits take the same stable-order resource transaction lock. Contract Manager owns writes;
Stay Manager projects facts and cannot override the contract.

### API and UI integration

[contracts/api-design.md](contracts/api-design.md) specifies role/property administration,
property/resource, tenant/contract projection, contract/document, payment, dashboard and
demo context operations. Define validation/security/errors before implementation and
export schemas only from backend definitions. Document paths here are review intent.

Every added handler/provider is registered by its domain task. Every added screen has
explicit routing/navigation ownership. Managers enforce business and role rules; Views
bind VMs, which use generated-client services and TanStack Query. Server state is not
independently copied into local stores. Verify allowed and denied operations directly.

### Demo fixtures and clock

Fixture data is synthetic and deterministic; it contains no passwords/tokens. A future
loader converts content_utf8 to BYTEA and handles cyclic primary-document links in a
second pass inside the same transaction. Import/reset requires explicit isolated demo
mode. Reimports use stable IDs without duplicate payments. No database is seeded now.

Fixed-date Owner totals: four properties, eleven units, five occupied/six available,
six current tenants, one upcoming start/end, five outstanding periods/TWD 74000,
and two expiring contracts. Scoped Manager/Viewer golden results are separately stored.

### Documents and operational scope

Draft upload policy allows PDF/PNG/JPEG/text up to 10 MiB; contents remain server-protected.
Viewer gets metadata only. Passwords are configured through environment, hashed by a future
loader, and omitted from fixture JSON. Retain data until explicit demo reset. Keep a small
backup/restore integrity check; do not introduce a production compliance/retention project.

## Verification Plan

- Fixture checks now: JSON, IDs/FKs, grants, date intervals/capacity, amounts/statuses,
  Owner/Manager/Viewer totals, document sizes/hashes and timestamps.
- Future bootstrap checks: runnable setup before service-health acceptance; module/route
  registration before exported-schema and user-navigation acceptance.
- Future business checks: contract/capacity/termination, exact billing/reversals/retries,
  permission boundaries, role escalation/last Owner and document denial/integrity.
- Future UI checks: representative essential workflows in four device categories/both
  themes. No formal multi-browser certification or automatic time-refresh project.
- Demo time changes recompute on page open/manual refresh/successful mutation/explicit
  clock change; no scheduler. Proposed timing/recovery budgets use small smoke evidence.

Runtime builds/tests, seed/reset, independent QA and implementation analysis PASS are not
claimed. The [quickstart](quickstart.md) distinguishes present fixture review from future
commands that do not exist yet. No agent dispatch is added to any future check pipeline.

## Delivery and Complexity

Minimal workspace/services -> access/session foundation -> roles/ownership UI and shared
themed shell -> properties/resources -> tenants/read-only contract occupancy -> contract
editing/documents -> payments -> dashboard -> demo loader and full walkthrough verification.
Predefined contracts may be inserted as isolated test fixtures before contract editing
exists; this avoids a cycle between US2 projection and US3 contract mutation.

Existing task IDs are preserved; new remediation/role/mock-data IDs are appended and
explicit dependencies determine execution, not numeric ID order. All implementation
is authorized by the later instruction; unchecked tasks still require actual verification.
No constitutional waiver, unrelated infrastructure upgrade or production feature added.

## Local delivery addendum

The later [Compose delivery request](compose-delivery-addendum.md) adds root Makefile
up/down/build/reload convenience commands (T113), with sequential failure-stopping reload
and volume-preserving down. T095 documents the exact foreground command semantics.
Coding implements and QA verifies these targets. After QA PASS, closing PM starts the
four services with docker compose up -d, verifies health/actual app URL and records delivery.
This explicitly authorized local startup does not add a remote deployment scope.
