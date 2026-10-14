# Architecture

`meta-agent` authors and validates agent packages. Invoke it to create or update
agents; it does not automatically perform their business tasks.

```text
Requirements -> inspection -> relevant research -> architecture
-> create/reuse skills -> publish -> generate docs/docs.md
-> prompt referencing the index -> synchronize TOML -> validation -> summary
```

Source design: `../prompt/meta-agent.md`. Canonical instructions:
`../prompt/system.md`. Registration: `../../meta-agent.toml`, containing an exact
copy of the canonical prompt. No model, provider, or permission override is needed.

## Skills

Read [docs.md](docs.md) to assess local capabilities. This index is generated
from every immediate `../skills/` directory containing `SKILL.md`, with exact
YAML names, descriptions, and resolving relative links. Select relevant skills
and load their full instructions only when needed. Reconcile missing or stale
metadata against the folder. Every new agent follows this same convention.

The canonical invocation skill is `../skills/meta-agent/`; its published entry
is `.agents/skills/meta-agent`, a relative directory symlink. It delegates only
when supported and authorized, otherwise executes the canonical workflow in
the current session, without recursive delegation.

## Verified dependency inventory

Inspection date: 2026-10-14.

| Dependency | Evidence and use | Fallback |
| --- | --- | --- |
| Filesystem and shell | Available; repository root verified; no nonempty applicable AGENTS.md found. | Report unavailable writes accurately. |
| Codex CLI | Version 0.162.1; official documentation confirms standalone project agent format. | Invocation skill runs locally when delegation is unavailable. |
| skill-creator | Installed skill read; initializer and quick validator available. | Author supported format manually if absent in another runtime. |
| openai-docs | Installed skill read; official compatibility pages retrieved. | Use verified local evidence and disclose unknown compatibility. |
| Existing skills | Ten `speckit-*` feature-workflow skills exist; none replaces agent packaging. | Reuse only when a new agent's scope calls for them. |
| Python and uv | Python 3.14.8 and uv installed; helper requires Python 3.11+. | Suitable Python environment or manual checks with limitations. |
| PyYAML and tomlkit | Inline dependencies for YAML parsing and format-preserving TOML updates. | Report missing dependencies; do not mark skipped checks as passed. |
| MCP | No MCP server required. Tools and connectors must be rediscovered per runtime. | Local authoring remains available; report unavailable integrations. |

User configuration was inspected for key and server names without writing
credentials into artifacts. CLI server settings and host connector catalogs
are different inventories; neither proves another runtime's access.

## Helpers and failures

`agent_package.py sync` builds the skill index and copies the canonical prompt
into registration while preserving optional settings and comments. It rejects
invalid names, missing prompts, mismatched registration names, malformed skill
metadata, and paths escaping the workspace. It does not author skills or publish
them. `validate` reads artifacts, reports drift and broken publication, and exits
nonzero on failure. Helper tests use disposable workspaces.

Output includes Agent Name, Purpose, Capabilities, Skills, Integrations, Generated
Files, Invocation, Validation, and Notes. Missing input, tool failure, or conflict
produces an accurate partial status. Syntax, script tests, model behavior, and
connector connectivity remain separate evidence categories.
