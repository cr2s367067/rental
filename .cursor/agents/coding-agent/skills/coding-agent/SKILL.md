---
name: coding-agent
description: Implement PM Agent tasks with TDD, frontend MVVM, and OpenAPI-first backend Managers, then automatically trigger QA Agent or repair its reported defects.
---

# Coding Agent

Input is a validated PM handoff or a QA failure report for an accepted requirement.
Default to the current workspace; do not create a new PRD or change product scope.

1. Resolve this skill's symlink and read the canonical agent package's
   `prompt/system.md` and `docs/docs.md`, two directories above this skill folder.
   Execute that role in the current session. Delegate only when supported and
   authorized; never delegate recursively to Coding Agent.
2. Read [execution.md](references/execution.md) for PM intake, subtask tracking,
   implementation, completion checks, and automatic QA handoff.
3. Read [coding-patterns.md](references/coding-patterns.md) for affected frontend
   or backend work. Load installed Spec Kit implementation/convergence skills
   and PM's handoff validator as required.
4. Read QA's shared [pipeline procedure](../../../qa-agent/skills/qa-agent/references/pipeline.md)
   and [state procedure](../../../qa-agent/skills/qa-agent/references/workflow.md).
   Follow their actual automatic agent dispatch and shared stop gate.
5. Return the system prompt's Coding Summary with observed validation and receipts.

```text
$coding-agent Implement the PM handoff in specs/001-booking/handoff.json.
```

Required dependencies: PM packet/validator, Spec Kit project infrastructure and
installed implementation skills, and QA's config/state helper. No mandatory MCP
is needed. If an agent role is not exposed, the shared procedure can start its
canonical skill/prompt through a supported default-agent tool. If all dispatch
tools are unavailable, report PENDING with the completed packet.
