# PM Handoff — Property Management Demo

**Feature/version**: 001-property-management, Constitution 1.0.0.
**Delivery**: DISPATCHED to `/root/coding_property_management` by actual collaboration.spawn_agent receipt; tracked in pipeline-state.json and handoff.json.
**Implementation**: NOT STARTED at packet preparation. **QA**: NOT RUN.
**Inputs**: [prd.md](../../prd.md), [Architecture.md](../../Architecture.md).

## Authorization and accepted scope

Read [execution-authorization.md](execution-authorization.md) first. The latest user
instruction enables speckit-implement and Coding/QA. Implement the entire documented demo:
seven stories, 39 FRs and eight SCs, including synthetic data import/reset and walkthroughs.
Use demo-policy.md as the baseline under that later authorization; its proposal provenance
is retained. Earlier no-code/no-agent notes in protected/historical documents describe the
prior drafting stage and are superseded for this feature. Do not weaken or rewrite sources.

Occupancy is contract-derived. Include properties/resources, tenant contacts/history,
contracts/documents, rent obligations/payments/reversals, dashboard/drill-downs, ownership/
roles/grants, frozen visible Asia/Taipei demo date, themes/responsive essential workflows.
Retain explicit demo skips: background clock scheduler and formal browser certification.
No automatic proration, late fees, real payment collection, e-signing or deployment.

## Six planning stages

| Stage | Outcome | Evidence |
| --- | --- | --- |
| Constitution | REUSED / planning gates PASSED | [.specify/memory/constitution.md](../../.specify/memory/constitution.md), unchanged snapshot |
| Specify | REUSED | [spec.md](spec.md), existing authorized demo amendment preserved byte-for-byte |
| Plan | UPDATED | [plan](plan.md), [research](research.md), [model](data-model.md), [API](contracts/api-design.md), [quickstart](quickstart.md) |
| Checklist | PASSED | [requirements](checklists/requirements.md) 16/16 and [readiness](checklists/implementation-readiness.md) 22/22 |
| Tasks | UPDATED | [tasks.md](tasks.md), stable IDs, ownership/dependency corrections and exact metadata in handoff.json |
| Analyze | PASSED | [analysis.md](analysis.md), zero unresolved CRITICAL/HIGH; accepted LOW overlap wording |

## Readiness and ordering

113 tasks: 13 observed planning/data/compatibility tasks done, T010 in progress,
99 waiting on dependencies, zero blocked. No additional task is immediately ready until
current work/dependencies finish. Prior delivery/preparation counts are preserved in the
immutable accepted packet; handoff.json is the current task-level status authority.

P1 includes foundational setup, US6, US7, US1 and US2; P2 includes US3–US5.
Technical prerequisites retain P1 to enable dependent stories. Use the topological order
in tasks.md and explicit dependencies, not numeric ID sorting. Do not stop after an MVP.
No parallel groups are declared; shared module/router/client/package ownership is serial.
Independent ready work may be coordinated only with explicit non-overlapping ownership.

Start T010 → runnable T011/T012 → four-service T013 → persistence/access and generation.
Then shared themed shell → ownership/roles → properties → tenants/occupancy → contracts/
files → payments → dashboard → explicit loader and cross-cutting verification. Valid test
fixtures precede mutation APIs, avoiding a cycle. Recovery now depends on the loader.

## Implementation instructions

Use the installed `.agents/skills/speckit-implement/SKILL.md` and Coding Agent canonical
skill. Follow TDD: compile the test setup, observe intended behavioral RED, implement,
then GREEN/refactor; missing imports are not meaningful RED. Define backend contracts
before handlers; register every module/route/nav operation. Managers own transactional
rules; Views bind VMs; all frontend/backend communication uses the generated hey-api SDK.
Do not hand-edit generated artifacts or duplicate transport DTOs. See task metadata for
exact ownership, acceptance and source references; create child coding-tasks.md entries.

Use [toolchain.json](toolchain.json) exact pins. The compatibility scratch path and hashes
are in [compatibility-evidence.json](compatibility-evidence.json), and official registry
metadata in [compatibility-registry.json](compatibility-registry.json). Bun runs compiled
NestJS JavaScript emitted by tsc with decorator metadata; use ESM Vite config. OpenAPI
3.0.0 and hey-api typescript/sdk/client-fetch plugins were exercised. Prisma 6.19 schema/
client conventions are intentional. Do not upgrade majors to match current generic docs.

[Quickstart](quickstart.md) still describes future command contracts; T095 replaces them
with actual implemented commands/output. T010 supplies install/check/test/build commands;
T013 supplies Compose and separate environment examples; T020 supplies schema/client
generation; T110 supplies explicit demo:seed. Verify the commands before calling them
runnable. No application, migration, manifest, CI or Compose file was created by PM.

