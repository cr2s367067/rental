# PM Agent invocation

When a user submits `/pm-agent` followed by a PRD and architecture documentation
as chat text, load `.agents/skills/pm-agent/SKILL.md` and execute its invocation
workflow with the remaining text as input. The same workflow is available through
the native Codex skill mention `$pm-agent`.

This is a repository instruction for routing submitted text. It does not register
a native `/pm-agent` entry in the host's slash-command menu. If the host rejects
the bare slash form before submission, use `$pm-agent`.

# Shared development pipeline

PM, Coding and QA agents follow
`.codex/agents/qa-agent/skills/qa-agent/references/pipeline.md` for automatic
PM → Coding → QA → PM (pass) or QA → Coding (fail) dispatch using real agent tools.

Before starting another requirement, coding task, repair batch or work dispatch,
read `.codex/agents/qa-agent/docs/config.yaml` through QA's qa_state.py status.
The single repository-wide retry_count is a non-negative integer. If it is >3,
stop this development loop and do not trigger more PM/Coding work. Stop reachable
active workers belonging to the loop with supported agent interruption tools;
preserve their work and do not terminate unrelated jobs.

Only QA's audited state helper records failed cycles and resets the count after
both requirement comparison and tests pass. Missing evidence is blocked; do not
reset because of an agent restart, new branch or feature switch. A halted pipeline
allows an explicitly requested verification after external fixes, not another
automatic coding repair. Do not claim a native role or trigger exists unless a
real tool invocation/receipt establishes it.
