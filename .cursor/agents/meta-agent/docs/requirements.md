# Requirements

Complete the supplied Meta-Agent design as a reusable repository-local Codex
agent. Preserve the design at `../prompt/meta-agent.md`; implement its workflow
in canonical `../prompt/system.md` and standalone registration.

Required input is a meaningful agent objective. Optional inputs include name,
workspace, responsibilities, expected formats, skills, integrations, constraints,
and runtime. Default to the current repository and Codex. Infer routine details.

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-01 | Analyze requirements, inspect workspace, research relevant gaps, and design focused agents. | Requirements and architecture define scope, dependencies, and output. |
| FR-02 | Preserve the specified `.codex/agents/` layout. | Required files exist; unrelated files are untouched. |
| FR-03 | Use four prompt sections and seven Analyze Flow steps. | Template validation and content review pass. |
| FR-04 | Register supported name, description, and developer instructions. | TOML parses and instructions exactly match the prompt. |
| FR-05 | Reuse installed skills; create focused capabilities and a discoverable invocation skill. | Valid YAML and resolving repository publication. |
| FR-06 | After creating skills, generate `docs/docs.md` from every local skill's exact name and description, including invocation. | Sorted index matches metadata and includes resolving relative links. |
| FR-07 | Prompt references the index; relevant skill instructions load on demand. | Identify and Use Skills contains the concrete index path. |
| FR-08 | Apply FR-06 and FR-07 to every generated agent. | System workflow and authoring template both require the convention. |
| FR-09 | Synchronize registration and index on updates. | Helper detects drift and preserves optional TOML settings. |
| FR-10 | Validate normal, incomplete, invalid, unavailable-tool, and expected-output cases honestly. | Test-case documentation separates checks from model behavior tests. |

Required output artifacts are registration, `prompt/system.md`, requirements,
architecture, skill index, test cases, and a published invocation skill. External
references and supporting resources are created only when needed. Return an
Agent Summary with real paths, invocation, checks, and material limitations.

Names use lowercase kebab-case. Local inventory covers immediate skill folders
containing `SKILL.md`; installed external dependencies are recorded separately.
Do not overwrite unrelated conflicts, store credentials, or change global
permissions, models, providers, or MCP configuration. Helper checks require
Python 3.11+, PyYAML, and tomlkit, resolved through installed uv or a suitable
Python environment. Syntax and model behavior are separate validation categories.

Success means all artifacts exist, registration matches the prompt, publication
resolves, index matches local skills, helper tests pass, and every new-agent
prompt carries the index convention forward.
