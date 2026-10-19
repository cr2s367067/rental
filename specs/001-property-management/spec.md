# Feature Specification: Property Management Demo

**Feature ID**: 001-property-management
**Feature Branch**: Existing master; no new branch requested
**Created / Amended**: 2026-10-19
**Status**: Demo specification amended; proposed policy defaults await review, not implementation approval.
**Inputs**: [PRD](../../prd.md), [Architecture](../../Architecture.md),
[Constitution v1.0.0](../../.specify/memory/constitution.md), and the user's nine-point fix plan.
**Demo policy**: [demo-policy.md](demo-policy.md)
**Mock data**: [mock-data-plan.md](mock-data-plan.md)

The demo centralizes properties/resources, tenant records, rental contracts, payments,
documents, property ownership, scoped roles, and dashboard views. The user explicitly
changed occupancy to follow contracts rather than manual check-in/check-out. This demo
amendment supersedes the older PRD movement examples for this feature; source PRD and
architecture files remain preserved. Exact default policies below are clearly proposed
for review, as requested, rather than claimed as previously confirmed requirements.

## User Scenarios & Testing *(mandatory)*

Existing US1–US6 IDs and priorities are preserved; US7 adds ownership/role management.
US6 applies to every delivered screen. Tenant/stay read views can be tested using valid
contract fixtures before the complete contract-management UI is implemented.

### User Story 1 — Manage Properties and Resources (Priority: P1)

As an authorized manager, I can maintain scoped properties/resources and see capacity,
contract-derived occupancy and availability.

**Independent Test**: Create/edit/reopen a resource; compare its relationships, capacity
and occupancy against approved contract fixtures.

**Acceptance Scenarios**:

1. **Given** an Owner, **When** a property and resource are created, **Then** the resource
   belongs to that property and the property has an enabled Owner.
2. **Given** a granted Manager, **When** ordinary property/resource details change,
   **Then** valid edits persist but ownership/mode changes remain Owner-only.
3. **Given** overlapping committed contracts, **When** capacity is reduced below required
   simultaneous slots, **Then** reject the change without modifying existing data.
4. **Given** invalid input or failed saving, **Then** explain the failure and preserve the
   previous valid record. Whole-property and room rental modes cannot be mixed.

### User Story 2 — View Tenants and Contract-derived Occupancy (Priority: P1)

As an authorized user, I can maintain tenant contacts and see who occupies each resource
based on contract terms, without recording manual arrivals or departures.

**Independent Test**: Load active/upcoming/ended contracts, change the explicit demo date,
refresh, and compare tenant history, resource availability and contract terms.

**Acceptance Scenarios**:

1. **Given** a contract whose inclusive start has arrived and exclusive effective end has
   not, **When** occupancy is viewed, **Then** the tenant consumes one resource slot.
2. **Given** a future contract, **Then** show an upcoming contract start; do not mark it
   occupied early. A contract ending on the current date no longer occupies a slot.
3. **Given** termination has become effective, **Then** occupancy ends automatically from
   that contract date and its historical assignment remains accessible.
4. **Given** a tenant contact edit, **When** it is valid and in scope, **Then** save it;
   invalid input and out-of-scope requests preserve existing data.
5. There are no manual check-in/out actions or independently editable stay statuses.

### User Story 3 — Manage Contracts and Documents (Priority: P2)

As a granted Manager, I can assign tenants through contracts, edit/terminate terms,
identify expiring agreements, and upload/retrieve related documents.

**Independent Test**: Create a contract, verify resulting occupancy, cross date boundaries,
terminate it, and upload/download an unchanged permitted document.

**Acceptance Scenarios**:

1. A valid contract records tenant/resource, inclusive start/exclusive end, monthly rent,
   deposit and document association. Saving it refreshes affected occupancy views.
2. Conflicting date/capacity assignments are rejected transactionally, including concurrent
   contract writes and resource-capacity edits. Same-resource duplicate tenant terms fail.
