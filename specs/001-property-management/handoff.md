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

Revised packet validator returned valid=true, dispatch_eligible=true, task_count=113,
T010 in_progress and 99 waiting, zero blocked. Retry gate freshly 0/ACTIVE. The revised
packet was queued to existing running `/root/coding_property_management` through an actual
successful collaboration.followup_task call (no additional response payload). Delivery
receipt is recorded in pipeline-state.json; this is not QA approval or final startup.

Coding evidence T010: PASS bun install; strict workspace typecheck/build. Logs coding/logs/bootstrap-*.txt; exact bun.lock.

Coding evidence T011: PASS minimal Vite React build, coding/logs/T011.txt.

Coding evidence T012: PASS compiled Nest bootstrap/health HTTP on port3100; coding/logs/T012.txt. Port3000 belongs to unrelated Docker service; preserved.

Coding evidence T013: PASS docker compose up -d --build --wait; all four healthy; API3100 and frontend5173 respond. Initial install stalled at network48; pinned Bun network-concurrency8 fixed; ignore scripts with later explicit Prisma generation. Logs T013-compose-retry.txt.

Coding evidence T113: PASS make -n up down build reload; make -j 4 -n reload. Sequential recursive recipes preserve ordering and stop-on-error; down preserves volumes. Logs T113-make.txt.

Coding evidence T014: PASS Prisma validate/generate; two fresh PG migrations; isolated test fixture load3users15BYTEA. T014-migrate.txt. Exact @prisma/client root dependency added by Prisma6 generator; approved version preserved.

Coding evidence T015: PASS strict backend typecheck; real PostgreSQL transaction/advisory lock and Redis set/get/lifecycle. Log T015.txt.

Coding evidence T016: Observed behavioral RED3fail0pass against callable compiled setup: valid credentials rejected; Owner scope rejected. T016-RED.txt. Content-specific HTTP denial follows document integration.

Coding evidence T018: Observed behavioral RED: cross-origin/CSRF accepted by callable placeholders. Redis login10/auth120 limits exercised. T018-RED.txt. HTTP/log integration deferred to T019.

Coding evidence T017: PASS access integration3tests after behavioral RED. Opaque8h Redis sessions; PostgreSQL roles/grants/session_version, scoped session context and clock; password hashes never returned. T017-GREEN.txt.

Coding evidence T019: PASS transport/access suites6tests and real HTTP boundary2tests144assertions: cookies,csrf/origin,limits/retry-after,logout,redacted logs. T019-GREEN.txt/T019-HTTP.txt.

Coding evidence T020: PASS Nest-owned OpenAPI3.0.0 export; operation registration assertion; two identical hey-api generations; generated services compile strict. T020-generate.txt.

Coding evidence T021: Observed meaningful DOM/hook RED3tests: no loading/protected boundary, missing session transition/error. Test setup runs. T021-RED.txt.

Coding evidence T022: PASS3DOM/hook session tests and strict Vite build; TanStack server state, generated-only IO, RHF/Zod. T022-GREEN.txt. Initial screen check required preload correction; VM RED was behavioral, hooks now await asynchronous Query notifications.

Coding evidence T023: Observed behavioral RED: system dark preference ignored; manual/persistence fallback absent. T023-RED.txt.

Coding evidence T024: Observed shell DOM RED missing navigation/date/theme control. Basic4device/2theme Chromium acceptance defined before shell implementation; executed T029. T024-RED.txt.

Coding evidence T027: PASS accessible dialog/table/status DOM checks2tests; local shadcn-style Radix/cva/Tailwind primitives; basic viewport checks T029. T027.txt.

Coding evidence T025: PASS2theme VM tests system/media changes/manual persistence/return visits/blocked storage. Test media port corrected to support multiple subscriptions. T025-GREEN.txt.

Coding evidence T026: PASS shell/shared DOM checks and strict types; themed responsive shell/nav/date/status/forms/dialog. CSS variables cover both themes; media breakpoints preserve actions. T026-GREEN.txt.

Coding evidence T028: PASS8VM/DOM checks and frontend build; saved theme applied before rendering, TanStack providers/session protected shell retained; mobile sign-out accessible. T028.txt.

Coding evidence T029: PASS4Chromium browser tests on isolated PostgreSQL API: mobile390/tablet768/laptop1366/desktop1920, light+dark switching/persistence/date/nav/no horizontal page overflow. Initial harness env forwarding corrected; T029-browser.txt.

