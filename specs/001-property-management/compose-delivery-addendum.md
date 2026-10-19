# Local Compose delivery addendum — 2026-10-19

The user instructed:

> once you done, start the container using docker compose, also help me create makefile which contains
> up -> docker compose up
> down -> compose down
> build -> compose build
> reload -> down, build, up

This amends the existing feature's local delivery work, not its product requirements.
Coding owns the root Makefile under T113. QA includes it in independent verification.
After full implementation and QA PASS, the closing PM stage starts the local four-service
Compose application, verifies service health and reports the local URL. This is explicitly
authorized local startup; no remote deployment is requested. No new feature is queued.

## Makefile contract (OP-001)

Use PHONY targets with these commands:

| Target | Command |
| --- | --- |
| up | docker compose up |
| down | docker compose down |
| build | docker compose build |
| reload | invoke down, then build, then up, in that order |

Keep up in the requested foreground mode. reload must execute its steps sequentially
and stop when a step fails, including when make is invoked with -j; use sequential
recursive make recipe lines rather than parallelizable prerequisites. down does not use
-v and must preserve database volumes. Verify make dry-run output for all targets and
reload ordering; no new implementation-mirroring test script is required.

## Completion/startup contract (OP-002)

Startup is a post-QA delivery action, not a coding task requiring QA before QA can run.
Record it as pending in pipeline-state.json and carry it through Coding/QA packets.
On QA PASS, PM verifies the current verdict/reset state, then runs docker compose up -d
from the workspace root to leave services available. The Makefile up target remains the
literal requested foreground command. Inspect the actual Compose configuration for project,
environment, ports and health checks; do not guess URLs or credentials. Verify all four
services and the app endpoint, then report actual status/URL. Preserve existing data and
unrelated containers. If startup fails, retain logs and record the concrete blocker; do
not mark delivery complete. Product acceptance and startup evidence remain distinct.

No startup has yet been performed for final delivery; application implementation is active.
