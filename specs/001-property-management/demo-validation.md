# Demo Remediation and Fixture Validation

**Date**: 2026-10-19
**Scope**: User-requested planning amendments, draft policies and static mock data.
**Result**: Artifact/fixture checks PASS; policy ratification and runtime verification pending.

## Nine-point fix record

| User item | Recorded change |
| --- | --- |
| 1 | T011/T012 own runnable frontend/backend entries; later T019/T022 enhance them before dependent features. |
| 2 | Domain tasks own backend module/provider and frontend router/nav registration. US7 adds property ownership, roles and explicit grants. Shared edits serialize. |
| 3 | Contract terms replace manual check-in/out as occupancy authority; Stay is a read-only projection. |
| 4 | Missing due/period/currency/status/adjustment rules are supplied as explicit draft demo defaults, including no automatic proration. |
| 5 | Owner/Manager/Viewer, scope, ownership protection, session/upload/retention policies are drafted for review. |
| 6 | Asia/Taipei confirmed; a separate small demo timing/recovery budget is proposed rather than assuming timezone answered performance. |
| 7 | Data model, API intent, quickstart and fixture import plan added in the current architecture. Exact runtime versions remain pending. |
| 8 | Background date refresh skipped; frozen demo date/page-open/manual/explicit date-change recomputation used. |
| 9 | Formal browser certification skipped; basic constitutional device/theme acceptance remains. |

## Observed static checks

- 112 task IDs are unique; original T001–T096 retained; T097–T112 added.
- 11 checked items are actual documentation/data outputs. 101 remain unchecked; no story
  implementation is checked. Every checked dependency is also a checked planning/data output.
- Dependency graph is acyclic and task listing follows it even with stable appended IDs.
- All repeated future shared source ownership is serialized, including module, router,
  generated-client and package/seed/CI edits. No worker or parallel cohort was started.
- All 39 functional requirements and eight success criteria have task mappings; seven stories.
- Local documentation links and whitespace checks pass.
- Fixture counts: 3 users, 4 properties, 11 resources, 10 tenants, 9 contracts,
  9 obligations, 6 payments and 15 documents.
- IDs, foreign keys, ownership/grants, resource mode/capacity, term intervals and timestamps
  validate. Concurrent interval commitments never exceed capacity; R104 peaks at two.
- Due TWD 131500 minus paid TWD 57500 equals outstanding TWD 74000.
- Contract classifications: Active 4, Expiring Soon 2, Upcoming 1, Expired 1, Terminated 1.
- Payment classifications: Paid 4, Overdue 3, Partial Payment 1, Unpaid 1.
- Every document's UTF-8 byte count, SHA-256, parent relationships and pre-snapshot upload
  timestamp validates. Documents contain synthetic demonstration text, not signed contracts.
- Owner/Manager/Viewer dashboard totals were recomputed independently and match the
  expected-results.json records, including scoped outstanding TWD 74000/63000/54000.
- No credentials/session tokens are present in fixture data. No database import/reset ran.

## Limits and next review

The demo policy is a user-requested draft, not approval of every proposed value. Exact
versions and executable Bun/NestJS/Prisma/client compatibility still require evidence.
No application code, seed script, SQL migration, containers, live endpoint, test suite,
CI workflow, runtime seed/reset or deployment was created/executed. Original PRD,
Architecture.md, constitution and shared QA state are preserved. Retry state was read as
ACTIVE/0; no Coding or QA agent was triggered. This is not an independent QA PASS,
validated implementation handoff or completed formal runtime planning stage.

Review [demo-policy.md](demo-policy.md), [mock-data-plan.md](mock-data-plan.md),
[fixtures](mock-data/fixtures.json), [golden results](mock-data/expected-results.json),
and amended [spec](spec.md), [plan](plan.md), [tasks](tasks.md).