Important technical resolutions: Managers create new contacts atomically with their first
contract; Owners may create unassigned contacts. Session permission context supports early
ownership selectors. Test concurrent Owner protection, contract/capacity locking and exact
payment/idempotency behavior. Document actual four-device/two-theme essential acceptance,
three-session/two-second timing and a small backup/BYTEA restore/reimport check.

## Observed completed-task evidence

| IDs | Observed evidence |
| --- | --- |
| T001 | Exact package/container pins, author registry metadata, 16 passing isolated commands covering migration/BYTEA/decimal/locks/Redis/Nest DI/HTTP/OpenAPI/client compilation/React build/Bun DOM. Limits disclosed; not app acceptance. |
| T097 | Existing demo-policy.md and mock-data-plan.md define visible rule proposals and import/reset scope. Later authorization adopts the implementation baseline. |
| T002–T005 | research.md records the requested contract, billing, access and demo budget proposals without claiming runtime results. |
| T098 | fixtures.json contains deterministic synthetic records with stable IDs and no passwords/tokens. |
| T006 | Existing spec/checklist contain seven stories, preserved FR/SC IDs and authorized demo amendments; original PRD/architecture preserved. |
| T099 | Read-only recalculation of fixture counts/FKs/capacity/status/money/scoped metrics and 15 byte lengths/hashes matched expected-results.json. |
| T007 | data-model.md supplies entity/relationship/transaction/BYTEA design. |
| T008 | contracts/api-design.md and quickstart.md supply operation intent and present/future command boundaries. |
| T009 | plan.md/research.md reconcile requested fixes, design and current evidence limits. |
| T112 | Later user instruction recorded, 36 checklist items evaluated, fresh read-only semantic analysis captured and no blocking finding remains. |

These thirteen completed tasks are not application completion. Mark each remaining task
only when its actual acceptance checks pass. Preserve initial handoff snapshots for audit,
synchronize progress/status/readiness and expected task/output hashes, then revalidate.
If sources/spec/plan materially change, route reconciliation to PM; never silently refresh
protected source hashes. Expected T095 quickstart updates are implementation deliverables.

## Requirement coverage

See analysis.md for principal owners; the machine packet includes all task metadata.

| Requirement | Task IDs |
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
| FR-018 | T099, T081, T082, T083, T084, T085, T086, T087, T088 |
| FR-019 | T099, T081, T082, T083, T084, T085, T086, T087, T088, T089 |
| FR-020 | T036, T039, T049, T051, T053, T064, T066, T070, T075, T077, T079, T081, T082, T083, T084, T086, T087, T089, T091 |
| FR-021 | T011, T024, T027, T026, T028, T029, T107, T037, T040, T052, T065, T078, T086, T088, T091 |
| FR-022 | T011, T023, T024, T025, T027, T026, T028, T029, T107, T037, T040, T052, T065, T078, T086, T088, T091 |
| FR-023 | T024, T027, T026, T029, T040, T052, T065, T078, T088, T091 |
| FR-024 | T097, T004, T016, T017, T019, T021, T022, T028, T100, T101, T102, T103, T105, T106, T107, T034, T045, T047, T055, T057, T059, T060, T066, T073, T079, T084, T091 |
| FR-025 | T004, T055, T057, T059, T060, T062, T065 |
| FR-026 | T018, T019, T021, T022, T032, T034, T036, T037, T039, T040, T045, T047, T051, T052, T057, T060, T062, T064, T073, T075, T077, T084, T086, T091 |
| FR-027 | T004, T018, T019 |
| FR-028 | T014, T015, T032, T033, T044, T046, T057, T109, T059, T070, T072, T082, T091, T093 |
| FR-029 | T002, T031, T032, T033, T040, T044, T046, T053, T109 |
| FR-030 | T002, T033, T044, T046, T049, T053, T109 |
| FR-031 | T002, T042, T043, T046, T049, T109 |
| FR-032 | T097, T003, T112, T056, T058, T068, T069, T071, T072, T076 |
| FR-033 | T003, T042, T043, T046, T055, T056, T058, T081, T083 |
| FR-034 | T003, T068, T069, T072, T075, T078 |
| FR-035 | T003, T068, T069, T070, T072, T073, T075, T077, T078 |
| FR-036 | T097, T112, T014, T100, T101, T102, T103, T104, T105, T106, T107, T108 |
| FR-037 | T097, T112, T014, T100, T101, T102, T103, T104, T105, T106, T107, T108, T031, T033 |
| FR-038 | T097, T098, T099, T112, T014, T111, T110 |
| FR-039 | T097, T099, T112, T026, T100, T101, T103, T104, T105, T106, T107, T108, T111, T110 |
| SC-001 | T105, T108, T032, T037, T041, T049, T054, T062, T067, T075, T080, T090, T091, T095 |
| SC-002 | T099, T082, T086, T089, T090, T091, T111, T095 |
| SC-003 | T099, T043, T044, T049, T054, T056, T109, T062, T067, T069, T070, T075, T080, T082, T090, T091, T095 |
| SC-004 | T023, T024, T025, T027, T026, T028, T029, T030, T107, T037, T041, T049, T054, T062, T067, T075, T080, T086, T090, T091, T095 |
| SC-005 | T016, T017, T100, T101, T102, T103, T105, T107, T108, T057, T067, T091, T095 |
| SC-006 | T099, T057, T059, T062, T067, T091, T111, T110, T093, T095 |
| SC-007 | T098, T099, T111, T110 |
| SC-008 | T092 |