3. Contract display is Upcoming, Active, Expiring Soon, Expired or Terminated according
   to the draft policy. Expiring Soon contracts remain occupied until effective end.
4. Authorized content retrieval returns the uploaded bytes; invalid/oversized uploads or
   denied access return a clear error with no partial records or content disclosure.

### User Story 4 — Track Rental Payments (Priority: P2)

As a granted Manager, I can create period obligations, record payments, and see balances
and approved adjustment outcomes.

**Independent Test**: Exercise paid/unpaid/partial/overdue examples and isolated reversal,
replacement, overpayment and duplicate-request scenarios.

**Acceptance Scenarios**:

1. Show period, due date, amount due, net paid, outstanding TWD and classification.
2. On the due day a balance is not overdue; afterwards Overdue takes precedence over
   Partial Payment, while is_partial remains visible separately.
3. Reject overpayment without mutation. Reverse an original payment at most once; retain
   the original and optional replacement, and update amounts atomically.
4. Identical request-key retries return the original result; changed content with the same
   key conflicts. Partial-period amounts/due dates are explicitly entered, not auto-prorated.

### User Story 5 — Review the Operational Dashboard (Priority: P2)

As an authorized user, I can review property operations and drill into matching records.

**Independent Test**: Compare all scoped metrics to the fixed-date golden fixture results.

**Acceptance Scenarios**:

1. Show property/resource totals, occupied/available resources, current tenants, upcoming
   contract starts/ends, outstanding periods and expiring contracts.
2. Each metric opens the full matching record set using the same property grants, demo
   date and filters; pagination does not change the meaning of its total.
3. Show zero/empty states clearly and refresh affected views after successful mutations.
4. Viewer-restricted actions remain denied even when reached from a dashboard link.

### User Story 6 — Devices and Themes (Priority: P1)

As a user, I can use essential actions across mobile/tablet/laptop/desktop and both themes.

**Independent Test**: Basic four-device-category/two-theme acceptance smoke, without a
formal multi-browser certification or automated viewport matrix project.

**Acceptance Scenarios**:

1. Essential information/actions remain usable in each category and both themes.
2. Follow system theme when no preference exists; persist a manual preference on return.
3. Status meaning includes text or another cue beyond color. No background date-refresh
   scheduler is required; explicit date change/page open/manual refresh recomputes views.

### User Story 7 — Manage Ownership, Roles and Property Access (Priority: P1)

As an Owner, I can manage accounts, roles, property grants and property ownership.

**Independent Test**: Use Owner/Manager/Viewer fixtures and verify both allowed operations
and direct API denials, including last-Owner and out-of-scope cases.

**Acceptance Scenarios**:

1. Owner manages users/roles/grants and property owners; Manager edits only granted
   business records; Viewer reads only granted records and document metadata.
2. Manager/Viewer cannot change ownership, grants or their own role. Viewer cannot mutate
   records or download document contents. Server checks apply to every operation.
3. Owner cannot disable/demote the last enabled Owner, or demote a property owner before
   ownership is reassigned. Account/role changes invalidate affected sessions.
4. Unassigned tenants are Owner-only; other tenants and aggregates follow property scope.

### Edge Cases

Reject invalid dates/amounts, over-capacity ranges and mixed property rental modes;
serialize capacity/contract changes; reject duplicate conflicting payment requests and
invalid reversals; preserve data on failures; enforce document size/type and scope;
handle empty data, excluded-end dates, future termination and manual demo-date changes.

## Requirements *(mandatory)*

### Functional Requirements

