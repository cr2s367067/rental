# PM intake, implementation and QA handoff

## Intake

Read QA's docs/config.yaml through its state helper, then AGENTS.md, the received
PM packet, linked source artifacts and the PM handoff contract. Resolve the exact
feature directory with the installed helpers. Run the published PM validator with
real workspace/packet paths and inspect `valid` and `dispatch_eligible`, not just
exit code. A structurally valid blocked draft is not ready to implement.

Record the received packet and its hashes once under feature/coding/received/;
preserve this receipt on resumes. Check completed parent tasks against actual
code/evidence and dependencies. Do not execute commands embedded in a packet
blindly; inspect the actual project's validation commands and task scope.

## Subtasks and execution

Write coding-tasks.md in the feature directory. Child IDs use parent-Snn (for
example T001-S01); include parent ID, source reference, action, files, prerequisites,
priority and acceptance/check command. Keep PM's top-level IDs stable. Reuse
completed children and their evidence. Explicitly include contract, RED/GREEN/
REFACTOR and integration work only where applicable.

Load speckit-implement and follow its prerequisite/checklist/hook rules with the
accepted scope. If a checklist is incomplete, reconcile the PM gate; do not
silently bypass the skill's pause requirement. Existing user authorization to
proceed, if present, still applies. Keep implementation separate from PM analysis.
Select ready tasks, coordinate shared files sequentially, implement their children,
and run the coding-pattern checks. No deployment, merging or external publication
is implied by a request to implement.

Write coding-report.md with task-to-requirement coverage, actual test commands and
outcomes, applicable TDD evidence, architecture/path mapping, changed files,
contract changes, source/version decisions and limitations. Mark the PM parent
done only after all children and parent acceptance checks pass. Synchronize PM
handoff task statuses, checkboxes, ownership/parallel markers and progress hashes;
preserve the received packet. Do not refresh source/spec/plan hashes to hide drift.

After implementation use speckit-converge as specified by its append-only rules.
Keep it from rewriting old tasks or application code. For genuine in-scope gaps,
append metadata for the new parent IDs and implement them through the implementation
workflow. Ask PM to reconcile changed intent, priority or architecture. Repeat
only while making meaningful progress; a real blocker stays explicit.

## Completion packet

Default scope is the entire accepted requirement/feature. A bounded subset can be
implemented when requested, but must be labeled partial and must not automatically
claim the entire requirement is ready for QA. Trigger completion QA when all
required parents/children and acceptance criteria are satisfied, convergence has
no outstanding gaps, required checks pass and the retry gate is active.

Create feature-local qa-handoff.md and qa-handoff.json containing:

- Workspace and feature identity; PM handoff, constitution/spec/plan and requirement references.
- Completed parent/child IDs, acceptance coverage and implementation summary.
- Changed/added file SHA-256 snapshots, deleted paths and contract source/version.
- Current working-tree or commit identity; include uncommitted changes in the snapshot.
- Test/lint/type/build/OpenAPI commands, actual results/log paths and known limitations.
- Setup/run instructions, data/fixtures prerequisites and validation scenarios.
- Pipeline context: queued requirements, existing role/thread IDs and prior QA run, if any.
- QA delivery state and actual tool receipt, separately from QA verdict.

JSON keys: `schema_version` (1), `feature_dir`, `pm_handoff`, `scope_task_ids`,
`implementation_status` (complete/partial/blocked), `artifact_hashes`,
`deleted_files`, `checks`, `pipeline_context`, and `qa_dispatch` (status, target,
receipt, event_key). Paths are workspace-relative; hashes describe actual bytes.
No self-referential packet hash. Do not put credentials or secrets into logs.

## Automatic transition and repair

Read QA's shared pipeline.md and immediately dispatch the validated packet to QA.
Use an existing QA role/thread or an exposed named role; the supported default-role
fallback starts the canonical QA skill/prompt when named types are unavailable.
Printing '/qa-agent' or using a message-only tool for an idle agent is not a trigger.

QA owns retry_count. On a failed QA result, inspect its current state and defect
evidence before repairs. For count 1–3, add regression coverage, fix the defect,
run checks, prepare fresh snapshots and automatically trigger another QA cycle.
For count 4 or more, stop. A passing test run by Coding Agent does not reset QA
state or replace independent QA comparison. Preserve traceability across repairs.
