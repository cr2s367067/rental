# Research and Decision Record — Demo Amendment

**Date**: 2026-10-19 | **Status**: Planning baseline authorized; pinned isolated compatibility verified. Application acceptance pending.
**Sources**: [spec](spec.md), [architecture](../../Architecture.md),
[policy](demo-policy.md), [plan](plan.md), [mock data](mock-data-plan.md).

## Product decisions and proposal provenance

| Topic | Disposition |
| --- | --- |
| Occupancy | User explicitly replaced check-in/out with contract-driven rules. Stay becomes a read projection. |
| Ownership/roles | User requested both integration ownership and role/property administration. US7/FR-036–037 added. |
| Calendar | User specified Taiwan time; interpreted as Asia/Taipei. |
| Billing | User asked to add missing rules. Exact TWD/due/window/correction defaults are drafted in demo-policy.md for review. |
| Access/uploads | User reopened the earlier deferred topic by requesting a demo policy. Owner/Manager/Viewer and limits are draft proposals. |
| Demo scale | Timezone alone did not define performance. Three-session/two-second and five-minute fixture recovery budgets are explicit proposed smoke targets. |
| Design artifacts | User requested architecture-aligned missing parts; model, API intent and quickstart are supplied as drafts, not a passed runtime stage. |
| Skipped items | No background date-refresh scheduler or formal browser matrix. Fixed demo date/manual refresh; basic constitutional responsive/theme acceptance remains. |

## Technical decisions, rationale and alternatives

