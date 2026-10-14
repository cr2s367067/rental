# Coding Agent requirements

| Requirement | Implementation |
| --- | --- |
| Receive PM requirements | Validated PM handoff intake with accepted scope, hashes and readiness |
| Split requirements | Stable parent-linked implementation child tasks |
| Coding patterns | Behavioral TDD plus architecture-specific layering |
| Maintainable, clean, readable code | Focused components, descriptive names, explicit dependencies, tests and diff review |
| Frontend MVVM | Views/VMs/Models responsibility boundaries and testable VMs |
| Backend API-first design with Managers | Validated OpenAPI before implementation, Manager use cases and thin operation handlers |
| Requested folders | frontend/Views, VMs, Models; backend/OpenAPI, Managers, Src/Handler/{api-name}-logic |
| Automatic QA trigger | Actual start/resume tool call after requirement completion, with receipts |
| QA repair loop | Defect-driven regression/fix/retest, automatic QA redispatch at count <=3 |
| Shared stop/reset | Read QA config before work; stop at >3; only QA full pass resets |

Assumptions: 'pm-agnet' means PM Agent; 'Mnagaers' means Managers; 'manager'
describes backend business components. Folder roots/casing are defaults for new
scope; existing equivalent layouts are mapped instead of moved wholesale. No
language/framework was supplied, so none is invented. Agents inherit host model
and permissions. Application implementation is deferred until a real PM packet.
