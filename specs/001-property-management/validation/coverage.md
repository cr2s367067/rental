# Accepted feature coverage — Coding observations

All113 stable PM parents are complete. The100 implementation parents have300 completed child checkpoints; thirteen planning/data/compatibility parents were received done. All seven stories/28 acceptance scenarios and39FR/8SC requirements have implementation/test evidence below. This is Coding completion; independent QA verdict and Chrome DevTools MCP container acceptance are separate and pending.

Architecture: frontend/Views render/bind, VMs own injected presentation actions/query state, Models hold domain/presentation behavior; Services call only generated hey-api operations. Backend Src/Contracts decorators own validated schemas; OpenAPI/openapi.json and frontend/Generated are generated. Managers own use cases/scoping/transactions; Src/Handler/*-logic.ts adapt HTTP. Module/router/navigation discovery is checked by real HTTP/browser and deterministic40-operation generation. PostgreSQL/Prisma stores business records/BYTEA/idempotency; Redis stores only temporary sessions/rate limits. Nest runs compiled TypeScript DI metadata on Bun.

## Functional requirements

| Requirement | Implementation / observed checks |
| --- | --- |
| FR-001 | PropertiesManager + PropertiesVM/View; properties unit/integration and browser create/edit/reopen, T032–041 |
| FR-002 | compatible ROOM/WHOLE_PROPERTY resource create/edit; properties tests, invalid mode/capacity persistence |
| FR-003 | contract-rules + RecordsManager; occupancy HTTP/integration, shared2slots and date-exclusive occupancy |
| FR-004 | TenantsManager/tenant-rules + contact forms; Manager visible edits and atomic first-contract contact, Owner standalone |
| FR-005 | read-only StaysManager, tenant history; stays-manager/occupancy tests, one slot/active contract |
| FR-006 | Contract DTO/Manager effectiveEnd; contract unit/capacity tests inclusive/exclusive and termination |
| FR-007 | shared selection rules + date context; stays browser date22 changes C007/R103, restores baseline |
| FR-008 | ended history retained; stays unit and tenant/browser history projections |
| FR-009 | relational FKs + contract links; record-links browser property→contract→tenant→documents |
| FR-010 | contract create/edit/termination/document UI; contracts-http and contracts-documents browser |
| FR-011 | contract classification precedence; contracts-manager unit30day/start/end/termination boundaries |
| FR-012 | DocumentsManager scoped metadata/bytes; documents integration/HTTP and Viewer browser403 |
| FR-013 | document metadata/links plus DocumentContent BYTEA; all15 exact SHA hashes, restore relationship snapshot |
| FR-014 | BillingManager explicit unique contract/period; payments-http and partial-period browser |
| FR-015 | exact string TWD amount/paid/outstanding + due/period; payments-manager golden9states |
| FR-016 | billingState, is_partial; due-day not-overdue, Overdue precedence, paid and reversal net |
| FR-017 | scoped obligation filters and tenant/stay PaymentPanel; payment-panels browser |
| FR-018 | DashboardManager9metrics + separate TWD; all3role11field golden comparisons |
| FR-019 | dashboard/list shared selectors; independently enumerated complete IDs across page_size2, HTTP/browser drilldowns |
| FR-020 | TanStack invalidation/manual/page/date refresh; VM tests and mutation/date/dashboard browser |
| FR-021 | responsive shell/table/dialog/form;16 essential workflow/role cases across4devices×2themes |
| FR-022 | injected theme ports + ThemeControl/CSS; system detection, manual persistence, browser light/dark |
| FR-023 | text statuses, labels, alerts; shared DOM and responsive/theme browser screenshots |
| FR-024 | Access current/property/write/owner enforced in Managers and guarded HTTP; all-role scope/forbidden writes/downloads |
| FR-025 | document-rules actual PNG CRC/JPEG/PDF/UTF8 structure and10MiB; exact-boundary/spoof/MIME/oversize integration/HTTP |
| FR-026 | server DTO/rule validation + ActionVM feedback/input retention; null/whitespace/CSRF/boundary and browser invalid save tests |
| FR-027 | logger disabled, safe ErrorBoundary, no payload/contact/credential/file logs; http-boundary capture and source review; no browser traces retained |
| FR-028 | transaction/version/advisory locks; late BYTEA/idempotency failure rollback; concurrent contract/capacity/payment/admin tests |
| FR-029 | event sweep ends-before-start and contract projection; occupied+available partitions all3role goldens |
| FR-030 | shared sorted resource locks on contract/capacity edits; conflict/concurrent capacity integration |
| FR-031 | GET-only Stay API and contract-derived data, no movement controls/fields; generated contract check/occupancy HTTP denials |
| FR-032 | date-only Asia/Taipei calendar, integer string TWD/Decimal/BigInt; date/money unit/boundary tests |
| FR-033 | next7day start/end and30day expiring filters; boundary unit and exact metric/drill sets |
| FR-034 | Overdue before Partial Payment with separate is_partial; payment golden and HTTP fixtures |
| FR-035 | append-only one reversal/original, optional replacement, no overpay; transactional durable request hash/replay/concurrency/rollback |
| FR-036 | Owner account/roles/enabled/password/grants; shared admin lock, lastOwner protection and session revocation tests |
| FR-037 | enabled property Owner and Owner-only ownership/mode, concurrency protection; users-roles/properties tests and browser |
| FR-038 | guarded explicit transactional seed/reset; repeated stable IDs/counts,6payments/no duplication,6durable replay records,15BYTEA, production/unrelated refusal |
| FR-039 | visible2026-10-19 Asia/Taipei, Owner date change and explicit recompute; demo reset browser/all-role golden APIs |

## Success criteria and story acceptance

| Criterion | Actual evidence |
| --- | --- |
| SC-001 | US1AC1–4, US2AC1–5, US3AC1–4, US4AC1–4, US5AC1–4, US6AC1–3, US7AC1–4: validation/us1.md–us7.md, T094 full regression36browser/64backend/27frontend |
| SC-002 | dashboard.test.ts6tests131assertions and dashboard-http/browser; all3role goldens,9exact full ID sets and date/property/empty/mutation cases |
| SC-003 | contract-capacity, contracts-manager, payments-manager/payments and transport/null boundary tests; conflict and rollback cases pass |
| SC-004 | regression.spec.ts16cases: mobile390×844,tablet768×1024,laptop1366×768,desktop1920×1080×light/dark; shell system/manual/persistence; screenshot evidence |
| SC-005 | Owner/Manager/Viewer server denial coverage across read/write/aggregate/download/roles; malformed/outscope/forbidden failures preserve data |
| SC-006 | all15fixture BYTEA hashes, uploaded permitted bytes and browser download equality; actual container Owner/Manager DOC-C001 hash matches; Viewer403 |
| SC-007 | demo-fixtures.test.ts3tests82assertions: twice reimport8entity counts/stable IDs,6payments/6idempotency rows,15bytes and all3role API goldens/reset session invalidation |
| SC-008 | scripts/performance.ts3simultaneous roles/9actions;7–27ms<2000ms on documented local environment; validation/performance.md |

## Final observed check ledger

- `bun run typecheck`: strict backend/frontend/test/tooling types PASS.
- `bun run format:check`: owned source formatting PASS. Generated files excluded.
- `bun run build`: compiled Nest and Vite production build PASS.
- `bun run check:generated`: byte-identical backend OpenAPI/client;40unique operations/security/discovery PASS.
- `bun run test`:64backend tests/1272assertions and27frontend tests/87assertions, zero failures. Real PostgreSQL17.11/Redis7.4.11 used.
- `bun run test:e2e`:36browser cases PASS, serial isolated rental_demo_test, compiled host API3101/Vite5174; baseline restored per case, traces disabled.
- `docker compose build/up -d --wait`, explicit container migrations/seed,3role golden/file/logout smoke: PASS;4healthy services at http://localhost:5173. These are container API checks, not Chrome DevTools MCP checks.
- `bun scripts/runtime-identity.ts`:139application files byte-identical in both runtime containers;4container image/config identities recorded in runtime-identity.json.
- Fresh2migration/backup-restore sample and373ms reimport PASS (recovery.md); dry-run Make exact targets/sequential reload PASS (T113).
- PM working-packet validator valid=true/dispatch_eligible=true with no blockers; protected source hashes preserved. Thirteen incoming completed planning parents retain received evidence; compatibility probes are not counted as app acceptance.

Logs: coding/logs/T094-{typecheck,format-check,build,generation,tests,browser,compose-build,compose-up,container-migrate,container-seed,runtime}.txt; T094-container-smoke.json; T096-runtime-identity.txt. Meaningful behavior RED→GREEN evidence retained per task. Setup/static/docs/formatting/operational verifications use appropriate build/runtime checks instead of implementation-mirroring tests. The initial T032 setup error was corrected before observing behavioral RED; initial locator/ID probes are not claimed as product defects or passing acceptance.

Limitations: no hosted GitHub Actions execution, formal cross-browser certification, stress test, background date scheduler or production deployment/backup service. Independent QA and requested Chrome DevTools MCP testing of the same final containers remain mandatory before delivery closeout. Final PM must execute/verify local-compose-start after QA PASS and leave final services running with existing volumes. No unrelated work reverted/committed, no secrets in artifacts.