1. **Generated contract**: retain NestJS ownership -> generated OpenAPI -> hey-api client.
   This preserves Constitution II and avoids independent handwritten API types/schema.
   Sources: [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction),
   [Hey API](https://heyapi.dev/docs/openapi/typescript/get-started), accessed 2026-10-19.
   Version-specific generation/compilation has not run.
2. **Persistence**: retain PostgreSQL/Prisma/Prisma Migrate and BYTEA documents. Redis is
   temporary session/cache data. Source: Architecture.md and
   [version-scoped Prisma migration workflow](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production),
   accessed 2026-10-19. This reference does not select that major or verify another major.
3. **Presentation/business layers**: follow local MVVM and Manager/Handler conventions.
   Shared bootstrap/module/router ownership is now explicit, preventing unreachable
   features or empty schema exports. Do not scatter the same business rules across Views.
4. **Verification**: proposed Bun/React Testing Library/Happy DOM and browser acceptance.
   Sources: [Bun DOM testing](https://bun.com/docs/test/dom),
   [Playwright](https://playwright.dev/docs/intro), accessed 2026-10-19.
   Retain basic smoke; do not turn the demo into formal browser certification.
5. **Demo data**: static JSON with stable IDs and independent golden results is reviewable
   now. A later transactional loader, rather than a second frontend mock backend, will
   store data in PostgreSQL and file bytes in BYTEA through the real architecture.
   Alternatives rejected: fake client-only role authorization, Redis-only payment truth,
   automatic production seeding, independent mutable check-in/out state, real personal data.

## Historical draft-stage readiness (superseded by the current execution record)

- Review proposed demo policy values and fixture expectations. They are visible proposals,
  not hidden assumptions or claims that the user supplied every number.
- Select exact versions and perform authorized compatibility verification. There are no
  application manifests, built containers, installed app dependencies or runtime results.
- Reevaluate the constitutional gates/checklist and cross-artifact analysis after amendment.
  Supersede the old analysis only with fresh evidence, not an agent restart or a new draft.
- No source PRD, architecture, constitution, shared QA state, scripts or application code
  is changed. Coding and QA agents remain disabled; retry_count was read as 0/ACTIVE.
- Phase 0/Phase 1 completion is not asserted merely because design drafts exist. The user
  authorized adding the missing drafts while preserving review/runtime verification gates.

## Previous findings disposition

I1 setup: minimal frontend/backend entries are owned by T011/T012, later enhanced by
T019/T022. C1 wiring: domain tasks explicitly own app.module/App/AppShell registration.
A1: contract authority is confirmed; precise interval defaults drafted. A2/A3: billing and
access defaults drafted, with roles/ownership added. A4: timezone confirmed and a separate
small demo budget proposed. U1: missing design drafts added; version/runtime evidence
remains open. U2/A5: user requested demo deferral; no scheduler/formal browser project.
This is a remediation record, not an independent QA PASS or a claim of no remaining risks.

## Current execution and compatibility decision

The later user instruction enables implementation and Coding/QA. See
[execution-authorization.md](execution-authorization.md). Implement the drafted demo
defaults as the baseline; the earlier draft-stage restrictions above are historical.
No protected specification or constitution was edited to remove that history.

Exact package versions and container digests are in [toolchain.json](toolchain.json).
Choose the tested set rather than adopting unrelated newer majors: NestJS 11.1.9,
Swagger 11.2.1, Prisma/client 6.19.0, hey-api 0.87.5, React 19.2.0, Vite 7.2.2,
TypeScript 5.9.3 and Bun 1.3.14. PostgreSQL 17.11 and Redis 7.4.11 use recorded
immutable digests. This selection preserves the approved stack and limits setup churn.

Official sources, accessed 2026-10-19:

- Package-author registry metadata: [compatibility-registry.json](compatibility-registry.json),
  containing version-specific npm registry URLs, engines and peer dependencies.
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction): decorators own exported schemas.
- [Hey API generation](https://heyapi.dev/docs/openapi/typescript/get-started): exact generator
  pins and plugin configuration. The pinned CLI's installed help/source and actual output
  resolve differences from current generic documentation.
- [Vite requirements](https://vite.dev/guide/): runtime constraints; probe runs Vite on Bun.
- [Prisma v6 requirements](https://www.prisma.io/docs/orm/v6/reference/system-requirements)
  and [supported databases](https://www.prisma.io/docs/orm/v6/reference/supported-databases):
  use the v6 schema/client path. Current Prisma 7/8 instructions are not drop-in v6 guidance.
- [Bun Prisma guidance](https://bun.com/guides/ecosystem/prisma) and
  [DOM testing](https://bun.com/docs/test/dom): ecosystem support; pinned installed behavior
  was exercised rather than inferred from documentation alone.

Observed 16 successful isolated commands are in
[compatibility-evidence.json](compatibility-evidence.json). They include real PostgreSQL
migration, BYTEA/Decimal roundtrip under an advisory transaction lock, Redis read/write,
NestJS dependency injection and HTTP, OpenAPI export, generated-client/UI type checks,
React/Vite/Tailwind build and one Bun DOM test. Compile Nest with tsc decorator metadata
and run emitted JavaScript on Bun; do not assume direct Bun transpilation emits metadata.
Use ESM Vite config. Prisma CLI commands use Bun explicitly. The first harness attempt
combined stderr's update notice with SQL; separating streams fixed the harness, and the
complete probe passed against a fresh temporary database. Temporary containers were removed.

Limits: no application behavior, application Compose startup, browser journey, restore,
or independent QA is proved by this probe. Those remain owned implementation tasks.
Additional support packages require exact pins, official evidence, rationale and checks.

## Technical consistency resolutions

Manager-created new contacts are committed atomically with their initial contract through
Contract Manager. Standalone unassigned creation is Owner-only. Managers may update visible
contacts. This avoids granting durable tenant access through an otherwise non-authoritative
request property_id. Before US3, US2 verifies Owner creation and scoped Manager contact edits
with persisted contract fixtures; US3 adds the atomic Manager creation flow.

Session context includes scoped property IDs/names and current owner IDs for the early
ownership selection UI. This remains a permission context, not a duplicate property store;
full property CRUD is added by US1. UsersManager owns early owner/grant administration.
Role/grant changes invalidate affected sessions. Rate limits are defined in the API design.
Recovery evidence requiring reimport follows T110's loader rather than preceding it.