Coding evidence T030: US6 acceptance recorded validation/us6.md with real8VM/DOM and4browser evidence, scope limits and architecture mapping.

Coding evidence T100: PASS typed validated user/account/grant/ownership/demo contracts with secret writeOnly fields, versions, documented common errors; strict backend compile.

Coding evidence T101: Observed meaningful RED3fail1pass: Owner account creation unavailable; valid scope/session/concurrent-owner scenarios cannot proceed. Direct denial tests pass. T101-RED.txt; HTTP date/Viewer content follow registered handlers/documents.

Coding evidence T102: PASS4real PostgreSQL/Redis role/owner/session tests; administrative advisory lock covers creation/update/grants/owner assignment and concurrent demotions. DTO/Manager never returns hashes. T102-GREEN.txt.

Coding evidence T103: PASS registered role/ownership/date HTTP routes Owner allowed/Manager+Viewer denied; lastOwner409; invaliddate400; sessionclockrefresh. T103-HTTP.txt. Reset authorization registered; fixture implementation explicitly T110.

Coding evidence T104: PASS generated roles/ownership/context SDK strict compile and operation discovery; backend-owned DTOs contain versions and writeOnly passwords. T104-generate.txt.

Coding evidence T105: Observed2behavioral UsersVM RED: missing result/query refresh and conflict feedback. Owner/Manager/Viewer browser scenarios authored before UI. T105-RED.txt.

Coding evidence T106: PASS2injected UsersVM tests and strict workspace types; observable action state; generated DTOs/services; TanStack query invalidation, conflict/input preservation. T106-GREEN.txt.

Coding evidence T107: PASS Owner browser end-to-end lastOwner conflict/account creation/ownership/date changes; Manager/Viewer navigation+API denial passed prior run. Shared exact-label defect corrected with browser regression and DOM checks. T107-browser.txt/T107-owner-retest.txt; strict build/typecheck. Added exact dev formatter prettier3.6.2 for readable source, official release https://github.com/prettier/prettier/releases/tag/3.6.2; no runtime stack change; generated files excluded.

Coding evidence T108: US7 real backend, VM and browser acceptance recorded validation/us7.md with explicit later reset/document checks.

Coding evidence T031: Validated typed Owner/Manager property fields, compatible resource kinds/capacity, versions, scoped contract-derived occupancy DTOs; strict backend compile.

Coding evidence T032: Observed meaningful Manager RED on valid save/reopen and occupancy totals; rejection cases preserve data. HTTP scope/validation journeys defined before handlers. T032-RED.txt.

Coding evidence T033: PASS3Manager tests valid persistence/permissions/capacity and contract dates; T032 RED corrected after root legacy decorator test setup and explicit Records injection, then observed valid-create Forbidden/availability0 failures before restored GREEN. T032-RED.txt/T033-GREEN.txt. Production tests/HTTP use compiled Nest runtime; direct unit constructors inject ports explicitly.

Coding evidence T034: PASS registered property/resource HTTP persistence/reopen/create; invalid400, shared capacity409, outscope403, Manager protected fields403 and Viewer writes403/scoped list. T034-HTTP.txt.

Coding evidence T035: PASS registered property/resource schemas and generated SDK compile strict; existing role/session operations retained. T035-generate.txt.

Coding evidence T036: Observed2behavioral PropertiesVM RED: missing save result/invalidation and capacity conflict feedback. T036-RED.txt.

Coding evidence T037: Property/resource browser journey authored before Views: create/reopen, compatible resources, occupied capacity conflict and retained input. Runs T040/T041.

Coding evidence T038: Local Zod property/resource form concepts and generated DTO exports; no duplicate transport interfaces.

Coding evidence T039: PASS2PropertiesVM save/refetch and capacity-error/input-preservation tests; generated client repositories and scoped TanStack list/detail/resource queries. T039-GREEN.txt.

Coding evidence T040: PASS property/resource create/reopen browser journey, capacity conflict/retained input/preserved persisted capacity; generated queries4VM/loading/empty/error checks; registered routes/nav and responsive forms. T040-browser.txt/T040-query.txt.

Coding evidence T041: US1 acceptance recorded validation/us1.md linking real Manager/HTTP/VM/browser results and architecture invariants.

Coding evidence T042: Defined validated Owner standalone contacts/scoped edits and read-only Stay/history/date DTOs; no movement fields/endpoints. Strict compile.