| ID | Requirement |
| --- | --- |
| FR-001 | Owner MUST create properties; authorized users MUST edit permitted property information. |
| FR-002 | Authorized users MUST create/edit rooms or whole-property resources under compatible property rental modes. |
| FR-003 | Resources MUST display capacity, current occupants and availability derived from effective contract terms. |
| FR-004 | Authorized users MUST create/maintain tenant names and contact information. |
| FR-005 | Tenant/resource assignment and Stay history MUST be derived from contracts, with one capacity slot per active contract. |
| FR-006 | Contracts MUST record inclusive start, exclusive end and optional effective termination date in the business calendar. |
| FR-007 | Current/upcoming/ended occupancy and upcoming starts/ends MUST follow contract dates without manual check-in/out actions. |
| FR-008 | Completed/terminated contract assignments MUST remain distinguishable from current/upcoming history. |
| FR-009 | Each contract MUST link its tenant, resource, property and derived occupancy history. |
| FR-010 | Contracts MUST expose dates, monthly rent, security deposit, document association and classification. |
| FR-011 | Contract classifications MUST include Upcoming, Active, Expiring Soon, Expired and Terminated using the demo policy precedence. |
| FR-012 | Owner/scoped Manager MUST upload/retrieve related documents; scoped Viewer MUST see metadata only. |
| FR-013 | Documents MUST retain name/type/MIME, byte size, upload instant and applicable tenant/property/contract relationships. |
| FR-014 | Authorized users MUST record one rent obligation per contract/period and its recorded payments; partial periods are explicit entries. |
| FR-015 | Periods MUST show due date, amount due, net paid, outstanding TWD and status. |
| FR-016 | Paid/Overdue/Partial Payment/Unpaid classifications MUST follow the demo policy and expose is_partial separately. |
| FR-017 | Users MUST identify outstanding periods and related tenants within their property scope. |
| FR-018 | Dashboard MUST show total properties/resources, occupied/available resources, current tenants, upcoming contract starts/ends, outstanding periods and expiring contracts; outstanding TWD is separately labeled. |
| FR-019 | Every metric MUST drill into records using identical date, scope and filters. |
| FR-020 | Successful changes MUST refresh affected records/lists/metrics consistently; page open/manual refresh/explicit demo-date change recomputes date-derived views. |
| FR-021 | Essential workflows MUST support mobile, tablet, laptop and desktop. |
| FR-022 | Components MUST support light/dark, system detection, manual selection and persistence. |
| FR-023 | Statuses/warnings MUST convey meaning beyond color. |
| FR-024 | Server MUST enforce Owner/Manager/Viewer permissions and property scope for reads, writes, aggregates and document access. |
| FR-025 | Uploads MUST enforce the proposed PDF/PNG/JPEG/text MIME rules and 10 MiB limit, validating actual bytes/content. |
| FR-026 | Invalid/failed operations MUST provide actionable feedback and preserve valid data. |
| FR-027 | Logs MUST exclude credentials, document contents and sensitive tenant contact values. |
| FR-028 | Related updates MUST remain consistent under failure/concurrency; contract/capacity and payment changes use transactional guards. |
| FR-029 | Capacity/shared occupancy MUST follow confirmed contract intervals; occupied and available resource counts MUST partition resources. |
| FR-030 | Contract creation/edits/termination and capacity edits MUST reject overlapping invalid commitments, using the same resource locking rule. |
| FR-031 | Occupancy MUST be a read-only contract projection; manual movement fields/actions and Checking Out are excluded from the demo. |
| FR-032 | Calendar calculations MUST use Asia/Taipei; proposed money defaults use exact whole TWD and explicit due dates/periods. |
| FR-033 | Proposed upcoming windows MUST be the next seven days; Expiring Soon MUST use the next 30 days, with the policy's boundary rules. |
| FR-034 | Overdue MUST take precedence over partial when a positive balance remains after the due day. |
| FR-035 | Payments MUST reject overpayment, support one append-only reversal per original and optional replacement, and protect idempotent retries atomically. |
| FR-036 | Owner MUST manage account roles/enabled state and property access grants, protect the last enabled Owner and invalidate affected sessions. |
| FR-037 | Properties MUST have an enabled Owner; only Owner may reassign ownership or change rental mode under the policy's constraints. |
| FR-038 | The demo MUST provide repeatable synthetic fixtures and expected scoped results; future import/reset MUST be explicit, isolated and free of duplicate records. |
| FR-039 | Demo mode MUST visibly expose its fixed Asia/Taipei business date and recompute projections when it is explicitly changed. |

