# US7 — ownership, users and roles

PASS: users-roles integration (4 tests) and users-http (1 test,16 assertions) against real PostgreSQL/Redis/compiled Nest. Evidence: coding/logs/T101-RED.txt → T102-GREEN.txt; T103-HTTP.txt. Shared administrative advisory lock covers concurrent demotions and ownership reassignment versus demotion. Roles/enabled/password/grants invalidate affected sessions; property owners and last enabled Owner remain protected. Owner-only date changes update server/session context.

PASS: UsersVM tests (2) and browser Owner workflow (last-Owner conflict feedback, create Owner, assign property, change/restore date). Manager and Viewer navigation hides Owner administration; direct role escalation403, scopes2/1 properties. Evidence: T105-RED.txt → T106-GREEN.txt; T107-browser.txt (Manager/Viewer pass; initial Owner failure identifies select labeling); T107-owner-retest.txt (Owner pass after shared field fix). Browser fixture changes affect only rental_demo_test and are replaced by the next fixture load.

Actual fixture reset implementation and full Viewer document-content checks follow T110 and document tasks; no claim they ran at this stage. These are Coding checks, not independent QA.