Coding evidence T043: Observed behavioral RED valid contact create/edit unavailable and projection totals0 versus9; boundary/history tests execute assertions against callable setup. T043-RED.txt.

Coding evidence T044: Observed intended HTTP RED: authenticated GET/stays404 before registration. Persisted fixture/exclusive-date/shared-capacity/concurrent version assertions ready for T047 GREEN. T044-RED.txt.

Coding evidence T045: PASS2real DB contact CRUD/scope/rollback tests: Owner unassigned creation, scoped Manager edits, denied orphan/outscope and whitespace rollback. T045-GREEN.txt; shared read-only history mapping prepared from contract facts.

Coding evidence T046: PASS5real-data contact/projection/persisted-capacity tests inclusive/exclusive/future termination/prestart cancellation/history/concurrent capacity version. T046-GREEN.txt. T044 core RED now independently tests persisted Managers before HTTP; HTTP registration test retained separately for T047.

Coding evidence T047: PASS2HTTP integration journeys contacts/occupancy, validation, unassigned denial, Viewer/outscope403, read-only stays(noPOST), concurrent capacity200/409. T047-HTTP.txt.

Coding evidence T048: PASS generated tenant/stay SDK compilation; schema registration/discovery and GET-only stays assertion; prior APIs retained. T048-generate.txt.

Coding evidence T049: Observed2StaysVM behavioral RED for missing contact result/query refresh and denied error/input retention; scoped history/date/browser scenarios authored before UI. T049-RED.txt.

Coding evidence T050: Generated contact/read-only occupancy DTO exports and local Zod contact form concepts; no writable movement state.

Coding evidence T051: PASS2contact VM tests through generated repository; scoped list/detail/history queries retain date/filter context and invalidate all affected caches on save. T051-GREEN.txt.

Coding evidence T052: PASS2browser journeys Manager contact edit/history/outscope feedback/no movement buttons, Owner explicit-date occupancy and resource recomputation; routes/nav registered; strict types. T052-browser.txt.

Coding evidence T053: Existing shared TanStack invalidation path verified by T052 browser: C007 Upcoming→Current and R103 Available→Occupied after explicit date update. Contact/resource/history queries use server clock and retained explicit date filters; later contract actions reuse the same path.

Coding evidence T054: US2 acceptance validation/us2.md links actual backend/VM/browser date/scope/history/capacity results and frontend build.

Coding evidence T055: PASS typed validated contract dates/exact digit-string TWD/tenant XOR/new-contact nesting/versions/termination and protected multipart document DTOs. No handlers before contract definitions; strict backend compile.

Coding evidence T056: Observed behavioral RED classification Upcoming returnsActive and valid Manager atomic first-contract creation denied; rollback negatives pass without orphan. T056-RED.txt.

Coding evidence T057: Observed behavioral RED permitted upload denied and baseline metadata0 vs15; allowed exact-BYTEA, Viewer metadata-only and invalid rollback scenarios prepared. T057-RED.txt.

Coding evidence T109: Observed4behavioral contract/capacity RED: valid sequential/create/reassignment operations denied; shared lock/concurrent first-contact/version/document relationship assertions prepared. T109-RED.txt.

Coding evidence T058: PASS7classification/atomic-contact/capacity/concurrency/reassignment/termination tests. Stable ordered shared resource locks, version guards, event sweep, transactional doc relationship updates, no historic obligation posting/orphan. T058-GREEN.txt.

Coding evidence T059: PASS5real PostgreSQL document tests: all15fixture hashes, exact uploaded bytes, Viewer metadata7/content denied, scope, PNG/JPEG/PDF/text structural validation, exact10MiB/oversize, unsafe names, inconsistent links, late BYTEA-trigger failure rollback. Corrected binary-omission assertion to distinguish bytes from legitimate size_bytes metadata. T059-GREEN.txt; Chrome canvas image fixtures.

Coding evidence T060: PASS2compiled-Nest HTTP journeys XOR/nested validation, atomic contracts, versions/termination/role scope and multipart bytes/413/415/422/Viewer403. Contract/document handlers/providers registered. T060-HTTP.txt.

Coding evidence T061: PASS generated contract/document DTO SDK (including multipart/binary) strict compile and registered operation discovery; existing APIs preserved. T061-generate.txt.

