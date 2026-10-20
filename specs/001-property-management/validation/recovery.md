# Isolated recovery verification

PASS — `bun test backend/tests/operations/recovery.test.ts` applied both migrations to a fresh uniquely named test database, verified it empty, restored one PostgreSQL17 custom-format dump from rental_demo_test, and compared relational counts, document associations and all15 BYTEA SHA256 values exactly. It explicitly reimported the fixture baseline in373ms against the five-minute budget after services were ready. Source baseline retained; temporary dump (mode0600/private directory) and owned restore database removed. No application or unrelated volumes were deleted.

Evidence: [T093-recovery.txt](../coding/logs/T093-recovery.txt). Counts users/properties/resources/tenants/contracts/obligations/payments/documents/idempotency:3/4/11/10/9/9/6/15/6. Local macOS Apple Silicon host/Bun1.3.14, PostgreSQL17.11 container and Redis7.4.11. This sample proves fixture recovery on the local environment; it is not an automated production backup service.
