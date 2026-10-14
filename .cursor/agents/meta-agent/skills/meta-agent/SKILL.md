---
name: meta-agent
description: Create or update reusable Codex agents from user requirements, including prompts, registration, documentation, indexed skills, and validation.
---

# Meta-Agent

Input is an agent objective with optional name, workspace, skills, integrations,
and constraints. Default to the current repository; preserve a specified location.

## Invocation

1. Locate `.codex/agents/meta-agent/prompt/system.md` in the repository containing
   this skill. Resolve a symlinked skill folder first; its canonical agent package
   is two directory levels above it.
2. Read that prompt. Delegate to `meta-agent` only when supported and authorized,
   passing the complete requirements and workspace. If already Meta-Agent, or
   delegation is unavailable, execute the workflow in the current session.
   Never delegate recursively.
3. Read `.codex/agents/meta-agent/docs/docs.md` to assess local capabilities;
   discover installed skills separately through the runtime catalog.
4. Return the prompt's Agent Summary with real artifacts and actual checks.

## Packaging helpers

Resolve `scripts/agent_package.py` relative to this skill folder. It synchronizes
the canonical prompt into registration and creates `docs/docs.md` from every
local `SKILL.md` frontmatter. Validation checks registration drift, frontmatter,
publication, required structure, and skill-index accuracy.

From the target workspace root:

```sh
uv run .agents/skills/meta-agent/scripts/agent_package.py sync agent-name --description "A focused agent description"
uv run .agents/skills/meta-agent/scripts/agent_package.py validate agent-name
```

Resolve the helper from its actual skill location when it is not published in
the target workspace. Pass `--workspace` before the subcommand for another root.
Python 3.11+ is required. `uv run` resolves inline PyYAML and tomlkit dependencies;
alternatively use Python with those packages installed. If neither is available,
perform checks manually and report helper execution as unavailable.

`sync` creates registration, or preserves existing TOML settings while updating
instructions. A description is required only for new registration. It refuses
unsafe paths and mismatched existing names. It does not author prompts or skills
or publish them. Do not overwrite naming conflicts to make validation pass.

Read [references/prompt-template.md](references/prompt-template.md) when writing
another agent's system prompt. Replace all template placeholders. Every new
agent references its own `docs/docs.md` and selects skills on demand.

After prompt or metadata edits run `sync`, then `validate`. For helper changes:

```sh
uv run --with pyyaml --with tomlkit python -m unittest discover -s .agents/skills/meta-agent/scripts -p 'test_*.py'
```

Adjust that path to this skill's actual location when needed. Helper checks do
not exercise a model or prove connector connectivity; record those separately.
