# Demo API Design Reference

**Status**: Draft interface intent; no runtime OpenAPI/schema or handler code generated.
**Sources**: [spec](../spec.md), [policy](../demo-policy.md), [model](../data-model.md).
NestJS definitions remain the runtime source of truth. Export backend/OpenAPI/openapi.json
from those definitions and generate the frontend TypeScript client. This document is
review guidance, not a separately maintained executable schema.

## Common contract rules

Base path proposal: /api. IDs are opaque strings, date-only values use YYYY-MM-DD, event
instants use ISO-8601, and TWD amounts use exact digit strings. Lists use page/page_size
and return items/total/page/page_size. Filter context includes business_date and property
scope; do not use page length as a dashboard total. Validate all references and field
permissions server-side; reject unknown business fields, especially manual movement fields.

Errors: 400 malformed input; 401 missing/expired session; 403 forbidden scope/action;
404 missing visible record; 409 capacity/version/idempotency/last-Owner conflict;
413 upload too large; 415 unsupported content; 422 invalid field/date/money rules.
Responses omit passwords, hashes, session tokens, document contents in metadata lists,
and sensitive log data. Success does not imply a hidden background refresh.

## Operation intent and integration ownership

| Group / operation IDs | Proposed methods and paths | Permission / behavior |
| --- | --- | --- |
| login, logout, getSession | POST /session, DELETE /session, GET /session | Credential-based server session; return role/permitted properties, not a client-authoritative role. |
| listUsers, createUser, updateUser, resetUserPassword | GET/POST /users, PATCH /users/{id}, POST /users/{id}/password | Owner only; enabled role/account changes invalidate sessions; initial passwords configured explicitly and never returned. |
| replacePropertyGrants | PUT /users/{id}/property-access | Owner only; atomically replace explicit property grants; Viewer cannot self-escalate. |
| listProperties, createProperty, getProperty, updateProperty | GET/POST /properties, GET/PATCH /properties/{id} | Owner creates; permitted fields/scoped edits for Manager; Viewer read-only. |
| assignPropertyOwner | PUT /properties/{id}/owner | Owner only; target must be enabled Owner; protect consistency with role changes. |
| listResources, createResource, updateResource | GET/POST /properties/{id}/resources, PATCH /resources/{id} | Read within scope; Owner/Manager writes subject to rental mode/capacity contract checks. |
| listTenants, createTenant, updateTenant | GET/POST /tenants, PATCH /tenants/{id} | Scoped access; Owner sees unassigned; Manager creates contacts in authorized property context. |
| listStays | GET /stays | Read-only contract occupancy/history projection. No check-in/check-out or status-mutation operation. |
| listContracts, createContract, updateContract, terminateContract | GET/POST /contracts, PATCH /contracts/{id}, POST /contracts/{id}/termination | Manager/Owner scoped writes; exact start/end/termination date and capacity checks; classification read-derived. |
| listObligations, createObligation | GET/POST /contracts/{id}/obligations | Scoped Manager/Owner creates explicit periods/due/amount, including manual partial periods; Viewer reads. |
| recordPayment, reversePayment | POST /obligations/{id}/payments, POST /payments/{id}/reversal | Scoped Manager/Owner; require Idempotency-Key; original/reversal/replacement references retained; reject overpayment. |
| listDocuments, uploadDocument, downloadDocument | GET/POST /documents, GET /documents/{id}/content | Scoped metadata reads; Owner/Manager content; Viewer content denied; approved MIME/10 MiB checks. |
| getDashboard | GET /dashboard | Scope/date filters identical to lists; nine core metrics plus separately labeled outstanding TWD. |
| getDemoContext, setDemoDate | GET/PATCH /demo/context | Context visible to authenticated users; Owner alone changes date in demo mode; successful change refreshes dependent queries. |
| resetDemo | POST /demo/reset | Future explicit Owner-only demo-mode reset; never enabled against an unrelated database. |

Owner role/account payloads include email/display_name/role/enabled and explicit property
grants. Property writes distinguish owner_id/mode from Manager-editable details. Tenant
create includes authorized property context to prevent creating an invisible orphan;
links become visible through contracts. Contract writes accept tenant_id/resource_id/
start_date/end_date/monthly_rent_twd/deposit_twd/due_day. property_id is validated or derived.
Termination has an effective date; future termination keeps current occupancy until then.

Execution clarification: a standalone new tenant is Owner-only because an unassigned
tenant has no Manager-visible contract. Manager new-contact creation is an atomic
createContract flow accepting exactly one of existing tenant_id or new_tenant contact
details. Contract Manager validates the scoped resource and inserts both tenant and first
contract in one transaction; failure leaves neither. The Manager UI offers this flow
when creating a tenant. A request property context alone never creates a lasting grant.
Before contract mutation exists, US2 covers Owner creation and scoped Manager edits.

Session context supplies scoped property IDs/names/current owner IDs for early ownership
controls; full property CRUD remains in the property operations. Changed role/enabled
state/password/grants invalidates affected sessions. Session DTOs never expose secrets.

Transport defaults: Redis-backed limits of 10 login attempts per IP per 60 seconds and
120 authenticated requests per principal per 60 seconds. Return 429 with Retry-After;
do not log raw credentials or contact payloads. These are local demo transport settings,
not a production traffic commitment. Same-origin/CSRF controls apply to authenticated
mutations; logout invalidates its session. Request body and multipart limits enforce the
document ceiling without loading oversized binary content into metadata lists.

Each domain task must own both its definition/handler and registration in
backend/Src/app.module.ts (or an explicit owned feature module). Schema-generation checks
must assert the new operations actually appear before client generation passes.
Frontend feature tasks own routing/navigation entries in frontend/Views/App.tsx and
frontend/Views/AppShell.tsx when introducing new screens. Viewer navigation hides denied
writes/downloads but does not replace server authorization.

## Session and document notes

Proposed session cookies are HTTP-only, SameSite=Lax and Secure when HTTPS is used.
Validate same-origin mutations and CSRF protection for cookie-authenticated writes.
Owner changes permissions through authenticated operations, never a role-switch header.
The demo's seeded password is environment-supplied, not stored in fixtures.

Upload metadata includes associated contract/tenant/property and optional payment;
validate consistent scope. Download returns the original MIME/safe content disposition
and exact bytes. SHA-256 serves fixture integrity checks, not authentication.

## Review and verification

Contract tests assert payload validation, allowed/denied roles, stable operation IDs,
registration/discovery, response status/schema, interval/date/money boundaries and
idempotent conflicts. Candidate paths are deliberate demo proposals; select the supported
OpenAPI version and generator plugins only after exact version compatibility is verified.
No live endpoint or generated-client conformance result is claimed by this document.
