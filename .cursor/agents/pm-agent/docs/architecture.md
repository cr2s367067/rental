# PM Agent architecture

The canonical prompt is `../prompt/system.md`, mirrored exactly into the
`.codex/agents/pm-agent.toml` registration.
The local invocation skill loads that prompt and its generated skill index,
then orchestrates existing Spec Kit skills. Detailed workflow and handoff
contracts are local skill references. The standard-library handoff validator is
read-only and does not replace semantic analysis.

Publication is a relative symlink:
`.agents/skills/pm-agent` → `../../.codex/agents/pm-agent/skills/pm-agent`.
Root AGENTS.md routes submitted `/pm-agent` text to this skill. Native Codex uses
`$pm-agent` or its skill selector; no native bare slash command is registered.

## Dependency inventory

| Dependency | Availability and use |
| --- | --- |
| speckit-constitution | Installed at `.agents/skills/speckit-constitution/SKILL.md`; create only when absent |
| speckit-specify | Installed at `.agents/skills/speckit-specify/SKILL.md`; generate only when matching spec absent |
| speckit-plan | Installed at `.agents/skills/speckit-plan/SKILL.md`; technical design/research |
| speckit-checklist | Installed at `.agents/skills/speckit-checklist/SKILL.md`; requirements quality |
| speckit-tasks | Installed at `.agents/skills/speckit-tasks/SKILL.md`; task checklist |
| speckit-analyze | Installed at `.agents/skills/speckit-analyze/SKILL.md`; read-only consistency pass |
| Spec Kit scripts/templates | Installed in `.specify/`; integration manifest records version 0.14.2 |
| Context7 MCP | No tools exposed in this creation session; optional runtime discovery |
| Online primary documentation | Available and used to verify agent packaging and Spec Kit integration |
| Python 3.11+ | Required by handoff validator; standard library only |
| Coding Agent | Registered at `.codex/agents/coding-agent.toml`; automatic start/resume, with canonical prompt/skill fallback |
| QA Agent retry gate | `.codex/agents/qa-agent/docs/config.yaml` and qa_state.py; stop when retry_count >3; only full QA pass resets |
| Meta-Agent packaging helper | Available; sync/validate used for registration and local skill index |

External Spec Kit skills stay in the runtime catalog and this inventory, rather
than being copied into the local skill index or modified. Missing dependencies
block their stage. Optional Context7 has no mandatory MCP metadata or credentials.

## State and failure handling

Feature artifacts live in the resolved Spec Kit feature directory. tasks.md is
the implementation checklist; handoff.json augments each exact task ID with
technical metadata. Artifact hashes prevent stale packets from passing structural
validation. handoff.md carries semantic coverage, decisions, and delivery history.

Readiness (`ready`, `waiting`, `blocked`, `in_progress`, `done`) is separate from
delivery (`prepared`, `dispatched`, `acknowledged`). Dependency completion determines
which tasks can start now. Analysis remains read-only; remediation and report
persistence occur after the pass. Protected spec/constitution changes require
explicit user instructions. Product ambiguity blocks dependent work; routine
evidence-backed planning/task corrections proceed under the PM request.

The shared pipeline dispatch procedure lives in QA's local skill references.
PM receives QA PASS, closes the accepted requirement, and advances only to an
already supplied queued requirement. No next requirement means AWAITING REQUIREMENT.
