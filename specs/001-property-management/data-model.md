# Demo Data Model

**Status**: Architecture-aligned design draft requested in the user's fix plan. Policy
values follow [demo-policy.md](demo-policy.md) and remain reviewable. No database schema
or migration is implemented. This file is not evidence of a completed runtime gate.

## Persistence conventions

Use PostgreSQL with Prisma/Prisma Migrate. IDs are opaque non-empty strings; deterministic
fixture IDs are valid text keys. Event instants persist as UTC timestamps; business dates
are date values in Asia/Taipei. Amounts use exact DECIMAL(12,0), serialized as digit strings
for the demo's whole TWD; reject negative/fractional values. Runtime version compatibility
remains to be verified. Common mutable records include created_at, updated_at and version.

## Entities and relationships

| Entity | Fields / relationships / validation |
| --- | --- |
| User | id, unique normalized email, display_name, password_hash, role OWNER/MANAGER/VIEWER, enabled, session_version. No password/hash exposed by read DTOs or fixtures. |
| PropertyAccess | user_id + property_id unique; only Owner manages grants. Owner global access does not require explicit grant rows. |
| Property | id, name, city, address, owner_user_id -> enabled Owner, rental_mode ROOMS/WHOLE_PROPERTY. Protect demotion/disable while referenced and last enabled Owner. |
| Resource | id, property_id FK, name, kind ROOM/WHOLE_PROPERTY, positive integer capacity. Kind matches property mode; one whole-property resource per whole-property property. |
| Tenant | id, name required, email nullable/valid if supplied, phone nullable. Unassigned records are Owner-only; visibility otherwise derives from scoped contracts. |
| Contract | id, tenant_id FK, resource_id FK, start_date < end_date, optional termination_date, monthly_rent_twd/deposit_twd, due_day 1–28, optional primary_document_id. Property is derived through resource; API/fixtures may expose property_id, which must match. |
| Stay | Read-only contract projection: contract_id, tenant_id/resource/property, effective dates, current/upcoming/ended display. No independent table or writable arrival/departure fields. |
| RentalObligation | id, contract_id FK, period_start < period_end, due_date, amount_due_twd, entry_mode FULL_MONTH/MANUAL_PARTIAL_PERIOD; unique contract/period. Explicit due date/partial amount; no silent historical generation. |
| PaymentRecord | id, obligation_id FK, amount_twd > 0, kind PAYMENT/REVERSAL, reverses_payment_id nullable FK, recorded_at, request_key. One reversal per original; replacement is a new PAYMENT. Net sum signs REVERSAL negative without mutating original. |
| IdempotencyRecord | principal/operation/request_key unique, request_hash, result_reference/response. Same payload replays result; changed payload conflicts. Transactionally stored with payment results, not Redis-only. |
| Document | id, kind, contract_id/payment_id nullable FKs, tenant_id/property_id, filename/type/MIME/byte-size/uploaded_at, sha256. Verify all links agree on tenant/property scope. |
| DocumentContent | document_id PK/FK -> Document, bytes BYTEA. Separate payload projection keeps binary data out of ordinary list queries. |

Fixture property_id redundancy is validated rather than treated as a second authority.
primary_document_id may be filled after document creation within the import transaction.
Payment receipts reference a contract through their obligation; mismatches are rejected.

## Contract projection and concurrency

- Effective end = min(end_date, termination_date when present). A pre-start cancellation
  has no occupied interval; keep its contract history.
- Occupancy is start <= demo_date < effective end. Display precedence is defined in policy;
  future termination does not prematurely remove an occupant.
- Validate committed current/future intervals with a capacity event sweep; process end
  events before starts on equal dates. Summing every intersecting row is insufficient
  when existing contracts do not overlap each other.
- Contract create/edit/resource reassignment/termination and resource capacity edits take
  the same per-resource transactional lock, using stable resource-ID order when two
  resources change. Verify the exact lock/isolation mechanism against pinned tooling.
- Re-evaluate permission, version and interval capacity inside the saving transaction.
  Reject over-capacity and duplicate overlapping tenant/resource assignments atomically.
- Expiring Soon does not alter occupancy. Dashboard occupied/available units partition all
  resources; a partially filled shared room is occupied and separately exposes free slots.

## Payment and access invariants

Net paid = PAYMENT total minus valid REVERSAL total. Balance is due minus net paid and
must remain non-negative. Lock the obligation for payment/reversal and idempotency updates.
Only one reversal per original; refuse duplicate obligations/keys with conflicting data.
Do not round using binary floats. Reversal/replacement retention is append-only.

Role/property scope must apply before returning aggregate or detail data and again before
mutating related records. Owner changes/role edits protect the last enabled Owner and
invalidate affected sessions. Redis sessions are temporary; durable permission state is
PostgreSQL-backed. Fixtures do not seed active sessions or plaintext passwords.

Manager new-tenant creation is atomic with the initial contract; no temporary durable
property grant is inferred from a create-tenant request. Owner can create an unassigned
tenant; Manager edits require visibility through a scoped contract. This uses existing
Tenant/Contract relationships and requires no separate tenant ownership field.

## Index and recovery draft

Index resource/contract date lookup, tenant contract history, property resource lookup,
obligation contract/period/due date, payment obligation/request keys, and document parent
links. Use uniqueness for grants, original-payment reversals and idempotency scopes.
Final index verification uses fixture-sized smoke rather than a new load-testing project.
Store document contents and relational metadata in the same database backup boundary.
Reset/reimport is explicit and isolated; restoration verification checks matching bytes.
