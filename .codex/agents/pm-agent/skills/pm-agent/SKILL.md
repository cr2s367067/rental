---
name: pm-agent
description: Turn a PRD and architecture documentation into validated Spec Kit plans, actionable tasks, and a Coding Agent handoff. Use for PM Agent planning or /pm-agent requests.
---

# PM Agent

Accept a PRD and architecture documentation, plus optional workspace, feature or
version, and Coding Agent recipient. Produce validated planning artifacts and a
tracked implementation handoff. Use the current repository by default.

## Invocation

1. Resolve this skill folder's symlink, then locate the canonical agent package
   two directories above it. Read `prompt/system.md` and `docs/docs.md` there.
2. Execute the PM workflow in the current session. Delegate to `pm-agent` only
   when that agent type is actually available and delegation is authorized; pass
   the complete input and workspace. An active PM Agent never delegates to itself.
3. Read [workflow.md](references/workflow.md) before orchestration and
   [handoff.md](references/handoff.md) when generating or validating task metadata.
4. Load the installed Spec Kit skills on demand and execute constitution →
   specify → plan → checklist → tasks → analyze, with the workflow's existence
   guards. Reuse existing constitution/spec artifacts. Analysis itself is read-only;
   remediation follows separately. Clarify uncertain product intent before
   dependent work. No application implementation occurs in the PM session.
5. Check QA's shared retry gate and load its pipeline.md. After validation,
   automatically start/resume Coding Agent through actual exposed tools (including
   the canonical default-role fallback), with no extra confirmation. Record the
   receipt or an exact unavailable-dispatch blocker and pending packet.
6. On a QA PASS notification, verify the reset-state/current report, close the
   accepted requirement, and process only the next already supplied queued
   requirement. If none exists, report AWAITING REQUIREMENT. Return the canonical
   prompt's PM Handoff Summary.

Native Codex invocation:

```text
$pm-agent Use docs/prd.md and docs/architecture.md for feature 001-booking.
```

Requested text alias, routed by this repository's AGENTS.md:

```text
/pm-agent Use docs/prd.md and docs/architecture.md for feature 001-booking.
```

The alias works when submitted as chat text; it does not install a native slash
menu item. A host that rejects unknown slash commands requires `$pm-agent`.

## Dependencies and failures

Required: installed Spec Kit skills, `.specify/` scripts and templates, and
accessible project inputs. Context7 is optional; discover its tools at runtime
and fall back to official online documentation. Missing required dependencies,
ambiguous feature selection, or incomplete protected artifacts block the affected
stage; report them instead of inventing success or replacing project files.

The handoff validator uses Python 3.11+ and the standard library. Resolve
`scripts/validate_handoff.py` relative to this skill's actual location.