## Protected snapshots

Hashes captured before PM technical remediation and preserved at handoff:

- prd.md: `8d4b444631d1d92ab4a0360f79113e9e80e7290d6f25f00185396496f83f73a4`
- Architecture.md: `78f8c3474e681106fe9ec04471d323a911e4d4089af87e36ab6766ba9da53372`
- .specify/memory/constitution.md: `ca610aae3abef14cbf3af786b2042c1395c630742eacab33c9a2f3af910ad8a3`
- specs/001-property-management/spec.md: `d9214045416972fea9637cdefadc6e5671b5aeaba9084f97aa87b5309e436bf0`

## Validation and pipeline

Semantic review passed with complete requirement coverage; dependency/ownership and
fixture checks passed. The structural handoff validator must also return valid=true and
dispatch_eligible=true before delivery. It does not prove application correctness.

QA gate: retry_count 0, ACTIVE at preparation, revision 0, no previous QA result. Re-read
through qa_state.py before task/repair/dispatch. Default Python lacks PyYAML; use:

```sh
uv run --script .codex/agents/qa-agent/skills/qa-agent/scripts/qa_state.py status
uv run --python 3.11 .codex/agents/pm-agent/skills/pm-agent/scripts/validate_handoff.py --workspace . specs/001-property-management/handoff.json
```

Coding owns all application/test/config/validation output and progress tracking after
receipt. It is not alone in this workspace: preserve pre-existing edits, including deleted
Rrd.md/untracked prd.md and governance changes. Do not revert unrelated work or commit/
publish/deploy automatically. PM owns planning delivery until dispatch; QA independently
compares/tests and exclusively controls the audited retry state.

After all accepted tasks, checks and installed speckit-converge complete, Coding prepares
qa-handoff.md/json and actually dispatches QA through supported tools. QA PASS resets the
counter and dispatches PM to close this feature; QA failures at counts 1–3 return to Coding;
fourth failure halts. Missing evidence is BLOCKED, not a fabricated pass/failure/reset.
No next requirement exists. PM ends at AWAITING REQUIREMENT after verified QA PASS.

Record role/thread mapping, event keys, payload digest and returned tool receipt in
pipeline-state.json at each dispatch. Finish each outgoing role stage after successful
handoff per pipeline.md; avoid a chain of idle ancestor agents. Actual tool availability
and concurrency determine dispatch, not printed skill invocations.

## Dispatch receipt — 2026-10-19

The structural validator returned valid=true, dispatch_eligible=true, ready=[T010],
98 waiting tasks, zero blocked, task_count=112. Shared retry gate re-read as 0/ACTIVE.
Actual collaboration.spawn_agent invoked exposed agent_type=coding-agent and returned
`{"task_name":"/root/coding_property_management"}`. This proves dispatch, not recipient
acknowledgment, code completion or QA approval. The immutable accepted packet and event
digest are archived under pipeline/; the working packet may track verified progress.
Coding owns implementation and automatic QA handoff under the authorized workflow.

## User-requested local delivery scope update

Read [compose-delivery-addendum.md](compose-delivery-addendum.md). T113 adds the root
Makefile up/down/build/reload targets, owned by Coding and included in QA. T095 documents
usage. Preserve exact foreground up command; reload is sequential and stops on failure.
The user also authorizes starting the local application when done. Carry the pending
post_acceptance_actions entry in pipeline-state.json through Coding/QA handoffs. After
verified QA PASS, closing PM runs docker compose up -d, verifies actual service health
and app URL and records delivery before closing. No next feature or remote deployment.

Coding acknowledged intake and reported T010 in progress with successful pinned install,
strict frontend/backend checks and minimal builds. PM preserved that progress while
adding the operational task; no application implementation was overwritten. Revised
analysis passed, and the revised structural packet must validate before delivery.
