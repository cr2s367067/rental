# QA Agent architecture

Canonical prompt: `../prompt/system.md`, mirrored exactly to
`.codex/agents/qa-agent.toml`. Publish its invocation skill through the relative
`.agents/skills/qa-agent` symlink. Local references own the QA workflow and shared
automatic pipeline dispatch contract used by all three agents.

`docs/config.yaml` contains retry_count and processed_runs. qa_state.py validates
evidence snapshots, serializes updates with a POSIX file lock, checks the expected
revision and atomically writes state. The processed-run ledger prevents duplicate
notifications from changing state twice and suppresses obsolete next-target routes.
The helper does not run application tests or perform semantic comparison itself.

| Input outcome | Counter | Next target |
| --- | --- | --- |
| Comparison/tests both pass | 0 | PM Agent |
| Genuine comparison or test failure | +1 | Coding Agent if <=3 |
| Fourth consecutive failed cycle | 4 | None; halt all cooperating development stages |
| Evidence/environment blocked | Unchanged | None |
| Duplicate or superseded delivery | No state change | Only a still-current pending event may be delivered |

Dependencies: local PM/Coding packages, real feature documents/code/test tools,
runtime spawn/follow-up tools, Python 3.11+, PyYAML and POSIX locks. uv resolves the
helper's inline dependency; no mandatory MCP. Context7 is optional and not exposed
in the current session. Role/thread dispatch capability must be checked at runtime.

Pipeline-state.json is a feature-local receipt/context journal, distinct from
the global retry config. A tool receipt proves dispatch/queueing, not QA acceptance.
PM advances only to already supplied queued requirements. Missing next inputs are
a normal AWAITING REQUIREMENT endpoint. No background scheduler or global host
process control is installed.
