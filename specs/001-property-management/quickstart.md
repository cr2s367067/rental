# Demo Validation Quickstart

**Status**: Design/fixture guide, not a running application. No package manifests,
application code, Compose configuration or seed loader has been implemented yet.
**Sources**: [policy](demo-policy.md), [model](data-model.md),
[API intent](contracts/api-design.md), [mock plan](mock-data-plan.md).

## What is available now

- mock-data/fixtures.json: deterministic synthetic records, no credentials.
- mock-data/expected-results.json: scoped golden totals, statuses, integrity hashes and
  negative scenarios at 2026-10-19 Asia/Taipei.
- Documentation of contracts/ownership/roles, not executable handlers or migrations.

Review fixture relationships/amounts, policy defaults, user property grants and expected
results before application implementation. JSON decoding, relationship/capacity/amount
checks and byte/hash checks can be performed without a database. These checks are
fixture validation, not application tests or independent QA.

## Future environment and command contract

After a separately authorized implementation supplies the matching files and scripts:

1. Pin the approved Bun and service versions, then install from the committed lockfile.
2. Configure an isolated demo database, Redis, demo-mode flag, server-only DEMO_PASSWORD
   (at least 12 characters) and the explicit demo date. No real tenant data is required.
3. Start the four Compose services with their minimal entry points, then apply reviewed
   Prisma Migrate history and generate backend schema/frontend client.
4. Invoke the future demo:seed command explicitly. It consumes the committed fixture
   data, sets account password hashes from environment configuration, and loads BYTEA.
5. Sign in as the three seeded account identifiers. The application uses server sessions,
   never an arbitrary browser role setting.
6. Run documented actual unit/integration/browser-smoke checks and compare live results
   to expected-results.json. Re-run the seed and check stable IDs/counts.

Proposed future command names such as demo:seed, dev, test:integration and test:e2e must
be implemented and verified by their owning tasks before being advertised as runnable.
They are not commands that work in the repository today. T095 refreshes this guide with
observed command output once implementation exists.

## Demo walkthrough

- Owner: 4 properties, 11 units, 5 occupied, 6 available, 6 current tenants, one upcoming
  contract start/end, 5 outstanding periods, TWD 74000 outstanding and 2 expiring contracts.
- Open shared R104: two current contracts consume both slots; no check-in/out button.
- Open R103: available today, with C007 starting Oct 22. Change the explicit demo date
  and refresh to observe date-driven occupancy; no background timer is expected.
- Open payments: C003 is overdue and partial; C004 is partial but not overdue until after
  Oct 25. Reject payment 11001 against its 11000 balance without mutating data.
- Manager: only P001/P002 business records; P003/P004 direct access fails.
- Viewer: only P001 reads; writes, role edits and document-content downloads fail.
- Owner roles/ownership: change grants, verify session invalidation, and reject demotion
  of the last enabled Owner or an owner whose properties have not been reassigned.
- Download an allowed synthetic text document and compare exact bytes/hash. Verify
  denied/oversized/wrong-type upload cases without partial records.

Basic four-device-category/two-theme checks remain; formal browser certification and
background date-refresh tests are skipped for the demo. Record local environment and
manual timing for the proposed three-session/two-second smoke budget.

## Reset and recovery

Any future reset/import must be explicit, Owner-only and demo-mode isolated. Return to
baseline before correction/overlap test overlays. Reimport must not duplicate payments.
Verify one backup/restore sample retains document contents and references. No live reset,
credential creation, database import or deployment was performed by this planning request.
