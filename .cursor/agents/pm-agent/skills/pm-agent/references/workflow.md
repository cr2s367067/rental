# Spec Kit PM workflow

## Preflight and preservation

- Read project instructions and PRD/architecture. Resolve the precise feature and
  version using explicit input and the installed feature-resolution scripts.
  Inspect `.specify/feature.json` if present; a branch or file-existence check by
  itself does not prove a spec matches the requested version. Ask if ambiguous.
- Verify the six required skills, templates, and helpers exist. Inspect the actual
  installed version rather than replacing it with online instructions. Do not
  initialize, upgrade, or overwrite unrelated project infrastructure as a shortcut.
- Use the resolved absolute feature directory for helper invocations. Current
  local helpers support `SPECIFY_FEATURE_DIRECTORY`; scope it to each command if
  needed and verify returned paths. Do not alter unrelated feature metadata.
- Snapshot existing constitution/spec bytes and task completion state before
  mutations. Keep snapshots outside active artifact paths. Record SHA-256 hashes
  in handoff.md; compare after each mutating stage/hook. Preserve source docs too.
- Existing empty or scaffold files still count as existing. Report substantive
  gaps and request a specific authorized completion/amendment; never delete a
  template file to force the missing-file branch. This repository currently has
  a template constitution, so a future PM run must surface that gap.
- Supply each stage with its scoped input and the existence/protection policy.
  Inspect extension hooks before dispatch; routine in-scope hooks retain existing
  authorization. A hook may not bypass spec protection or begin implementation.
  Fail the stage if a required hook cannot execute within the authorized scope.

## 1. speckit-constitution

If `.specify/memory/constitution.md` exists, read and reuse it, record REUSED, and
skip the skill's mutating command. Do not regenerate it. Validate its principles,
governance, and unresolved placeholders. If it is absent, load and execute the
installed skill with governance requirements derived from the PRD and architecture.
Use its templates and required propagation, then verify the completed artifact.
Any existing feature spec remains protected during propagation.

## 2. speckit-specify

If the resolved feature/version has a spec, reuse it byte-for-byte; do not invoke
the generating command. Record its identity and hash. Differences between new PRD
text and that spec become product questions, not silently merged requirements.
If no matching spec exists, load and execute the installed skill on the PRD and
capture its actual feature directory/branch. Avoid branch creation for reused
features. Do not put architectural implementation choices into product requirements.

## 3. speckit-plan

Load and execute the skill with the PRD, architecture, and matching spec. Generate
or reconcile plan.md, research.md, data-model.md, applicable contracts/, and
quickstart.md according to its templates. Preserve existing useful content.
Check the constitution before and after design. Retrieve current official
technical documentation through Context7 when available or the web; verify
against actual pinned dependency versions. Cite URLs, versions, and access dates
with each material decision. A technical evidence gap that affects correctness
blocks affected tasks. Do not resolve product intent through technical research.

## 4. speckit-checklist

Provide explicit scope: requirements and plan quality, PM/Coding Agent reviewers,
pre-implementation readiness, standard depth adjusted for documented project risk.
Load and execute the skill, preserving its append behavior for existing checklists.
Its questions assess completeness, clarity, consistency, measurability, assumptions,
and edge-case coverage; they are not implementation tests.
Evaluate every applicable item with a document reference or a specific gap.
Mark satisfied items only with evidence and explain non-applicable items. Keep
unresolved product questions visible and stop work that depends on their answers.

## 5. speckit-tasks

Load and execute the skill with the design artifacts and checklist findings.
Keep its task lines compatible with implementation tools:

```text
- [ ] T001 Create booking table migration in db/migrations/001_booking.sql
- [ ] T002 [US1] Implement booking persistence in src/bookings/repository.ts
```

Each task is one concrete deliverable with bounded ownership and measurable
acceptance. Use handoff.json for the additional required metadata, indexed by
the exact task ID. Map every in-scope buildable requirement and success criterion
to task IDs in handoff.md. Explain business outcomes that are not implementation
tasks; do not invent tasks for post-launch metrics.

Use spec story priorities (P1 highest, then P2, P3), with explicit rationale for
technical prerequisites. Preserve completed tasks, checkbox state, and IDs on
resumed runs. For an incomplete task that needs splitting, retain its ID for one
concrete part, allocate new IDs after the current maximum for the rest, and update
all dependencies and traceability. Record the split; do not renumber unrelated work.

Dependencies must be explicit and acyclic, including shared schemas, contracts,
setup, migrations, and integration ordering. Priority is not a substitute for
dependency ordering. Record prospective parallel groups only for independent
deliverables with no shared file/directory ownership or transitive dependency.
Use `[P]` only when installed skill rules permit it: distinct files and no
incomplete prerequisites. Future parallel waves can be documented without `[P]`.

## 6. speckit-analyze and remediation

Run the installed skill only after tasks.md is complete. Keep its entire analysis
pass read-only, including hooks. Capture its returned findings; after the pass
finishes, the PM orchestrator writes analysis.md with coverage, severity,
locations, and recommended remediation. Distinguish captured analysis from edits.

The PM request authorizes separate remediation of clear technical inconsistencies
in plan/research/design/task/checklist documents. Apply evidence-backed fixes,
record decisions and affected IDs, and rerun analysis and checklist evaluation.
Do not ask for approval again for already authorized routine technical corrections.

Unclear product intent requires a concise question with the conflicting sources
and affected work. Continue independent work, leave affected tasks blocked, and
wait for the answer before their dependent stages. Record confirmed decisions in
analysis.md and applicable planning/task documents. Change an existing spec only
when the user explicitly requests the specific amendment; a clarification answer
alone must not be treated as automatic permission to rewrite the spec. Constitution
changes require a separately explicit update request. Never weaken either artifact
to make analysis pass.

Any remaining CRITICAL/HIGH finding, failed constitution gate, or unresolved
material question makes final analysis blocked. Explain lower severity residual
findings and their disposition. If remediation stops making progress, surface the
remaining cause rather than repeating generation. Revalidation is required after
any subsequent artifact change.

## Handoff

Read [handoff.md](handoff.md). Prepare the packet only with accurate gate status.
Drafts can preserve blocked work but must not advertise it as implementation-ready.
Reused constitution/spec snapshots must still match unless specifically amended.
Separate task readiness from delivery and implementation status. Dispatch only
when the packet passes and a real authorized recipient/mechanism exists; otherwise
provide the prepared packet and the next invocation without claiming delivery.
