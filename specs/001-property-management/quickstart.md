# Property Management Demo quickstart

The application is implemented. Coding checks pass; independent QA and final delivery status are recorded separately in qa-handoff.json/pipeline-state.json. Current local app: **http://localhost:5173**. API health: `/api/health`; Swagger: `/api/docs`. Use the localhost origin consistently for authenticated writes.

## Container setup

Requirements: Docker Compose, the pinned image digests in compose.yaml, and a private root `.env`. Copy `.env.example` only when no `.env` exists. Set unique POSTGRES_PASSWORD and matching DATABASE_URL credentials, plus DEMO_PASSWORD of at least12 characters; never commit or print them. Existing local credentials are already in `.env` (mode0600). DEMO_MODE=true, DEMO_ISOLATED=true, DEMO_DATABASE=rental_demo and NODE_ENV=development are required for explicit seeding/reset. Production and unrelated databases are refused.

```sh
docker compose build
docker compose up -d --wait
docker compose exec -T backend bun run migrate
docker compose exec -T backend bun run demo:seed
```

The first startup has no seeded accounts until the explicit import completes. Neither startup nor rebuild automatically migrates or seeds. Import/reset replaces this isolated synthetic workspace transactionally, preserves stable fixture IDs and invalidates previous sessions. It is an explicit destructive action within the demo database; retain any desired demo changes before invoking it again.

Observed: four services healthy; frontend5173, backend3100, PostgreSQL55432, Redis56379 bound to127.0.0.1. Unrelated port3000 app/containers and all unrelated volumes were preserved. Actual build/start/migrate/seed/three-role smoke logs are under coding/logs/T094-*.

Root Makefile commands (all `.PHONY`):

| Command | Exact behavior |
| --- | --- |
| `make up` | `docker compose up`, attached/foreground |
| `make down` | `docker compose down`, preserves database volumes |
| `make build` | `docker compose build` |
| `make reload` | Sequential recursive `make down`, `make build`, `make up`; stops on error, including with `-j` |

`make -n up down build` and `make -n -j8 reload` show these commands. Reload returns to foreground and retains data. For detached local delivery use `docker compose up -d`; final PM verifies the same QA-tested images/configuration and leaves services running.

## Accounts and walkthrough

All three fixture accounts use the private `.env` DEMO_PASSWORD, stored only as Argon2id hashes in PostgreSQL:

| Email | Role / scope |
| --- | --- |
| owner@example.test | Owner; all four properties |
| manager@example.test | Manager; P001/P002 business records |
| viewer@example.test | Viewer; P001 metadata/reads, no writes/document content |

At visible **2026-10-19 · Asia/Taipei**, Owner has4properties,11resources,5occupied/6available,6current tenants,1upcoming start/1end,5outstanding periods,**TWD74,000** outstanding and2expiring contracts. Full scoped expected results are in mock-data/expected-results.json.

1. Overview metrics open exact filtered/paginated records. Property/tenant/contract links preserve record/date context.
2. Shared R104 has two current contracts/two consumed slots. R103 is available before C007 starts on Oct22. Occupancy is solely contract-derived: inclusive start/exclusive effective end, no check-in/out controls.
3. Owner creates an unassigned contact or property/resource. Manager creates a new contact atomically with its first scoped contract and can edit visible existing contacts. Edit/reopen contracts, observe history, and terminate explicitly.
4. Payments show explicit period/due/whole TWD amounts. C003 is overdue and partial; C004 is partial before its due-day boundary. An11001payment against its11000balance is rejected. Retried identical intent returns the original record; corrections append one reversal plus optional replacement.
5. Owner/Manager upload permitted PDF/PNG/JPEG/UTF8 text up to10MiB and download exact bytes. Viewer sees metadata and receives403 for content. Invalid/spoofed/oversized files leave no partial records.
6. Owner manages accounts/grants/ownership. Last enabled Owner and still-owning accounts are protected; permission changes revoke affected sessions. Manager/Viewer direct privilege escalation and out-of-scope records are denied.
7. Owner Demo settings changes the business date and recomputes queries; manual Refresh/page open/mutations also recompute. There is no scheduler. Reset requires confirmation and signs all sessions out.
8. Choose System/Light/Dark; manual preference persists. Basic mobile/tablet/laptop/desktop light/dark workflows are tested; formal multi-browser certification is excluded.

## Local development and checks

Bun1.3.14, TypeScript5.9.3 and other exact pins are in toolchain.json/manifests/bun.lock. With PostgreSQL/Redis containers running and private host DATABASE_URL/REDIS_URL configured:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run db:generate
bun run migrate
bun run generate
bun run check:generated
bun run typecheck
bun run format:check
bun run build
```

Nest is compiled with TypeScript decorator metadata then executed by Bun; direct Bun transpilation is not the app execution contract. Backend DTO definitions generate OpenAPI and hey-api client/types. Never edit Generated files manually; all frontend API traffic uses that client.

Tests require the separate **rental_demo_test** database. Create it once with `docker compose exec -T postgres createdb -U rental rental_demo_test`, then migrate with DATABASE_URL selecting that database. Tests infer it from the host rental_demo URL, or accept an explicit TEST_DATABASE_URL with exactly that pathname. They refuse other test database names. Example without printing credentials:

```sh
bun -e 'const u=new URL(process.env.DATABASE_URL);u.pathname="/rental_demo_test";const p=Bun.spawn(["bun","run","migrate"],{env:{...process.env,DATABASE_URL:u.toString()},stdout:"inherit",stderr:"inherit"});process.exit(await p.exited)'
bun run test
bunx playwright install chrome
bun run test:e2e
```

Run shared-database suites serially. Browser tests run Chromium via installed Chrome against an isolated compiled host API3101/Vite5174, reset synthetic fixtures before each case and retain no credential traces. They do not claim Chrome DevTools MCP execution. Independent QA additionally uses actual Chrome DevTools MCP against the final Compose app, as requested; evidence belongs in validation/chrome-devtools.md.

Observed local suite:64backend tests/1272assertions,27frontend tests/87assertions,36browser cases. Generation is byte-stable across40operations. `.github/workflows/checks.yml` runs pinned corresponding stages without deployment/agent dispatch; hosted CI execution has not been claimed.

## Recovery and evidence

`bun test backend/tests/operations/recovery.test.ts` creates only an owned isolated restore database, applies fresh migrations, dumps/restores one sample, checks all15BYTEA hashes/relationships, and removes its scratch database/private dump. Explicit reimport was373ms, under5minutes with services ready. No production backup scheduler is included. Three simultaneous role sessions completed9list/detail/save-or-metadata actions below27ms locally; this is a small smoke, not a production SLA.

See validation/us1.md–us7.md, performance.md, recovery.md and coverage.md for actual evidence and limits. Preserve volumes and baseline data during QA; no remote deployment, publishing or merge is included.
