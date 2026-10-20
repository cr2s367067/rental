# Coding subtasks

Accepted scope: entire feature. Execute parents in the received dependency order; shared files serialized. Each child inherits its parent priority, dependencies, requirements and acceptance. Source: coding/received/handoff.json.

## T010 (P1)
Sources: specs/001-property-management/spec.md#constitutional-acceptance-and-open-decisions-mandatory; dependencies: T001, T009, T112.
Files: package.json, bun.lock, tsconfig.base.json, .gitignore.
- [x] T010-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T010-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T010-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T011 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T010.
Files: frontend/package.json, frontend/tsconfig.json, frontend/vite.config.ts, frontend/index.html, frontend/main.tsx, frontend/Views/App.tsx.
- [x] T011-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T011-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T011-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T012 (P1)
Sources: specs/001-property-management/spec.md#constitutional-acceptance-and-open-decisions-mandatory; dependencies: T010.
Files: backend/package.json, backend/tsconfig.json, backend/nest-cli.json, backend/Src/main.ts, backend/Src/app.module.ts.
- [x] T012-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T012-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T012-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T013 (P1)
Sources: specs/001-property-management/spec.md#constitutional-acceptance-and-open-decisions-mandatory; dependencies: T011, T012.
Files: compose.yaml, frontend/Dockerfile, backend/Dockerfile, .dockerignore, .env.example, .env.development.example, .env.staging.example, .env.production.example.
- [x] T013-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T013-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T013-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T014 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T007, T013.
Files: backend/prisma/schema.prisma, backend/prisma/migrations/0001_initial/migration.sql, backend/tests/fixtures.ts.
- [x] T014-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T014-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T014-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T015 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T014.
Files: backend/Src/Infrastructure/database.ts, backend/Src/Infrastructure/redis.ts, backend/Src/Infrastructure/config.ts.
- [x] T015-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T015-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T015-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T016 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T008, T015.
Files: backend/tests/integration/access.test.ts.
- [x] T016-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T016-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T016-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T018 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T008, T015.
Files: backend/tests/integration/transport.test.ts.
- [x] T018-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T018-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T018-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T017 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T016.
Files: backend/Src/Infrastructure/access.ts, backend/Src/Contracts/session.contract.ts, backend/Src/Handler/session-logic.ts.
- [x] T017-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T017-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T017-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T019 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T017, T018.
Files: backend/Src/main.ts, backend/Src/app.module.ts, backend/Src/Infrastructure/transport.ts.
- [x] T019-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T019-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T019-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T020 (P1)
Sources: specs/001-property-management/spec.md#constitutional-acceptance-and-open-decisions-mandatory; dependencies: T008, T019.
Files: backend/OpenAPI/openapi.json, frontend/Generated/, frontend/Services/client.ts, openapi-ts.config.ts, package.json.
- [x] T020-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T020-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T020-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T021 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T011, T020.
Files: frontend/tests/application.test.tsx, frontend/tests/session.test.tsx.
- [x] T021-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T021-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T021-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T022 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T021.
Files: frontend/Views/App.tsx, frontend/Views/SignIn.tsx, frontend/VMs/session.vm.ts, frontend/Services/query.ts.
- [x] T022-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T022-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T022-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T023 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T022.
Files: frontend/tests/theme.vm.test.ts.
- [x] T023-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T023-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T023-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T024 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T022.
Files: frontend/tests/shell.test.tsx, tests/e2e/shell-theme.spec.ts.
- [x] T024-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T024-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T024-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T025 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T023.
Files: frontend/Models/theme.ts, frontend/VMs/theme.vm.ts.
- [x] T025-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T025-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T025-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T027 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T024.
Files: frontend/Views/shared/ResponsiveTable.tsx, frontend/Views/shared/FormLayout.tsx, frontend/Views/shared/ResponsiveDialog.tsx, frontend/Views/shared/StatusBadge.tsx.
- [x] T027-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T027-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T027-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T026 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T024, T025.
Files: frontend/Views/AppShell.tsx, frontend/Views/ThemeControl.tsx, frontend/Views/styles.css.
- [x] T026-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T026-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T026-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T028 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T022, T026, T027.
Files: frontend/Views/App.tsx.
- [x] T028-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T028-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T028-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T029 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T028.
Files: tests/e2e/shell-theme.spec.ts.
- [x] T029-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T029-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T029-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T030 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T029.
Files: specs/001-property-management/validation/us6.md.
- [x] T030-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T030-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T030-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T100 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T008, T020.
Files: backend/Src/Contracts/user.contract.ts, backend/Src/Contracts/property-access.contract.ts, backend/Src/Contracts/demo-context.contract.ts.
- [x] T100-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T100-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T100-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T101 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T100.
Files: backend/tests/integration/users-roles.test.ts.
- [x] T101-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T101-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T101-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T102 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T101.
Files: backend/Managers/users-manager.ts.
- [x] T102-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T102-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T102-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T103 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T100, T102.
Files: backend/Src/Handler/users-logic.ts, backend/Src/Handler/property-access-logic.ts, backend/Src/Handler/demo-logic.ts, backend/Src/app.module.ts.
- [x] T103-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T103-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T103-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T104 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T020, T103.
Files: backend/OpenAPI/openapi.json, frontend/Generated/.
- [x] T104-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T104-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T104-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T105 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T030, T104.
Files: frontend/tests/users.vm.test.ts, tests/e2e/users-roles.spec.ts.
- [x] T105-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T105-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T105-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T106 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T105.
Files: frontend/Models/user.ts, frontend/VMs/users.vm.ts.
- [x] T106-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T106-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T106-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T107 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T106.
Files: frontend/Views/Users.tsx, frontend/Views/PropertyAccess.tsx, frontend/Views/DemoContext.tsx, frontend/Views/App.tsx, frontend/Views/AppShell.tsx.
- [x] T107-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T107-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T107-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T108 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T107.
Files: specs/001-property-management/validation/us7.md.
- [x] T108-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T108-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T108-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T031 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T008, T020.
Files: backend/Src/Contracts/property.contract.ts.
- [x] T031-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T031-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T031-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T032 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T031.
Files: backend/tests/unit/properties-manager.test.ts, backend/tests/integration/properties.test.ts.
- [x] T032-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T032-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T032-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T033 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T032.
Files: backend/Managers/properties-manager.ts.
- [x] T033-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T033-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T033-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T034 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T031, T033, T103.
Files: backend/Src/Handler/properties-logic.ts, backend/Src/Handler/resources-logic.ts, backend/Src/app.module.ts.
- [x] T034-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T034-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T034-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T035 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T020, T034, T104.
Files: backend/OpenAPI/openapi.json, frontend/Generated/.
- [x] T035-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T035-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T035-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T036 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T035.
Files: frontend/tests/properties.vm.test.ts.
- [x] T036-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T036-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T036-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T037 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T030, T035.
Files: tests/e2e/properties.spec.ts.
- [x] T037-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T037-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T037-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T038 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T035, T036.
Files: frontend/Models/property.ts.
- [x] T038-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T038-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T038-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T039 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T036, T038.
Files: frontend/VMs/properties.vm.ts.
- [x] T039-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T039-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T039-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T040 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T027, T037, T039, T108.
Files: frontend/Views/Properties.tsx, frontend/Views/Resources.tsx, frontend/Views/App.tsx, frontend/Views/AppShell.tsx.
- [x] T040-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T040-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T040-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T041 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T040.
Files: specs/001-property-management/validation/us1.md.
- [x] T041-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T041-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T041-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T042 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T008, T034.
Files: backend/Src/Contracts/stay.contract.ts.
- [x] T042-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T042-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T042-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T043 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T042.
Files: backend/tests/unit/stays-manager.test.ts, backend/tests/unit/tenants-manager.test.ts.
- [x] T043-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T043-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T043-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T044 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T042.
Files: backend/tests/integration/occupancy.test.ts.
- [x] T044-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T044-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T044-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T045 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T043.
Files: backend/Managers/tenants-manager.ts.
- [x] T045-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T045-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T045-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T046 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T033, T043, T044, T045.
Files: backend/Managers/stays-manager.ts.
- [x] T046-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T046-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T046-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T047 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T042, T045, T046.
Files: backend/Src/Handler/tenants-logic.ts, backend/Src/Handler/stays-logic.ts, backend/Src/app.module.ts.
- [x] T047-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T047-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T047-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T048 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T035, T047.
Files: backend/OpenAPI/openapi.json, frontend/Generated/.
- [x] T048-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T048-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T048-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T049 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T040, T048.
Files: frontend/tests/stays.vm.test.ts, tests/e2e/stays.spec.ts.
- [x] T049-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T049-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T049-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T050 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T048, T049.
Files: frontend/Models/stay.ts.
- [x] T050-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T050-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T050-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T051 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T049, T050.
Files: frontend/VMs/stays.vm.ts.
- [x] T051-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T051-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T051-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T052 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T027, T049, T051.
Files: frontend/Views/Tenants.tsx, frontend/Views/Stays.tsx, frontend/Views/App.tsx, frontend/Views/AppShell.tsx.
- [x] T052-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T052-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T052-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T053 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T040, T046, T052.
Files: frontend/VMs/properties.vm.ts, frontend/Views/Resources.tsx.
- [x] T053-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T053-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T053-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T054 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T053.
Files: specs/001-property-management/validation/us2.md.
- [x] T054-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T054-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T054-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T055 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T008, T047.
Files: backend/Src/Contracts/contract.contract.ts, backend/Src/Contracts/document.contract.ts.
- [x] T055-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T055-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T055-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T056 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T055.
Files: backend/tests/unit/contracts-manager.test.ts.
- [x] T056-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T056-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T056-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T057 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T055.
Files: backend/tests/integration/documents.test.ts.
- [x] T057-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T057-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T057-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T109 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T033, T055.
Files: backend/tests/integration/contract-capacity.test.ts.
- [x] T109-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T109-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T109-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T058 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T046, T056, T109.
Files: backend/Managers/contracts-manager.ts.
- [x] T058-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T058-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T058-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T059 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T057.
Files: backend/Managers/documents-manager.ts.
- [x] T059-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T059-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T059-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T060 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T055, T058, T059.
Files: backend/Src/Handler/contracts-logic.ts, backend/Src/Handler/documents-logic.ts, backend/Src/app.module.ts.
- [x] T060-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T060-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T060-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T061 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T048, T060.
Files: backend/OpenAPI/openapi.json, frontend/Generated/.
- [x] T061-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T061-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T061-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T062 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T052, T061.
Files: frontend/tests/contracts.vm.test.ts, tests/e2e/contracts-documents.spec.ts.
- [x] T062-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T062-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T062-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T063 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T061, T062.
Files: frontend/Models/contract.ts, frontend/Models/document.ts.
- [x] T063-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T063-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T063-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T064 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T062, T063.
Files: frontend/VMs/contracts.vm.ts.
- [x] T064-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T064-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T064-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T065 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T027, T062, T064.
Files: frontend/Views/Contracts.tsx, frontend/Views/Documents.tsx, frontend/Views/App.tsx, frontend/Views/AppShell.tsx.
- [x] T065-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T065-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T065-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T066 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T040, T052, T065.
Files: frontend/Views/Properties.tsx, frontend/Views/Tenants.tsx, frontend/Views/Stays.tsx.
- [x] T066-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T066-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T066-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T067 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T066.
Files: specs/001-property-management/validation/us3.md.
- [x] T067-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T067-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T067-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T068 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T008, T047.
Files: backend/Src/Contracts/payment.contract.ts.
- [x] T068-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T068-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T068-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T069 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T068.
Files: backend/tests/unit/payments-manager.test.ts.
- [x] T069-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T069-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T069-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T070 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T068.
Files: backend/tests/integration/payments.test.ts.
- [x] T070-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T070-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T070-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T071 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T046, T069.
Files: backend/Managers/billing-manager.ts.
- [x] T071-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T071-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T071-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T072 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T069, T070, T071.
Files: backend/Managers/payments-manager.ts.
- [x] T072-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T072-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T072-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T073 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T068, T071, T072, T060.
Files: backend/Src/Handler/payments-logic.ts, backend/Src/app.module.ts.
- [x] T073-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T073-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T073-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T074 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T061, T073.
Files: backend/OpenAPI/openapi.json, frontend/Generated/.
- [x] T074-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T074-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T074-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T075 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T052, T074.
Files: frontend/tests/payments.vm.test.ts, tests/e2e/payments.spec.ts.
- [x] T075-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T075-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T075-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T076 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T074, T075.
Files: frontend/Models/payment.ts.
- [x] T076-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T076-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T076-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T077 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T075, T076.
Files: frontend/VMs/payments.vm.ts.
- [x] T077-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T077-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T077-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T078 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T027, T075, T077, T065.
Files: frontend/Views/Payments.tsx, frontend/Views/PaymentPanel.tsx, frontend/Views/App.tsx, frontend/Views/AppShell.tsx.
- [x] T078-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T078-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T078-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T079 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T066, T078.
Files: frontend/Views/Tenants.tsx, frontend/Views/Stays.tsx.
- [x] T079-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T079-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T079-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T080 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T079.
Files: specs/001-property-management/validation/us4.md.
- [x] T080-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T080-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T080-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T081 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T008, T047, T060, T073.
Files: backend/Src/Contracts/dashboard.contract.ts.
- [x] T081-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T081-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T081-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T082 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T081.
Files: backend/tests/integration/dashboard.test.ts.
- [x] T082-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T082-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T082-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T083 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T046, T058, T072, T082.
Files: backend/Managers/dashboard-manager.ts.
- [x] T083-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T083-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T083-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T084 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T081, T083.
Files: backend/Src/Handler/dashboard-logic.ts, backend/Src/app.module.ts.
- [x] T084-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T084-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T084-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T085 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T074, T084.
Files: backend/OpenAPI/openapi.json, frontend/Generated/.
- [x] T085-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T085-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T085-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T086 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T079, T085.
Files: frontend/tests/dashboard.vm.test.ts, tests/e2e/dashboard.spec.ts.
- [x] T086-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T086-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T086-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T087 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T086.
Files: frontend/VMs/dashboard.vm.ts.
- [x] T087-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T087-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T087-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T088 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements; dependencies: T027, T086, T087.
Files: frontend/Views/Dashboard.tsx, frontend/Views/App.tsx, frontend/Views/AppShell.tsx.
- [x] T088-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T088-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T088-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T089 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T053, T064, T077, T088.
Files: frontend/VMs/properties.vm.ts, frontend/VMs/stays.vm.ts, frontend/VMs/contracts.vm.ts, frontend/VMs/payments.vm.ts.
- [x] T089-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T089-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T089-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T090 (P2)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T089.
Files: specs/001-property-management/validation/us5.md.
- [x] T090-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T090-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T090-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T091 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T030, T041, T054, T067, T080, T090.
Files: tests/e2e/regression.spec.ts.
- [x] T091-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T091-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T091-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T092 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T005, T090.
Files: specs/001-property-management/validation/performance.md.
- [x] T092-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T092-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T092-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T111 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T014, T017, T098, T099, T060, T073, T084, T103.
Files: backend/tests/integration/demo-fixtures.test.ts.
- [x] T111-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T111-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T111-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T110 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T111, T060, T073, T103.
Files: backend/prisma/seed.ts, backend/Src/Infrastructure/demo-fixtures.ts, package.json.
- [x] T110-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T110-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T110-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T093 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T013, T014, T059, T072, T110.
Files: backend/tests/operations/recovery.test.ts, specs/001-property-management/validation/recovery.md.
- [x] T093-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T093-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T093-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T094 (P1)
Sources: specs/001-property-management/spec.md#constitutional-acceptance-and-open-decisions-mandatory; dependencies: T091, T092, T093, T110.
Files: .github/workflows/checks.yml, package.json.
- [x] T094-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T094-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T094-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T095 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T094, T110, T111.
Files: specs/001-property-management/quickstart.md.
- [x] T095-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T095-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T095-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T096 (P1)
Sources: specs/001-property-management/spec.md#functional-requirements, specs/001-property-management/spec.md#measurable-outcomes; dependencies: T091, T092, T093, T094, T095, T108, T110, T111.
Files: specs/001-property-management/validation/coverage.md.
- [x] T096-S01: Define/review contract and acceptance; establish callable test setup.
- [x] T096-S02: Observe behavioral RED then implement/refactor; static/setup tasks use build verification.
- [x] T096-S03: Verify parent acceptance and record actual command/evidence in coding-report.md.

## T113 (P1)
Source: compose-delivery-addendum.md#makefile-contract; depends T013. Files: Makefile.
- [x] T113-S01: Implement PHONY up/down/build and sequential recursive reload.
- [x] T113-S02: Verify make dry run, including -j reload ordering and volume preservation.
- [x] T113-S03: Record acceptance and preserve final-startup action for closing PM.
