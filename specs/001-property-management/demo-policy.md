# Demo Policy — Property Management

**Status**: Draft defaults for review, requested by the user on 2026-10-19.
**Confirmed direction**: Contract-driven occupancy; property ownership and role management;
Taiwan time; demo scope; no background status-refresh project or formal browser matrix.
**Proposed defaults**: The exact roles, money/date windows, upload limits, demo budgets,
and correction rules below are proposals, not previously supplied facts or legal advice.
No production policy, actual authentication, database seed, or application is implemented.

**Execution update**: the user's later instruction enables implementation and Coding/QA.
The defaults below are the implementation baseline under
[execution-authorization.md](execution-authorization.md); their proposal origin is retained.

## Contract-driven occupancy

- Contracts own tenant/resource assignment and the rental period. A Stay is a read-only
  occupancy/history projection of a contract, not an independently edited movement record.
- No manual check-in/check-out endpoints, buttons, actual-arrival fields, or Checking Out
  state in this demo. Preserve contract history; display upcoming starts and upcoming ends.
- Dates are local dates in Asia/Taipei. Start is inclusive; end is exclusive: a tenant
  occupies a resource when start_date <= demo_date < effective_end_date.
- effective_end_date is the earlier of end_date and termination_date, when terminated.
  A future termination does not end current occupancy early. A termination already
  effective is displayed as Terminated; ordinary completed terms are Expired.
- Proposed display precedence: Terminated (termination effective) -> Upcoming (before
  start) -> Expired (at/after ordinary end) -> Expiring Soon (end in the next 30 days) ->
  Active. Expiring Soon remains occupied. Occupied tenants have active effective terms.
- Upcoming starts/ends: dates strictly after the demo date and within the next seven
  calendar days, inclusive of day seven. Expiring Soon uses a 30-day inclusive horizon.
- Each active contract consumes one capacity slot. Shared rooms allow multiple distinct
  tenants up to resource.capacity. Reject overlapping duplicate contracts for the same
  tenant/resource, over-capacity ranges, and capacity reductions below committed overlaps.
- A property has rental_mode ROOMS or WHOLE_PROPERTY. A whole-property rental is modeled
  as one whole-property resource. Do not mix room and whole-property resources in the
  same property mode; block changing mode while any non-ended contract remains.
- Occupied resources have at least one active contract; available resources have none.
  A shared resource with some free slots is still an occupied resource. Free slots may
  be displayed separately. Occupied + available resources equals total resources.
- Validate contract edits/termination and capacity edits against the same transactional
  per-resource locking rule. Derived views never override the contract's dates.

## Taiwan calendar and demo clock

- Business timezone: Asia/Taipei (Taiwan time). Currency: TWD.
- Fixture date: 2026-10-19; fixture instant: 2026-10-19T00:00:00+08:00.
- A future demo-mode setting freezes the business date at this value and visibly labels
  it as the demo date. UTC instants are used for event timestamps; business dates remain
  date-only values interpreted in the business timezone.
- User requested skipping background time refresh. Recompute on page open, manual
  refresh, successful mutations, or an explicit demo-date change; no scheduler is needed.
- Outside demo mode, frozen-clock settings must not silently affect normal operations.

## Demo billing defaults

- Amounts are non-negative whole TWD, represented exactly; transport/fixtures use digit
  strings. Reject fractional-TWD input. No binary floating-point money calculations.
- Full recurring periods are calendar months. The default full-month due day is the 1st;
  each contract may explicitly use a day from 1 through 28. Store the actual due_date on
  each obligation. Due-day changes affect future obligations, not historical records.
- First/last partial periods require an explicitly entered period, amount and due date.
  No automatic proration, late fees, interest, refunds or deposit settlement in this demo.
- Creating a contract does not silently post historic charges. Managers explicitly create
  rent obligations; the same contract/period cannot be recorded twice.
- Recorded net payments determine balance = amount_due - amount_paid.
- Status precedence: Paid when balance = 0; otherwise Overdue when demo_date > due_date;
  otherwise Partial Payment when amount_paid > 0; otherwise Unpaid. The due day itself
  is not overdue. Expose is_partial separately when a partial payment is also overdue.
- A positive payment cannot exceed the current outstanding amount. Reject overpayments
  without saving any payment or balance change. Refund/credit workflows are excluded.
