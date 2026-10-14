# Coding Agent validation cases

| Case | Expected behavior |
| --- | --- |
| Valid PM packet | Check state/hashes, derive child tasks, implement in dependency order |
| Blocked/stale PM packet | Block affected work and request exact PM correction |
| New frontend behavior | MVVM separation and meaningful RED/GREEN/REFACTOR evidence |
| New backend operation | Valid OpenAPI first, Manager business logic, thin api-name-logic handler |
| Existing equivalent layout | Recorded responsibility/path mapping, no unrelated migration |
| Complete scope and passing checks | Actual QA start/resume call with packet and recorded receipt |
| QA failed with count 1–3 | Reproduce, regression test, fix, retest, automatically trigger QA |
| QA fourth failure | Stop repairs/dispatch; preserve evidence and halted state |
| Runtime has no custom type | Start canonical QA workflow via supported default agent |
| No dispatch tools | Pending exact packet/event; no fabricated trigger |
| Only selected task subset done | Report partial; do not claim the full requirement complete |

Executed 2026-10-14: registration, exact prompt/TOML equality, required prompt
structure, local skill/index and publication/file structure all PASS under
agent_package.py validate coding-agent. Skill-creator quick_validate.py PASS.
Cross-package Markdown references/publication and documentation hygiene PASS.

End-to-end application
and model behavior: NOT TESTED; no feature PRD/stack/handoff was supplied during
agent creation. Automatic tool delivery is specified but has not been exercised.
