# Demo Mock Data Plan

**Status**: Fixture data created and statically verified; application loading is not implemented.
**Policy**: [demo-policy.md](demo-policy.md) contains proposed defaults for review.
**Fixtures**: [fixtures.json](mock-data/fixtures.json)
**Golden results**: [expected-results.json](mock-data/expected-results.json)

## Purpose and clock

Use deterministic synthetic data to demonstrate contract-driven occupancy, shared rooms,
upcoming/ending contracts, payment classifications, role/property scoping and file integrity.
The fixed demo date is 2026-10-19 in Asia/Taipei, anchored at local midnight. The future
application must visibly show this demo date. No background timer or formal browser
certification matrix is added. A manual refresh or explicit demo-date change is sufficient.

## Dataset

| Entity | Count | Cases |
| --- | --- | --- |
| Users | 3 | Owner, scoped Manager, scoped read-only Viewer. |
| Properties | 4 | Taipei, Taichung, Kaohsiung room rentals; Tainan whole-property rental. |
| Resources | 11 | Ten rooms and one whole-property unit; R104 has capacity two. |
| Tenants | 10 | Six current, one upcoming, two ended, one unassigned. |
| Contracts | 9 | Four Active, two Expiring Soon, one Upcoming, one Expired, one Terminated. |
| Obligations | 9 | Four Paid, three Overdue, one Partial Payment, one Unpaid. |
| Payments | 6 | Full and partial original payments; correction examples are isolated overlays. |
| Documents | 15 | Nine synthetic contract texts and six receipt texts with exact bytes/hash. |

All names/addresses are visibly synthetic. Emails use example.test. Phones are null;
no real contact or credential is required. Users have no password/hash/token fields.

## Contract and money examples

| Contract / obligation | Resource | Demo result |
| --- | --- | --- |
| C001 / OBL001 | R101 | Active; TWD 20000 fully paid. |
| C002 / OBL002 | R102 | Expiring Nov 1; TWD 22000 overdue. |
| C003 / OBL003 | R201 | Active; 9000 of 18000 paid; Overdue and is_partial = true. |
| C004 / OBL004 | R301 | Active; 5000 of 16000 paid; due Oct 25, so Partial Payment. |
| C005 / OBL005 | R104 | Active shared-room slot; TWD 10000 paid. |
| C006 / OBL006 | R104 | Second shared slot; ends Oct 24; TWD 11000 overdue. |
| C007 / OBL007 | R103 | Starts Oct 22; TWD 21000 not yet due, so Unpaid. |
| C008 / OBL008 | R203 | Expired Oct 10; manually entered final period TWD 4500 paid. |
| C009 / OBL009 | R302 | Terminated effective Oct 15; manual final period TWD 9000 paid. |

Partial-period amounts are explicit fixture data, not results of an unstated proration
formula. Paid + outstanding for every obligation equals its recorded amount due.
R103 is available on the fixed date despite its upcoming contract.

## Expected Owner dashboard

| Metric | Expected |
| --- | ---: |
| Total properties | 4 |
| Total resources | 11 |
| Occupied resources | 5 |
| Available resources | 6 |
| Current tenants | 6 |
| Contract starts in next 7 days | 1 |
| Contract ends in next 7 days | 1 |
| Outstanding rental periods | 5 |
| Outstanding TWD | 74000 |
| Expiring contracts in next 30 days | 2 |

U002 Manager sees only P001/P002: two properties, seven resources, five current tenants,
four occupied resources, three available resources, four outstanding periods and TWD 63000.
U003 Viewer sees only P001: one property, four resources, four current tenants, three
occupied resources, one available resource, three outstanding periods and TWD 54000.
Viewer may read seven document metadata rows but cannot download contents or mutate data.
Counts/drill-downs must use the same scope. Unassigned TEN010 is Owner-only.

## Future import plan

1. Validate fixture schema/version, synthetic marker, fixed date, exact digit-string amounts,
   foreign keys, IDs, resource mode/capacity, contract intervals, hashes and golden results.
2. A later seed loader requires explicit invocation against an isolated demo database with
   demo mode enabled. Credentials come from environment configuration, not fixtures.
3. Use stable IDs and a transaction to load users -> properties -> resources -> grants ->
   tenants -> contracts -> obligations -> payments -> document contents/metadata. Handle
   contract/document linkage in a second pass inside the same transaction; map fixture
   contracts.document_id to the model's primary_document_id.
4. Convert content_utf8 to actual UTF-8 BYTEA; store metadata/hash and exclude contents from
   list projections. JSON fixture content is a seed representation, not an alternate store.
5. Re-running import must not duplicate records or payments. An explicit Owner-only demo
   reset recreates only the isolated fixture dataset, never arbitrary application records.
6. Compare live API/filtered dashboard results against expected-results.json. Run denied
   Viewer/Manager requests and verify all mutation rejection cases preserve prior state.

No loader, migration, endpoint or UI is created by the current planning task. Import order
is a future contract for a separately authorized implementation, not a command to run now.

## Scenario overlays

Start each scenario from the clean baseline and keep it isolated from golden totals:

- Duplicate payment: replay PAY001's request key and identical payload; return its original
  result, with no additional payment. Changed payload with that key returns 409.
- Correction: reverse PAY002 once, then replace it with TWD 8000; OBL003 becomes Overdue,
  paid 8000, outstanding 10000. Reversing the same original twice returns 409.
- Overpayment: OBL004 has 11000 outstanding; paying 11001 returns 409 without mutation.
- Occupancy: a third simultaneous contract on full shared R104 returns 409; ending C006
  at its exclusive end frees one slot without any check-out action.
- Ownership: Manager cannot change P001.owner_user_id or their own role; Viewer cannot
  write any record. Direct reads outside grants return 403 without protected content.
- Last Owner: reject disabling/demoting U001 while no other enabled Owner exists.
- Whole home: create an isolated valid contract on R401, then reject an overlapping second
  contract; do not mix room and whole-property resource modes.

Negative request expectations are listed in expected-results.json. Contract-end behavior
uses an explicit changed demo date/manual refresh, not an automated scheduler test.