- Corrections use an append-only reversal of one original payment, then an optional
  replacement. Only one reversal per original is allowed; original entries remain.
  Refuse a reversal or replacement that would produce an invalid balance.
- Repeating the same request key/payload returns its original result; the same key with
  changed content is a conflict. Atomic server persistence protects concurrent requests.
- Unpaid Rent dashboard count means obligations with balance > 0, including not-yet-due
  and partially paid periods. Expose total outstanding TWD separately, not as that count.

## Users, ownership and roles

One demo workspace has users with one role each. Properties have an owner_user_id that
references an enabled Owner. This is organizational ownership metadata, not a legal title.
The single seeded Owner administers this workspace; no cross-organization tenancy is added.
Managers/Viewers have explicit property-access grants. IDs supplied by a browser never
substitute for server-side access checks.

| Capability | Owner | Manager | Viewer |
| --- | --- | --- | --- |
| Property scope | All demo properties | Explicit grants | Explicit grants |
| Create properties/change owner or rental mode | Yes | No | No |
| Edit scoped property details/resources | Yes | Yes, except ownership/mode | No |
| Read scoped tenants/contracts/payments/dashboard | Yes | Yes | Yes |
| Create/edit tenants/contracts/obligations/payments | Yes | Yes, within grants | No |
| Upload/download document contents | Yes | Yes, within grants | No; metadata only |
| Manage accounts, roles and property grants | Yes | No | No |
| Reset demo fixtures | Yes, in demo mode only | No | No |

- Unassigned tenant records are Owner-only. Other tenant visibility is through contracts
  on authorized properties; deny out-of-scope direct IDs and document relationships.
- Manager creates a new contact through an atomic first-contract flow; scoped resource
  validation and tenant/contract creation succeed or roll back together. Owner alone may
  create an unassigned tenant. Managers may edit contacts already visible through grants.
- Recheck scope on lists, details, mutations, aggregates and downloads. Filter dashboard
  totals and drill-downs identically. Hide unavailable actions and show permission feedback.
- Owner can create/disable accounts, change roles and grants, and assign property owners.
  Prevent removing/disabling/demoting the last enabled Owner. Reassign owned properties
  before demoting their owner; role changes invalidate affected server sessions.
- Proposed demo sign-in: seeded account identifier + password configured through a local
  environment variable (at least 12 characters), hashed when a future seed loader creates users. Fixture JSON
  contains no password, session token, hash or other credential.
- Proposed sessions: opaque server-side sessions in Redis, eight-hour expiry, HTTP-only
  SameSite=Lax cookies. Secure cookies in HTTPS environments; local HTTP is demo-only.
  No role-switch header or arbitrary client-supplied role grants access.

## Documents and retention

- Allowed demo uploads: application/pdf, image/png, image/jpeg, text/plain; maximum
  10 MiB per file. Validate byte count, safe filename and MIME/content consistency.
- Fixture contracts and receipts are synthetic UTF-8 text files, not signed documents.
  Store their actual bytes in PostgreSQL BYTEA and metadata in related records.
- List responses expose metadata only. Reject denied/invalid uploads without partial
  records. Logs exclude credentials, contents and sensitive tenant contact fields.
- Keep demo records until an Owner explicitly resets the isolated demo dataset. No
  automatic deletion, legal retention promise or production reset endpoint is implied.
- Future reset/import requires demo mode, an explicit invocation and an isolated demo
  database. Stable IDs allow repeatable upsert; never reset an unrelated database.

## Demo operating budget and skipped work

- Fixture scope: four properties, eleven rentable resources, ten tenant records,
  nine contracts, nine obligations, six original payments, fifteen documents, three users.
- Proposed smoke target: three concurrent demo sessions; common list/detail/save
  interactions finish within two seconds on the documented local demo environment.
  This is a demo check, not a production SLA or a new stress-testing project.
- Proposed recovery target: recreate the fixture baseline by reimporting verified fixtures
  within five minutes after the empty demo database and services are ready. Persistent
  BYTEA recovery remains covered by a small backup/restore verification scenario.
- Skip a formal multi-browser/viewport certification matrix and automated background
  date refresh. Retain mobile/desktop responsive smoke, both themes and essential actions;
  the constitution's four device categories/two themes still receive basic acceptance checks.
