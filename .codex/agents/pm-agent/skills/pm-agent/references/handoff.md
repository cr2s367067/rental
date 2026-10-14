# Coding Agent handoff contract

Create `handoff.md` and `handoff.json` in the resolved feature directory. Existing
Spec Kit `tasks.md` remains the checklist consumed by speckit-implement. Keep
metadata keyed to exactly the same IDs and completion checkboxes.

## Human-readable packet

handoff.md includes feature/version, input references, scope/exclusions, the six
stage outcomes, constitution gates, evaluated checklist, analysis findings and
confirmed decisions, requirement coverage by task ID, task details, dependency
order, parallel opportunities, readiness, and actual delivery history.
Link plan/research/data model/contracts/quickstart rather than requiring the
Coding Agent to reconstruct them. Include setup and validation commands from
quickstart, pinned version decisions, applicable workspace instructions, and
remaining limitations. Record hashes proving protected artifacts were preserved.

Each task includes description, technical requirements, dependencies, priority,
acceptance criteria, spec and architecture references, intended file ownership,
status and blockers. A task's references must be specific enough for implementation
(requirement ID, section, or anchor), not just a generic link to the repository.

## Machine-readable packet

Use this schema; all paths are workspace-relative POSIX paths. All artifact_hashes
values are actual SHA-256 hex digests of current bytes. JSON arrays may be empty
only where stated. Source text supplied in chat can be preserved in feature-local
`pm-inputs/prd.md` and `pm-inputs/architecture.md`; do not overwrite originals.
For external source documents, snapshot their relevant supplied content and cite
the original URL. This makes source context available to the receiving agent.

- `schema_version`: integer `1`.
- `feature_dir`: resolved feature directory path.
- `inputs`: object with `prd` and `architecture`, each the original or preserved
  source document path present in artifact_hashes.
- `checklists`: non-empty array of evaluated checklist paths in artifact_hashes.
- `artifact_hashes`: mapping of document paths to SHA-256, including constitution,
  spec.md, plan.md, tasks.md, analysis report, original/snapshotted PRD and
  architecture, evaluated checklists, and all used research/design artifacts.
  Exclude handoff.md/handoff.json themselves to avoid self-referential hashes.
- `analysis`: object with `status` (`passed` or `blocked`) and `report` path.
- `handoff`: object with `status` (`prepared`, `dispatched`, `acknowledged`),
  `recipient` (name or null), `evidence` (actual dispatch/acknowledgment evidence
  or null). Dispatched/acknowledged require both recipient and evidence.
- `tasks`: non-empty array of objects, each containing:
  - `id`: Spec Kit ID such as `T001`.
  - `description`: concrete non-empty description.
  - `technical_requirements`: non-empty array of strings.
  - `dependencies`: array of exact task IDs; empty for no prerequisites.
  - `priority`: `P1`, `P2`, or `P3` (P1 highest). If project priorities differ,
    map them explicitly in handoff.md while preserving the original story ranking.
  - `acceptance_criteria`: non-empty array of objectively checkable strings.
  - `spec_refs`: non-empty array of `spec.md#requirement-or-section` references.
  - `architecture_refs`: non-empty array of source-architecture/design references,
    such as `docs/architecture.md#persistence`. Do not use the task list itself.
  - `files`: non-empty array of exact intended file or owned directory paths;
    prospective implementation files need not exist yet.
  - `blockers`: array of explicit blocking reasons; empty if none.
  - `status`: `ready`, `waiting`, `blocked`, `in_progress`, or `done`.
- `parallel_groups`: array of arrays of at least two task IDs, or empty. These are
  prospective independent cohorts; all external dependencies must finish before
  a cohort starts. No members may share owned paths or have transitive dependencies.

`done` matches a checked tasks.md box and requires observed completion evidence
in handoff.md. `ready` means final analysis passed, blockers empty, and every
dependency is done. `waiting` means analysis passed and blockers empty, but one
or more dependencies remain incomplete. `blocked` identifies unresolved blockers
or a blocked final analysis. `in_progress` requires actual Coding Agent evidence,
passed gates, empty blockers, and completed prerequisites. Do not mark planned
work in_progress merely because its packet was sent.

## Validation

From the workspace root, run the helper using the actual resolved skill path:

```sh
python3 .agents/skills/pm-agent/scripts/validate_handoff.py --workspace . specs/001-booking/handoff.json
```

The example feature path must be replaced with the resolved one. The validator is
read-only: it checks required fields and input/checklist presence, document
snapshots/references, exact task ID coverage and checkbox state, unknown/cyclic
dependencies, readiness, `[P]`
eligibility, and parallel file/directory conflicts. It reports ready/waiting/blocked
IDs, errors, and whether the packet is structurally eligible for dispatch. Exit
code 0 means structurally valid, including valid blocked drafts; inspect
`dispatch_eligible` before sending. Semantic coverage and technical correctness
remain the PM Agent's responsibility.

## Delivery and tracking

Discover the configured Coding Agent and real dispatch tool; do not assume the
agent exists. A request for the PM workflow authorizes its stated handoff, but
does not permit sending external email/chat messages or unrelated publication.
Follow `.codex/agents/qa-agent/skills/qa-agent/references/pipeline.md` and check
the shared QA retry gate. Automatically start/resume Coding Agent with the
validated packet using actual exposed tools, including the documented default-role
fallback when named custom types are not exposed. Printing an invocation is not
a trigger, and this requested handoff does not need another confirmation.
Send the validated packet paths, workspace/feature identity,
source context, ready IDs, dependency order, and next implementation instructions
to the actual Coding Agent for the next implementation stage. Keep PM analysis
separate from application changes. Record recipient and tool/thread receipt before
marking dispatched; acknowledgment requires the recipient's actual reply.

If all supported dispatch routes are unavailable, mark prepared, retain
the complete packet, and provide this next-stage prompt (substitute real paths):

```text
Coding Agent: read the feature's handoff.md and handoff.json, then the linked
constitution/spec/plan and workspace instructions. Revalidate artifact hashes.
Implement the ready task IDs with the installed speckit-implement workflow; follow
dependencies, priorities, acceptance criteria, and file ownership. Update task
checkboxes only after verification and report progress against these IDs. Do not
repeat requirement analysis or reinterpret confirmed product decisions. Escalate
new contradictions or blockers to PM Agent.
```

On progress updates, preserve evidence, synchronize tasks.md completion and JSON
status, recompute readiness, remove obsolete `[P]` markers, refresh changed
artifact hashes, and revalidate. Changed source/plan artifacts require semantic
reanalysis before claiming a previous handoff is still valid. Delivery evidence
is a historical receipt; re-dispatch materially revised packets and log it.
