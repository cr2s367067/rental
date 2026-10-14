# Coding Agent architecture

Canonical prompt: `../prompt/system.md`, mirrored exactly to
`.codex/agents/coding-agent.toml`. Publish the local invocation skill at
`.agents/skills/coding-agent` through a relative symlink. Its references define
PM intake, child tasks, TDD/MVVM/OpenAPI/Manager conventions, and completion output.

| Dependency | Availability/use |
| --- | --- |
| PM Agent and handoff validator | Existing local package; accepted task metadata and source snapshots |
| speckit-implement | Installed; implementation prerequisites, task execution and hooks |
| speckit-converge | Installed; append-only post-implementation gap assessment |
| QA Agent/config/helper | Created alongside Coding; shared state and independent verification |
| Agent orchestration | Exposed spawn/follow-up tools; custom role availability is runtime-dependent; canonical default-role fallback |
| Context7 | Not exposed in this authoring session; optional official-documentation fallback |
| Project test/contract tools | Resolved from the real feature stack, currently no application stack supplied |

No mandatory MCP. The shared dispatch procedure is QA's pipeline.md; the shared
counter is QA's docs/config.yaml. PM owns intent, Coding owns implementation and
QA owns independent verdict/state. Child task IDs do not replace PM IDs. The
original received packet is preserved while expected completion metadata evolves.

The fourth failed QA cycle halts all cooperating pipeline stages. A shared state
gate is checked at action boundaries; supported interruptions stop reachable
pipeline agents. This does not claim OS process termination or a background daemon.
