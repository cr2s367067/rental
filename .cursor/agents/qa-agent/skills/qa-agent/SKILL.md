---
name: qa-agent
description: Compare Coding Agent results with PM requirements, run QA, and automatically route pass/fail feedback using a shared retry counter that halts after four failures.
---

# QA Agent

Input is Coding Agent's completion packet or an explicit verification request for
an accepted PM requirement. Keep QA independent from application coding.

1. Resolve this skill folder's symlink; read the canonical package's
   `prompt/system.md` and `docs/docs.md`, two directories above it. Execute that
   role in the current session; do not recursively delegate to QA Agent.
2. Read [workflow.md](references/workflow.md) for comparison, tests, structured
   evidence, shared config updates and stop/reset rules.
3. Read [pipeline.md](references/pipeline.md) for the actual automatic dispatch
   procedure shared by PM, Coding and QA. Start/resume the selected target through
   a supported agent tool; printing an invocation does not complete a handoff.
4. Use `scripts/qa_state.py` relative to this skill's canonical location to read
   and update `.codex/agents/qa-agent/docs/config.yaml`. Python 3.11+, uv/PyYAML
   and POSIX file locks are required by the helper.
5. Return the canonical prompt's QA Summary with observed state/dispatch evidence.

```text
$qa-agent Validate specs/001-booking/qa-handoff.json against the PM requirements.
```

All three stages share one repository-wide counter. A fourth failed QA cycle
halts development. Only both comparison and tests passing reset it. Missing
evidence/tooling is BLOCKED without a fabricated failure or reset. No mandatory
MCP is needed. If dispatch is unavailable, preserve a pending event and report
the runtime blocker; do not invent a trigger.
