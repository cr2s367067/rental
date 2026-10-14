# QA workflow and retry state

## Compare and test

Read the incoming Coding packet, PM's accepted spec/plan/constitution and
requirement-to-task mapping. Verify artifact hashes and deleted paths against
the actual workspace. Reuse PM's validator for current task metadata; ensure
completed task status matches the code and Coding evidence. Missing/stale inputs
are blocked; no blanket acceptance based on Coding Agent's summary.

Read state with qa_state.py status before starting a uniquely identified QA run.
Capture its revision. Compare every in-scope functional requirement, buildable
success criterion and acceptance scenario with real implementation evidence.
Check appropriate edge/error flows, MVVM separation, OpenAPI contract conformance,
Manager business behavior, handler adaptation and readability/maintainability.
Do not invent new requirements. Product ambiguity returns to PM as a question.

Run independent relevant tests and acceptance scenarios using actual project
commands/environment. Preserve logs, exit codes, tested snapshot, setup and any
limitations. Do not rely solely on Coding's old green logs. An unavailable
environment or test runner is BLOCKED when it prevents a real verdict; a genuine
required-check or implementation failure is FAIL. For non-behavioral changes,
record the meaningful applicable verification; never invent a successful test.

For each confirmed defect report parent/subtask ID, requirement reference, file
and location, expected/actual outcome, reproduction, observed failure evidence
and correction guidance. Keep findings concrete enough for Coding to reproduce.
QA may add isolated QA fixtures/checks if needed; it does not fix application code
or modify protected requirements.

## Result and evidence

Write feature/qa-report.md and a unique feature/qa/runs/run-id.json. Maintain
feature/qa-result.json as the current result reference/copy. Archive each result
so notifications and state updates remain traceable. Hash source documents,
implementation files and test/comparison logs before finalizing; exclude the
result JSON itself from hashes.

Keep each finalized run JSON and its evidence logs immutable. The shared config,
pipeline receipt journal and mutable latest-result pointer/copy are not evidence
snapshots. Store state-update/dispatch receipts separately in pipeline-state.json
or a run-local receipt file; do not append them to a recorded result or rewrite
its hashed comparison report. A new verification gets a new run ID and result.

The state helper accepts this JSON object:

- `run_id`: unique non-empty string assigned to the actual QA run; reuse it for
  duplicate delivery, never for a different result.
- `feature_dir`: workspace-relative feature directory.
- `comparison`: `passed`, `failed` or `blocked`.
- `tests`: `passed`, `failed` or `blocked`.
- `artifact_hashes`: non-empty mapping of workspace-relative file paths to actual
  SHA-256 hex digests, including source/implementation and evidence logs.
- `comparison_evidence`: non-empty array of document/log references (path with
  optional #section) in artifact_hashes, even when explaining a blocked comparison.
- `test_evidence`: non-empty array of test logs/references in artifact_hashes.
- `findings`: array of defect objects; non-empty on a failed outcome. Each object
  includes `task_id`, `requirement_ref`, `expected`, `actual`, `reproduction` and
  `fix_guidance`, all non-empty strings.
- `blockers`: array of explicit reasons; non-empty when an outcome is blocked.

PASS requires comparison=passed AND tests=passed. Any genuine failed component
produces FAIL, even if another component is blocked; report partial evidence.
Otherwise any blocked component means BLOCKED. Do not pass a component without
the actual coverage and evidence described above.

## Shared config and commands

Config is `.codex/agents/qa-agent/docs/config.yaml`, initialized with integer
`retry_count: 0` and `processed_runs: {}`. The counter is repository-wide across
this cooperating pipeline, not copied per feature or agent. processed_runs is
the evidence/idempotency ledger; its length is the optimistic state revision.
Do not edit the counter manually as part of a retry, feature switch or restart.

Run the helper through uv (resolving its actual published/canonical path):

```sh
uv run .agents/skills/qa-agent/scripts/qa_state.py status
uv run .agents/skills/qa-agent/scripts/qa_state.py record --workspace . --result specs/001-booking/qa/runs/run-id.json --expected-revision 0
```

Replace feature/run paths and expected revision with observed values. The helper
defaults to the canonical QA package's docs/config.yaml; `--config` can specify
an explicitly selected workspace state file. The helper uses PyYAML, POSIX locks
and atomic replacement; it checks current evidence snapshots before writing.

Each finalized failed QA cycle increments once, independent of failed-test count.
Count 1–3 routes to Coding; count 4 (>3) halts the loop and refuses another failure
record while halted. A full passing comparison/test outcome resets the count to
0, including after a halt. BLOCKED does not change the count. Re-recording the
same run/evidence is idempotent; conflicting reuse or stale state/evidence fails.
The helper validates asserted outcomes and evidence structure/snapshots; it does
not execute tests or independently prove their truth.

After state recording, use [pipeline.md](pipeline.md) to actually trigger PM on
PASS or Coding on FAIL with count <=3. At count >3 persist the halt and stop
reachable development threads without dispatching more work. A halted pipeline
allows a requested QA verification after external fixes; it does not automatically
generate another coding attempt. Reset only after that verification fully passes.