Coding evidence T062: Observed3ContractsVM RED atomic save/invalidation, upload error retention and binary result; browser first-contact rollback/edit/termination/upload/download/Viewer scenarios authored before Views. T062-RED.txt.

Coding evidence T063: Generated contract/document DTO exports; local Zod agreement/contact-selection/upload form concepts; exact BigInt TWD display; file contents excluded from list models.

Coding evidence T064: PASS3ContractsVM tests through generated multipart/blob repositories; scoped queries and shared invalidation; binary reads bypass query caches. Local upload FileList guard strict-types corrected. T064-GREEN.txt.

Coding evidence T065: PASS2browser journeys Manager atomic new-contact rollback→save, contract edit/termination, protected upload/download exact bytes and resource refresh; Viewer metadata-only/no writes/content403. Routes/nav and Manager tenant-first-contract entry registered. T065-browser.txt.

Coding evidence T066: PASS property→scoped contracts→tenant history→associated files browser1test, with totals5 and2 and exact parent records. Scoped context links and occupant agreement links added; missing-link RED fixed before GREEN. T066-browser.txt/T066-GREEN.txt.

Coding evidence T067: US3 validation/us3.md links actual7contract/5document/2HTTP/3VM/3browser/build acceptance, transactional guarantees and scope limits.

Coding evidence T068: Defined explicit obligation periods/due dates/entry modes, exact TWD payments/reversal+optional replacement DTOs and static append-only result schemas; idempotency header documented by handlers. Strict compile.

Coding evidence T069: Observed3behavioral billing RED: golden net/status mismatch, due-day/reversal exactness mismatch and explicit partial-period create denied. T069-RED.txt.

Coding evidence T070: Observed4behavioral payment RED: valid retry/concurrency/reversal operations denied; overpay/late-failure preservation scenarios execute. T070-RED.txt; real PG transaction and idempotency tests prepared.

Coding evidence T071: PASS3billing tests9golden states, exact12digit reversal arithmetic/due-day precedence and explicit partial-period persistence/duplicate rejection. Full-month calendar boundaries validated; entered amounts/due dates retained without auto-proration/history rewriting. T071-GREEN.txt.

Coding evidence T072: PASS5real PG payment integration tests same-key replay/changed payload409, concurrent overpay/same-key calls, append-only one reversal+replacement, Viewer/outscope denial and late ledger-trigger rollback. Durable request hashes/results stored with payments under obligation+idempotency advisory locks. T072-GREEN.txt.

Coding evidence T073: PASS compiled-Nest billing/payment HTTP23assertions including9period baseline/74000TWD, explicit periods, validation/duplicate rules, idempotency header/replay/conflict, overpay, reversal/replacement rollback, noPATCH and role scope. T073-HTTP.txt.

Coding evidence T074: PASS registered obligation/payment/reversal schemas and generated exact-money/idempotency SDK compile; existing APIs retained. T074-generate.txt.

Coding evidence T075: Observed2PaymentsVM behavioral RED: no generated payment dispatch/duplicate guard and no overpay feedback; exact billing/correction/explicit-period browser scenario authored before UI. T075-RED.txt.

Coding evidence T076: PASS exact BigInt TWD display boundaries; generated payment/obligation DTO exports and local explicit-period/payment/correction forms, URL status/date filters; UI defaults use contract rent/due-day without calculating/prorating charges. T076.txt.

Coding evidence T077: PASS2VM tests generated service dispatch with stable intent key, pending duplicate suppression, query refresh and retained overpay input/error. Scoped exact period queries and explicit correction actions. T077-GREEN.txt.

Coding evidence T078: PASS Owner billing browser journey rejects overpay with input retained, records full balance→Paid, appends reversal+replacement with original visible, creates explicit partial-period4321TWD; generated request keys and registered payment nav. T078-browser.txt.

Coding evidence T079: PASS Manager tenant/stay payment panel browser1: own-period scope, payment refresh across both views, exact PAY002 receipt filter/count1. Added generated document payment filter and receipt context links; no raw frontend HTTP. T079-browser.txt/T079-generate.txt.

Coding evidence T080: US4 validation/us4.md records exact-money/golden/duplicates/concurrency/failure/corrections/overpay and browser panel/receipt results.

Coding evidence T081: Defined9authoritative metric definitions, separate exact outstanding TWD/metadata count, scoped date/property context and generated drill filters/paths. Strict compile.

