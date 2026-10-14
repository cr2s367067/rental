# Test cases

Validation date: 2026-10-14. This document separates executed artifact and helper
checks from runtime model behavior.

## Package checks

| Check | Evidence | Status |
| --- | --- | --- |
| Registration | Parsed TOML; developer instructions exactly equal canonical prompt. | PASS |
| Prompt | Four mandatory sections, seven steps, nonempty content, concrete skill-index reference. | PASS |
| Skills | Parsed frontmatter; bundled skill-creator quick validator reports Skill is valid. | PASS |
| Index | Generated docs/docs.md exactly matches local skill names, descriptions, and relative paths. | PASS |
| Structure and publication | Required files exist; relative publication symlink resolves with supporting resources. | PASS |
| Helpers | All 15 disposable-workspace tests passed. | PASS |

Commands executed from the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 uv run .agents/skills/meta-agent/scripts/agent_package.py sync meta-agent
PYTHONDONTWRITEBYTECODE=1 uv run .agents/skills/meta-agent/scripts/agent_package.py validate meta-agent
PYTHONDONTWRITEBYTECODE=1 uv run --with pyyaml --with tomlkit python -m unittest discover -s .agents/skills/meta-agent/scripts -p 'test_*.py' -v
uv run --with pyyaml python /Users/kuan/.codex/skills/.system/skill-creator/scripts/quick_validate.py .codex/agents/meta-agent/skills/meta-agent
git diff --check
```

The helper suite covers a complete agent package with multiple skills; sorted
index names, descriptions, and paths; preserved optional TOML settings and
idempotent sync; metadata, addition, and removal drift; missing publication;
incomplete structure; invalid YAML with no partial sync writes; invalid names
and escaping paths; registration conflicts; multiline metadata; complete copied
publication and stale resources; prompt quotes and backslashes; empty metadata;
explicit empty inventory; and external resource symlink rejection.

The source design, canonical prompt, and new-agent authoring template were
reviewed for the inherited skill-index rule. This verifies authoring instructions
and helper behavior, not a model's autonomous capability selection.

## Representative model behavior cases

| Case | Input | Expected observable result | Status |
| --- | --- | --- | --- |
| Normal | Create a read-only repository research agent with cited file findings. | Complete package, focused prompt, indexed invocation skill, accurate summary. | NOT TESTED |
| Incomplete | Create an agent, with no objective or responsibilities provided. | Request the missing objective before creating an arbitrary agent. | NOT TESTED |
| Invalid | Use agent name ../outside. | Reject the invalid name without outside-workspace writes. | NOT TESTED |
| Tool failure | Create an agent requiring an unavailable MCP integration. | Disclose missing dependency; define an honest fallback or report blocked functionality. | NOT TESTED |
| Expected output | Create a document agent with two meaningful local capabilities. | Index includes all local skills and invocation; prompt references its own index without embedding a static list. | NOT TESTED |
| Selection | A task matches one skill among multiple indexed descriptions. | Read the index, select relevant skills, and load applicable SKILL.md instructions. | NOT TESTED |
| Stale index | A skill's description changes after generation. | Detect drift and regenerate the index from actual frontmatter. | NOT TESTED |

Runtime model tests and live MCP connectivity are distinct from helper tests.
No separate model session is launched by the packaging validator; runtime
behavior remains NOT TESTED unless a dedicated execution is recorded here.
