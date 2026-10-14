# Coding conventions

Use the feature's chosen language, framework, extension and pinned tools. These
folders express responsibilities; they do not prescribe a framework. Preserve
an equivalent existing layout with a recorded path mapping. A conflict with the
accepted architecture must be reconciled through PM before dependent coding.

## Frontend: MVVM

New-scope default:

```text
frontend/
  Views/
  VMs/
  Models/
```

Views define layout, bindings and UI-only behavior. VMs expose presentation state,
commands/actions, loading/error/empty states and data transformations. Models
represent domain data and domain validation; services/repositories manage I/O
through injected abstractions in the architecture's existing location.

Dependency direction: View → VM → Model/service abstractions. Models do not import
VMs or Views; VMs do not depend on view classes, DOM nodes or a particular view
instance. For frameworks based on hooks/state stores, testable presentation
controllers/hooks in VMs can provide this separation without unnecessary classes.
Avoid API calls, persistence or reusable business rules embedded in Views.

Test VM state transitions and error paths without rendering a UI. Verify View
bindings and user acceptance flows with the stack's appropriate integration/UI
tools. Test Models at their public behavioral boundaries. Do not make generated
OpenAPI DTOs responsible for view presentation state.

## Backend: contract first, Managers and operation handlers

New-scope default (the braces below describe a naming convention):

```text
backend/
  OpenAPI/
    openapi.yaml
  Managers/
    {api-name}-manager.{extension}
  Src/
    Handler/
      {api-name}-logic.{extension}
```

Treat 'Mnagaers' as Managers and 'open api' as OpenAPI. Managers are business
components, not a request to create another manager agent. OpenAPI defines each
operation before its handler: path/method, operationId, parameters, request and
response schemas, status/error responses, security and examples as applicable.
Use the version supported by the selected project tooling; do not automatically
switch to the latest OpenAPI release. Validate references and document compatibility.

If PM supplies contracts under feature/contracts, identify the runtime contract's
source of truth and references. Avoid divergent duplicate definitions. Preserve
confirmed contract intent; implementation/schema disagreements return to PM when
they require a product/design decision. Generate types/clients where planned and
validate generated outputs; do not hand-edit generated code.

Handlers named '{api-name}-logic' translate transport inputs, invoke Managers,
and map outcomes to documented HTTP responses. Managers own business use cases,
transactions and orchestration through injected persistence/external ports. Keep
HTTP framework types out of Manager business logic where practicable. Reuse
contract validation; do not scatter duplicate business rules across layers.

Test contract conformance, meaningful Manager behavior, and handler integration,
including applicable validation/authentication/error cases. Frontend API usage
must match the same accepted contract.

## TDD and maintainability

For behavioral work: write a relevant failing acceptance/unit/contract test, run
it and observe the intended failure (RED); implement a minimal passing change
(GREEN); improve naming, cohesion and duplication while tests stay green
(REFACTOR). Document actual commands/outcomes rather than inventing evidence.
An environment/import/setup failure is not the intended RED behavior failure.

Use small cohesive components, clear names, explicit dependencies, stable public
interfaces and consistent error handling. Explain non-obvious decisions with
brief comments or source references. Avoid catch-all Managers, speculative layers,
silent exceptions and mocks that only verify internal implementation details.
Follow existing formatters/lint/type tools and the constitution's test requirements.
For static styling/doc changes, use meaningful applicable checks and record why
a behavioral RED phase does not apply; do not claim TDD occurred when it did not.