Coding evidence T082: Observed6dashboard integration RED: real scopes/golden counts and9metric filters missing in callable Manager; exact independent IDs/pagination/date/empty/concurrent snapshot scenarios prepared. T082-RED.txt.

Coding evidence T083: PASS6real-PG dashboard integration cases: all3roles exact11golden fields and complete9metric paginated ID sets, property/date boundaries, empty grants, concurrent before/after balance snapshots. Shared selection functions now drive dashboard and domain lists; one RepeatableRead read model, no Redis business truth. T083-GREEN.txt.

Coding evidence T084: PASS dashboard HTTP all3roles/golden counts, all9drill totals at page_size1, date/role-header boundary and invalid requests; frontend /payments correctly maps to generated /api/obligations operation. T084-HTTP.txt.

Coding evidence T085: PASS dashboard DTOs/metric/frontend-route+filter context generated and workspace strict compilation; earlier APIs preserved. T085-generate.txt.

Coding evidence T086: Observed metric-link behavioral RED; VM query adapter loading/scope/zero/error tests and full3role9drill/mutation browser scenarios prepared. Browser fixtures now restore isolated baseline and only its Redis namespace before each test. T086-RED.txt.

Coding evidence T087: PASS3Dashboard VM link/filter/date/count, query loading/scope, empty/error tests through injected generated service; no background refresh; page mount/manual/mutation invalidation retains server context. T087-GREEN.txt.

Coding evidence T088: PASS4dashboard browser scenarios all3roles9metrics/drills, exact outstanding TWD, mutation refresh and property/date context. Responsive themed dashboard registered with occupancy visualization and separate money summary. T088-browser.txt.

Coding evidence T089: PASS19existing browser journeys:18passed whole run, final contact/history locator scoped to its region after payment-panel added a legitimate second contract link, and1retestpassed with app unchanged. Disabled pager regression RED→GREEN; filter/date context retained. T089-regression.txt/T089-stays-retest.txt/T089-pagination-*.txt.

Coding evidence T090: US5 validation/us5.md records exact totals/full ID sets, zero/date/scope/concurrent snapshots,3role9drills/mutation/browser regression and production build.

Coding evidence T091: Real browser 16 cases passed across four devices and light/dark: 8 core mutation workflows plus 8 ownership/Viewer permission journeys; screenshot evidence and boundary HTTP regressions in coding/logs/T091-*.txt. No formal multi-browser certification claimed.

Coding evidence T092: Three concurrent role sessions: all 9 real-service list/detail/save or Viewer metadata requests200 under2000ms; actual timings T092-timing.json and validation/performance.md. Isolated baseline restored.

Coding evidence T111: Callable loader and existing reset produced meaningful RED: 0 pass3 fail (501 instead of201; explicit loader unavailable), no missing imports. Tests cover repeat counts/bytes/password/idempotency, all-role golden API, stale sessions and isolation denials. GREEN follows T110.

Coding evidence T110: Transactional isolated env-guarded seed/reset integrated. Meaningful RED→GREEN3tests82 assertions; full backend63tests1266 assertions pass; browser reset1pass confirms/signs out/restores74000/date. Session versions monotonic and6 seeded durable hash replay records preserve idempotency.

Coding evidence T093: Fresh2migrations and isolated pg_dump/pg_restore sample PASS;15 BYTEA exact hashes and relational snapshot retained; explicit reimport373ms<5minutes. Owned scratch dump/database cleaned; evidence T093-recovery.txt.

Coding evidence T094: Pinned CI authored with private ephemeral env, exact Bun install/generate/drift/type/format/build/unit+integration/browser/Compose checks. Locally PASS:64backend1272assertions,27frontend87assertions,36browser,40operation deterministic generation, stricttesttypes/build/format,4healthy finalcontainers and3role golden/file smoke. Hosted GitHub runner NOT RUN.

Coding evidence T095: Quickstart now actual4service install/build/start/migrate/generate/explicitseed/test/Make commands, scoped accounts and74000 walkthrough, recovery/timing limits. Secret values omitted; only authorized quickstart progress hash refreshed; PM validator valid/eligible.

Coding evidence T096: 39FR+8SC+28story acceptance scenarios mapped to observed64backend/27frontend/36browser and live4service evidence;139runtime application files match host bytes. Coverage includes actual limits, role/clock/fixtures/locks/files/recovery/timing. Fullchecks pass; independent QA/MCP remains next stage.