FR-001–035 IDs are retained with explicit demo amendments; FR-036–039 add roles/ownership,
fixtures and demo clock. The policy is a reviewable draft, not a claim of implementation.

### Key Entities

User (role/enabled state), PropertyAccess (user/property grant), Property (owner/mode),
Resource (kind/capacity), Tenant (contacts), Contract (assignment/term/rent/deposit),
Stay (read-only projection), RentalObligation (period/due/amount), PaymentRecord
(original/reversal), Document (bytes/metadata/relationships).

## Success Criteria *(mandatory)*

### Measurable Outcomes

| ID | Outcome |
| --- | --- |
| SC-001 | All approved demo story scenarios pass, including contract-driven occupancy and ownership/role management. |
| SC-002 | Scoped dashboard totals and complete matching record sets equal the golden results with zero unexplained differences. |
| SC-003 | All contract-date/capacity/payment boundary, conflict and failure fixtures produce their expected outcomes. |
| SC-004 | Essential workflows pass basic checks in four device categories and two themes; formal browser certification is excluded. |
| SC-005 | Every tested denied operation, out-of-scope read, forbidden document download and role escalation is rejected without protected disclosure. |
| SC-006 | Every permitted successfully uploaded fixture document is retrieved byte-for-byte unchanged. |
| SC-007 | Reimporting the baseline into the isolated demo database preserves fixture IDs/counts and produces no duplicate records or payments. |
| SC-008 | Proposed demo smoke: common list/detail/save interactions complete within two seconds with three sessions on the documented local environment. |

SC-001–008 are future acceptance goals; fixture arithmetic and document hashes can be
validated now, but application/runtime results cannot be claimed before implementation.

## Assumptions

The user confirmed contract authority, Taiwan time and demo scope. Role details, TWD,
due/expiry windows, payment adjustments, upload/session limits and smoke budgets are
explicit proposed defaults in demo-policy.md for review. Manual arrival/departure,
online payment collection, e-signing, automatic proration, late fees, refunds, deposit
settlement, automated date refresh and formal browser certification are excluded.
No application code, seed loader, database mutation or Coding/QA dispatch is authorized
by this planning/fixture request. Original PRD/architecture/constitution remain preserved.

## Constitutional Acceptance and Open Decisions *(mandatory)*

Contract-driven occupancy preserves centralized records; transaction/idempotency scenarios
cover integrity; generated API ownership and BYTEA storage remain architectural duties.
FR-021–023/SC-004 preserve responsive/themed acceptance despite skipping formal browser
certification. FR-024–027/036–037/SC-005 retain server protection; Q3 is reopened by the
user's request to draft policies and add roles. No constitutional waiver is requested.

### Decision Record

- User fix 1: minimal runnable setup entry points, then later enhancements.
- User fix 2: explicit backend/frontend integration ownership and role/property management.
- User fix 3: contract dates replace check-in/out as occupancy authority.
- User fix 4/5: add missing billing rules and draft demo protection policy.
- User fix 6: Asia/Taipei; demo budgets are drafted separately rather than treating timezone
  as an answer to every performance question.
- User fix 7: add architecture-aligned design documents and fixture import plan.
- User fixes 8/9: skip background time refresh and formal browser matrix; keep basic
  responsive/theme acceptance and explicit demo-date refresh.

### Readiness

Business/demo policies and design documents are reviewable drafts. Remaining readiness
work is policy review, version selection/runtime compatibility evidence and a fresh
cross-artifact analysis after amendment. No previous analysis PASS is reused. Agent
restrictions remain active. Numerical demo defaults are explicit proposals, not hidden
assumptions or production requirements.
