# QA Agent requirements

| Requirement | Implementation |
| --- | --- |
| Receive Coding results | Snapshot-bound Coding QA completion packet |
| Compare requirements and result | Acceptance coverage plus independent relevant tests |
| All good triggers PM next requirement | Record full pass/reset, actual automatic PM start/resume |
| Failures tell Coding what to fix | Task/requirement/file refs, expected/actual, reproduction and correction guidance |
| docs/config.yaml retry_count integer | Initialized in this agent's docs folder, audited helper updates |
| retry_count >3 stops entire development loop | Fourth consecutive failed cycle halts shared gate; no repair/work dispatch |
| Pass resets retry count | Only comparison=passed AND tests=passed reset to 0 |
| Three-agent automatic transitions | Shared pipeline procedure, real tools, role fallback, idempotent event receipts |

Interpretation: one failed completed QA cycle increments once, not once per failing
test. A confirmed comparison failure also counts as a failed cycle; missing
evidence/tooling is BLOCKED and does not change the counter. Counter is shared
repository-wide for this development pipeline. A passing verification after
external fixes can reset a halted gate; no automatic fifth repair attempt occurs.
Notifications use agent tools, not external email/chat services.
