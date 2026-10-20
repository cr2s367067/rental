# US1 — properties and resources

PASS: `bun test backend/tests/unit/properties-manager.test.ts` (3) and `backend/tests/integration/properties.test.ts` (1,9 assertions). Save/reopen/FKs, Owner creation, Manager ordinary fields, Viewer denial, out-of-scope reads, compatible rental modes and capacity preservation covered. Occupancy comes from effective contracts; shared R104 has2slots/2current,1current at exclusive end of C006.

PASS: PropertiesVM action/query tests (4) cover successful save invalidation, capacity feedback/input preservation, loading/empty and detail access error. Browser journey creates/reopens property/resource, rejects occupied capacity1 and confirms persisted2 after reload. Logs: T032-RED.txt/T033-GREEN.txt/T034-HTTP.txt/T036-RED.txt/T039-GREEN.txt/T040-query.txt/T040-browser.txt.

Root legacy decorator config and injected RecordsManager were corrected before the final meaningful T032 RED (valid create rejected; availability0) and GREEN. Production uses compiled Nest metadata. Read snapshots use PostgreSQL Repeatable Read; capacity writes use the same resource advisory lock reserved for Contract Manager. Whole-property mode permits one compatible resource and mode changes cannot invalidate existing resource kinds.
