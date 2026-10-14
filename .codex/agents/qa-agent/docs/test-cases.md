# QA Agent validation cases

| Case | Expected behavior |
| --- | --- |
| Requirements and tests pass | Counter resets; automatically start/resume PM with current report |
| Code mismatch or genuine required test failure | Counter increments once; Coding receives precise repair context |
| First/second/third failed cycle | Counts 1/2/3 route to Coding |
| Fourth failed cycle | Count 4 is >3; shared HALTED state and no next work trigger |
| Verification passes after external fixes while halted | Counter becomes 0; PM route resumes |
| Only comparison or only tests pass | No reset; confirmed failure counts or missing evidence blocks |
| Duplicate QA notification | No double count/reset or duplicate event dispatch |
| Old failure replay after new pass | No Coding route and no counter change |
| Old pass replay after new failure | No reset and no obsolete PM trigger |
| Stale source snapshot or revision | Reject state mutation and reconcile |
| Invalid retry_count boolean/string/negative | Reject config; never assume zero |
| Two concurrent finalized results | Lock/revision prevent lost state updates |
| No queued next requirement | PM is triggered to close scope and then awaits inputs |
| No supported dispatcher | Pending current event, no invented trigger |

Executed 2026-10-14: registration, exact prompt/TOML equality, required prompt
structure, local skill/index and publication/file structure all PASS under
agent_package.py validate qa-agent. Skill-creator quick_validate.py PASS.
Cross-package Markdown references/publication and documentation hygiene PASS.
qa_state.py status on the actual docs/config.yaml returned retry_count=0,
revision=0, ACTIVE; authoring tests only mutate isolated temporary configs.

The state helper's 21 unittest cases PASS, including CLI behavior, counts 1–4,
stop routing, full/partial pass behavior, halt recovery, duplicate/obsolete runs,
stale evidence before/while acquiring the lock, conflicting IDs, invalid counts,
concurrent updates, and revision reconciliation.

```sh
uv run --with pyyaml python -B -m unittest discover -s .codex/agents/qa-agent/skills/qa-agent/scripts -p 'test_*.py' -v
uv run .agents/skills/qa-agent/scripts/qa_state.py status
```

End-to-end
model comparison, application tests and live automatic dispatch: NOT TESTED.
The helper checks asserted outcomes/evidence structure, not their semantic truth.
